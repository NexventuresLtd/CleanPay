"""
System Admin Views
API endpoints for system administrators to manage companies.
"""

from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta

from .company_models import Company
from .company_serializers import (
    CompanyListSerializer,
    CompanyDetailSerializer,
    CompanyCreateSerializer,
    CompanyUpdateSerializer,
    CompanyStatsSerializer,
)
from .permissions import IsSystemAdmin
from customers.models import Customer
from operations.models import Collector


class SystemAdminCompanyViewSet(viewsets.ModelViewSet):
    """
    ViewSet for System Admins to manage companies.
    Only accessible by users with system_admin role.
    """
    
    permission_classes = [IsSystemAdmin]
    queryset = Company.objects.all().order_by('-created_at')
    
    def get_serializer_class(self):
        if self.action == 'list':
            return CompanyListSerializer
        elif self.action in ['create']:
            return CompanyCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return CompanyUpdateSerializer
        return CompanyDetailSerializer
    
    def get_queryset(self):
        """Filter companies based on query parameters."""
        queryset = super().get_queryset()
        
        # Filter by status
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Filter by verification status
        is_verified = self.request.query_params.get('is_verified')
        if is_verified is not None:
            queryset = queryset.filter(is_verified=is_verified.lower() == 'true')
        
        # Search by name or email
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | Q(email__icontains=search)
            )
        
        return queryset
    
    def create(self, request, *args, **kwargs):
        """Create a new company and automatically create an admin user."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        company = serializer.save()
        
        # Get admin credentials if they were created
        response_data = CompanyDetailSerializer(company, context={'request': request}).data
        if hasattr(company, '_admin_credentials'):
            response_data['admin_credentials'] = company._admin_credentials
        
        headers = self.get_success_headers(serializer.data)
        return Response(response_data, status=status.HTTP_201_CREATED, headers=headers)
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get overall system statistics."""
        companies = Company.objects.all()
        
        # Calculate expiring licenses (within 30 days)
        today = timezone.now().date()
        thirty_days = today + timedelta(days=30)
        
        stats = {
            'total_companies': companies.count(),
            'active_companies': companies.filter(status='active').count(),
            'suspended_companies': companies.filter(status='suspended').count(),
            'total_customers': Customer.objects.count(),
            'total_collectors': Collector.objects.count(),
            'expiring_licenses': companies.filter(
                license_end_date__lte=thirty_days,
                license_end_date__gte=today
            ).count(),
        }
        
        serializer = CompanyStatsSerializer(stats)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """Activate a company."""
        company = self.get_object()
        company.status = 'active'
        company.save()
        
        serializer = self.get_serializer(company)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def suspend(self, request, pk=None):
        """Suspend a company."""
        company = self.get_object()
        company.status = 'suspended'
        company.save()
        
        serializer = self.get_serializer(company)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def verify(self, request, pk=None):
        """Verify a company."""
        company = self.get_object()
        company.is_verified = True
        company.save()
        
        serializer = self.get_serializer(company)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def stats(self, request, pk=None):
        """Get statistics for a specific company."""
        company = self.get_object()
        
        # Get counts
        customers = Customer.objects.filter(company=company)
        collectors = Collector.objects.filter(company=company)
        
        from operations.models import ServiceArea, Schedule
        service_areas = ServiceArea.objects.filter(company=company)
        
        # Get today's collections
        today = timezone.now().date()
        from datetime import datetime
        today_start = datetime.combine(today, datetime.min.time())
        today_end = datetime.combine(today, datetime.max.time())
        
        collections_today = Schedule.objects.filter(
            service_area__company=company,
            scheduled_date__range=(today_start, today_end)
        ).count()
        
        stats = {
            'total_customers': customers.count(),
            'active_customers': customers.filter(status='active').count(),
            'total_collectors': collectors.count(),
            'service_areas': service_areas.count(),
            'collections_today': collections_today,
        }
        
        return Response(stats)
    
    @action(detail=True, methods=['get'])
    def customers(self, request, pk=None):
        """Get all customers for a company."""
        company = self.get_object()
        customers = Customer.objects.filter(company=company)
        
        # Simple customer data
        customer_data = [{
            'id': str(c.id),
            'full_name': c.full_name,
            'card_number': c.card_number,
            'email': c.email,
            'phone': c.phone,
            'status': c.status,
            'prepaid_balance': c.prepaid_balance,
            'created_at': c.created_at,
        } for c in customers[:100]]  # Limit to 100 for performance
        
        return Response({
            'count': customers.count(),
            'results': customer_data,
        })
    
    @action(detail=True, methods=['get'])
    def collectors(self, request, pk=None):
        """Get all collectors for a company."""
        company = self.get_object()
        collectors = Collector.objects.filter(company=company)
        
        # Simple collector data
        collector_data = [{
            'id': str(c.id),
            'employee_id': c.employee_id,
            'full_name': c.full_name,
            'email': c.email,
            'phone': c.phone,
            'status': c.status,
            'employment_type': c.employment_type,
            'rating': float(c.rating),
            'total_collections': c.total_collections,
        } for c in collectors[:100]]  # Limit to 100 for performance
        
        return Response({
            'count': collectors.count(),
            'results': collector_data,
        })
    
    @action(detail=True, methods=['post'])
    def extend_license(self, request, pk=None):
        """Extend company license."""
        company = self.get_object()
        days = request.data.get('days', 365)
        
        if company.license_end_date:
            # Extend from current end date
            from datetime import timedelta
            company.license_end_date = company.license_end_date + timedelta(days=days)
        else:
            # Set new license
            from datetime import timedelta
            today = timezone.now().date()
            company.license_start_date = today
            company.license_end_date = today + timedelta(days=days)
        
        company.save()
        
        serializer = self.get_serializer(company)
        return Response(serializer.data)

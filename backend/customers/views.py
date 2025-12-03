"""
Customer Management Views
Handles CRUD operations for Customer, PaymentMethod, and CustomerNote models.
"""

from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q, Count, Sum
from django.utils import timezone
from datetime import timedelta
from django_filters.rest_framework import DjangoFilterBackend

from .models import Customer, PaymentMethod, CustomerNote
from .serializers import (
    CustomerListSerializer,
    CustomerDetailSerializer,
    CustomerCreateUpdateSerializer,
    CustomerStatsSerializer,
    PaymentMethodSerializer,
    CustomerNoteSerializer
)


class CustomerViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Customer model.
    Provides CRUD operations and additional actions for customer management.
    """
    
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['first_name', 'last_name', 'email', 'company_name', 'phone']
    ordering_fields = ['created_at', 'updated_at', 'first_name', 'last_name', 'company_name', 'status']
    ordering = ['-created_at']
    filterset_fields = {
        'status': ['exact', 'in'],
        'payment_terms': ['exact', 'in'],
        'created_at': ['gte', 'lte', 'exact'],
        'company_name': ['exact', 'icontains'],
        'industry': ['exact', 'icontains'],
    }
    
    def get_queryset(self):
        """Get queryset of customers, excluding soft-deleted by default."""
        queryset = Customer.objects.filter(deleted_at__isnull=True)
        
        # Option to include deleted customers
        include_deleted = self.request.query_params.get('include_deleted', 'false').lower() == 'true'
        if include_deleted:
            queryset = Customer.objects.all()
        
        # Filter by tags
        tags = self.request.query_params.get('tags')
        if tags:
            tag_list = [tag.strip() for tag in tags.split(',')]
            for tag in tag_list:
                queryset = queryset.filter(tags__contains=[tag])
        
        return queryset.prefetch_related('payment_methods', 'customer_notes')
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action == 'list':
            return CustomerListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return CustomerCreateUpdateSerializer
        return CustomerDetailSerializer
    
    def perform_create(self, serializer):
        """Set created_by when creating a customer."""
        serializer.save(created_by=self.request.user)
    
    def destroy(self, request, *args, **kwargs):
        """Soft delete customer instead of hard delete."""
        instance = self.get_object()
        instance.soft_delete()
        return Response(
            {'message': 'Customer archived successfully.'},
            status=status.HTTP_200_OK
        )
    
    @action(detail=True, methods=['post'])
    def restore(self, request, pk=None):
        """Restore a soft-deleted customer."""
        customer = self.get_object()
        customer.deleted_at = None
        customer.status = 'active'
        customer.save()
        
        serializer = self.get_serializer(customer)
        return Response({
            'message': 'Customer restored successfully.',
            'data': serializer.data
        })
    
    @action(detail=True, methods=['post'])
    def suspend(self, request, pk=None):
        """Suspend a customer account."""
        customer = self.get_object()
        customer.status = 'suspended'
        customer.save()
        
        serializer = self.get_serializer(customer)
        return Response({
            'message': 'Customer suspended successfully.',
            'data': serializer.data
        })
    
    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """Activate a suspended customer account."""
        customer = self.get_object()
        customer.status = 'active'
        customer.save()
        
        serializer = self.get_serializer(customer)
        return Response({
            'message': 'Customer activated successfully.',
            'data': serializer.data
        })
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get customer statistics."""
        now = timezone.now()
        week_ago = now - timedelta(days=7)
        month_ago = now - timedelta(days=30)
        
        total_customers = Customer.objects.filter(deleted_at__isnull=True).count()
        active_customers = Customer.objects.filter(status='active', deleted_at__isnull=True).count()
        suspended_customers = Customer.objects.filter(status='suspended', deleted_at__isnull=True).count()
        archived_customers = Customer.objects.filter(status='archived').count()
        
        customers_with_payment_methods = Customer.objects.filter(
            deleted_at__isnull=True
        ).annotate(
            pm_count=Count('payment_methods')
        ).filter(pm_count__gt=0).count()
        
        total_credit = Customer.objects.filter(
            deleted_at__isnull=True
        ).aggregate(
            total=Sum('credit_limit')
        )['total'] or 0
        
        new_this_week = Customer.objects.filter(
            created_at__gte=week_ago,
            deleted_at__isnull=True
        ).count()
        
        new_this_month = Customer.objects.filter(
            created_at__gte=month_ago,
            deleted_at__isnull=True
        ).count()
        
        stats_data = {
            'total_customers': total_customers,
            'active_customers': active_customers,
            'suspended_customers': suspended_customers,
            'archived_customers': archived_customers,
            'customers_with_payment_methods': customers_with_payment_methods,
            'total_credit_limit': total_credit,
            'new_customers_this_week': new_this_week,
            'new_customers_this_month': new_this_month
        }
        
        serializer = CustomerStatsSerializer(stats_data)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Advanced customer search with multiple criteria."""
        query = request.query_params.get('q', '')
        
        if not query:
            return Response(
                {'error': 'Search query parameter "q" is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        customers = Customer.objects.filter(
            Q(first_name__icontains=query) |
            Q(last_name__icontains=query) |
            Q(email__icontains=query) |
            Q(company_name__icontains=query) |
            Q(phone__icontains=query),
            deleted_at__isnull=True
        )
        
        serializer = CustomerListSerializer(customers, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def payment_methods(self, request, pk=None):
        """Get all payment methods for a customer."""
        customer = self.get_object()
        payment_methods = customer.payment_methods.filter(deleted_at__isnull=True)
        serializer = PaymentMethodSerializer(payment_methods, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def notes(self, request, pk=None):
        """Get all notes for a customer."""
        customer = self.get_object()
        notes = customer.customer_notes.all()
        serializer = CustomerNoteSerializer(notes, many=True)
        return Response(serializer.data)


class PaymentMethodViewSet(viewsets.ModelViewSet):
    """
    ViewSet for PaymentMethod model.
    Provides CRUD operations for customer payment methods.
    """
    
    serializer_class = PaymentMethodSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    ordering_fields = ['created_at', 'type', 'is_default']
    ordering = ['-is_default', '-created_at']
    filterset_fields = {
        'customer': ['exact'],
        'type': ['exact', 'in'],
        'is_default': ['exact'],
        'is_verified': ['exact'],
        'card_brand': ['exact', 'in'],
    }
    
    def get_queryset(self):
        """Get queryset of payment methods, excluding soft-deleted."""
        queryset = PaymentMethod.objects.filter(deleted_at__isnull=True)
        
        # Filter by customer if provided
        customer_id = self.request.query_params.get('customer_id')
        if customer_id:
            queryset = queryset.filter(customer_id=customer_id)
        
        return queryset.select_related('customer')
    
    def destroy(self, request, *args, **kwargs):
        """Soft delete payment method."""
        instance = self.get_object()
        instance.deleted_at = timezone.now()
        instance.save()
        return Response(
            {'message': 'Payment method deleted successfully.'},
            status=status.HTTP_200_OK
        )
    
    @action(detail=True, methods=['post'])
    def set_default(self, request, pk=None):
        """Set this payment method as default for the customer."""
        payment_method = self.get_object()
        payment_method.is_default = True
        payment_method.save()
        
        serializer = self.get_serializer(payment_method)
        return Response({
            'message': 'Payment method set as default.',
            'data': serializer.data
        })
    
    @action(detail=True, methods=['post'])
    def verify(self, request, pk=None):
        """Mark payment method as verified."""
        payment_method = self.get_object()
        payment_method.is_verified = True
        payment_method.save()
        
        serializer = self.get_serializer(payment_method)
        return Response({
            'message': 'Payment method verified successfully.',
            'data': serializer.data
        })
    
    @action(detail=False, methods=['get'])
    def expired(self, request):
        """Get all expired card payment methods."""
        now = timezone.now()
        expired_cards = []
        
        for pm in self.get_queryset().filter(type='card'):
            if pm.is_expired():
                expired_cards.append(pm)
        
        serializer = self.get_serializer(expired_cards, many=True)
        return Response(serializer.data)


class CustomerNoteViewSet(viewsets.ModelViewSet):
    """
    ViewSet for CustomerNote model.
    Provides CRUD operations for customer notes.
    """
    
    serializer_class = CustomerNoteSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    ordering_fields = ['created_at', 'is_pinned']
    ordering = ['-is_pinned', '-created_at']
    filterset_fields = {
        'customer': ['exact'],
        'is_pinned': ['exact'],
        'created_by': ['exact'],
    }
    
    def get_queryset(self):
        """Get queryset of customer notes."""
        queryset = CustomerNote.objects.all()
        
        # Filter by customer if provided
        customer_id = self.request.query_params.get('customer_id')
        if customer_id:
            queryset = queryset.filter(customer_id=customer_id)
        
        return queryset.select_related('customer', 'created_by')
    
    def perform_create(self, serializer):
        """Set created_by when creating a note."""
        serializer.save(created_by=self.request.user)
    
    @action(detail=True, methods=['post'])
    def pin(self, request, pk=None):
        """Pin a note to the top."""
        note = self.get_object()
        note.is_pinned = True
        note.save()
        
        serializer = self.get_serializer(note)
        return Response({
            'message': 'Note pinned successfully.',
            'data': serializer.data
        })
    
    @action(detail=True, methods=['post'])
    def unpin(self, request, pk=None):
        """Unpin a note."""
        note = self.get_object()
        note.is_pinned = False
        note.save()
        
        serializer = self.get_serializer(note)
        return Response({
            'message': 'Note unpinned successfully.',
            'data': serializer.data
        })

"""
Customer Portal Views
API endpoints for customers to access their own data (invoices, payments, schedules, profile).
"""

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.db.models import Sum, Count, Q
from django.utils import timezone
from datetime import timedelta

from .models import Customer, PaymentMethod
from .serializers import CustomerDetailSerializer, PaymentMethodSerializer


class CustomerPortalPermission(IsAuthenticated):
    """Permission class to ensure user is authenticated. Customer profile is optional."""
    
    def has_permission(self, request, view):
        return super().has_permission(request, view)


def get_customer_profile(user):
    """Get customer profile for a user, returns None if not linked."""
    if hasattr(user, 'customer_profile') and user.customer_profile is not None:
        return user.customer_profile
    return None


class CustomerPortalDashboardView(APIView):
    """Get customer portal dashboard data."""
    
    permission_classes = [CustomerPortalPermission]
    
    def get(self, request):
        customer = get_customer_profile(request.user)
        now = timezone.now()
        
        # If no customer profile, return minimal data
        if not customer:
            return Response({
                'customer': {
                    'id': None,
                    'full_name': request.user.get_full_name(),
                    'email': request.user.email,
                    'phone': request.user.phone,
                    'company_name': '',
                    'status': 'pending',
                    'payment_terms': 'net_30',
                },
                'summary': {
                    'payment_methods_count': 0,
                    'remaining_collections': 0,
                    'upcoming_schedules_count': 0,
                },
                'upcoming_schedules': [],
                'recent_payments': [],
                'message': 'Your customer profile is being set up. Please contact support if you need assistance.',
            })
        
        # Get upcoming schedules - try to import Schedule, handle if not available
        upcoming_schedule_data = []
        try:
            from operations.models import Schedule
            upcoming_schedules = Schedule.objects.filter(
                route__customers=customer,
                scheduled_date__gte=now.date(),
                status__in=['scheduled', 'in_progress']
            ).order_by('scheduled_date', 'scheduled_time_start')[:5]
            
            upcoming_schedule_data = [{
                'id': str(s.id),
                'scheduled_date': s.scheduled_date,
                'scheduled_time_start': s.scheduled_time_start,
                'scheduled_time_end': s.scheduled_time_end,
                'status': s.status,
                'route_name': s.route.name if s.route else None,
                'collector_name': s.collector.full_name if s.collector else None,
            } for s in upcoming_schedules]
        except Exception:
            pass
        
        # Get recent payments (placeholder - to be implemented when payments app is ready)
        recent_payments = []
        
        # Get account summary
        payment_methods_count = customer.payment_methods.filter(deleted_at__isnull=True).count()
        
        dashboard_data = {
            'customer': {
                'id': str(customer.id),
                'full_name': customer.get_full_name(),
                'email': customer.email,
                'phone': customer.phone,
                'company_name': customer.company_name,
                'status': customer.status,
                'payment_terms': customer.payment_terms,
                'card_number': customer.card_number,
                'prepaid_balance': customer.prepaid_balance,
                'service_area_name': None,  # Customer model doesn't have service_area field
            },
            'summary': {
                'payment_methods_count': payment_methods_count,
                'remaining_collections': customer.prepaid_balance,
                'upcoming_schedules_count': len(upcoming_schedule_data),
            },
            'upcoming_schedules': upcoming_schedule_data,
            'recent_payments': recent_payments,
        }
        
        return Response(dashboard_data)


class CustomerPortalProfileView(APIView):
    """Get and update customer profile."""
    
    permission_classes = [CustomerPortalPermission]
    
    def get(self, request):
        customer = get_customer_profile(request.user)
        if not customer:
            return Response({
                'id': None,
                'first_name': request.user.first_name,
                'last_name': request.user.last_name,
                'email': request.user.email,
                'phone': request.user.phone or '',
                'company_name': '',
                'status': 'pending',
                'message': 'Customer profile not yet created.',
            })
        serializer = CustomerDetailSerializer(customer)
        return Response(serializer.data)
    
    def patch(self, request):
        customer = get_customer_profile(request.user)
        if not customer:
            return Response({
                'error': 'Customer profile not found.'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Only allow updating certain fields
        allowed_fields = ['phone', 'billing_address', 'shipping_address', 'preferred_payment_method']
        update_data = {k: v for k, v in request.data.items() if k in allowed_fields}
        
        for field, value in update_data.items():
            setattr(customer, field, value)
        customer.save()
        
        serializer = CustomerDetailSerializer(customer)
        return Response({
            'message': 'Profile updated successfully.',
            'data': serializer.data
        })


class CustomerPortalPaymentMethodsView(APIView):
    """Get customer payment methods."""
    
    permission_classes = [CustomerPortalPermission]
    
    def get(self, request):
        customer = get_customer_profile(request.user)
        if not customer:
            return Response([])
        payment_methods = customer.payment_methods.filter(deleted_at__isnull=True)
        serializer = PaymentMethodSerializer(payment_methods, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        """Add a new payment method."""
        customer = get_customer_profile(request.user)
        if not customer:
            return Response({
                'error': 'Customer profile not found.'
            }, status=status.HTTP_404_NOT_FOUND)
        
        data = request.data.copy()
        data['customer'] = str(customer.id)
        
        serializer = PaymentMethodSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Payment method added successfully.',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomerPortalSchedulesView(APIView):
    """Get customer collection schedules."""
    
    permission_classes = [CustomerPortalPermission]
    
    def get(self, request):
        customer = get_customer_profile(request.user)
        if not customer:
            return Response({
                'count': 0,
                'results': [],
                'message': 'Customer profile not yet created.',
            })
        
        now = timezone.now()
        
        # Filter by status if provided
        status_filter = request.query_params.get('status')
        date_filter = request.query_params.get('date')  # 'upcoming', 'past', 'today'
        
        try:
            from operations.models import Schedule
            schedules = Schedule.objects.filter(
                route__customers=customer
            ).select_related('route', 'collector')
            
            if status_filter:
                schedules = schedules.filter(status=status_filter)
            
            if date_filter == 'upcoming':
                schedules = schedules.filter(scheduled_date__gte=now.date())
            elif date_filter == 'past':
                schedules = schedules.filter(scheduled_date__lt=now.date())
            elif date_filter == 'today':
                schedules = schedules.filter(scheduled_date=now.date())
            
            schedules = schedules.order_by('-scheduled_date', '-scheduled_time_start')
            
            schedule_data = [{
                'id': str(s.id),
                'scheduled_date': s.scheduled_date,
                'scheduled_time_start': s.scheduled_time_start,
                'scheduled_time_end': s.scheduled_time_end,
                'actual_start_time': s.actual_start_time,
                'actual_end_time': s.actual_end_time,
                'status': s.status,
                'route_name': s.route.name if s.route else None,
                'service_area_name': s.route.service_area.name if s.route and s.route.service_area else None,
                'collector_name': s.collector.full_name if s.collector else None,
                'notes': s.notes,
            } for s in schedules[:50]]  # Limit to 50 for performance
            
            return Response({
                'count': len(schedule_data),
                'results': schedule_data
            })
        except Exception:
            return Response({
                'count': 0,
                'results': [],
            })


class CustomerPortalTopUpView(APIView):
    """Handle customer top-up requests to add more collection credits."""
    
    permission_classes = [CustomerPortalPermission]
    
    def post(self, request):
        customer = get_customer_profile(request.user)
        if not customer:
            return Response({
                'error': 'Customer profile not found.'
            }, status=status.HTTP_404_NOT_FOUND)
        
        collections = request.data.get('collections')
        payment_method = request.data.get('payment_method', 'momo')
        
        if not collections or int(collections) <= 0:
            return Response({
                'error': 'Invalid number of collections.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # TODO: Implement actual payment processing
        # For now, just return a success message
        # In production, this would integrate with payment gateway
        
        return Response({
            'message': 'Top-up request received. Payment processing will be implemented.',
            'collections': collections,
            'payment_method': payment_method,
            'status': 'pending',
        }, status=status.HTTP_200_OK)


class CustomerPortalPaymentsView(APIView):
    """Get customer payment history (top-ups and transactions)."""
    
    permission_classes = [CustomerPortalPermission]
    
    def get(self, request):
        customer = get_customer_profile(request.user)
        if not customer:
            return Response({
                'count': 0,
                'results': [],
                'message': 'Customer profile not yet created.',
            })
        
        # TODO: Implement when payments/transactions app is ready
        # This should return history of top-ups and collection payments
        return Response({
            'count': 0,
            'results': [],
            'message': 'Payment history feature coming soon.'
        })


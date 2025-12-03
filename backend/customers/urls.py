"""
Customer Management URLs
URL routing for customer-related endpoints.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CustomerViewSet, PaymentMethodViewSet, CustomerNoteViewSet
from .portal_views import (
    CustomerPortalDashboardView,
    CustomerPortalProfileView,
    CustomerPortalPaymentMethodsView,
    CustomerPortalSchedulesView,
    CustomerPortalInvoicesView,
    CustomerPortalPaymentsView,
)

# Create router and register viewsets
router = DefaultRouter()
router.register(r'customers', CustomerViewSet, basename='customer')
router.register(r'payment-methods', PaymentMethodViewSet, basename='payment-method')
router.register(r'customer-notes', CustomerNoteViewSet, basename='customer-note')

app_name = 'customers'

urlpatterns = [
    path('', include(router.urls)),
    
    # Customer Portal Endpoints
    path('portal/dashboard/', CustomerPortalDashboardView.as_view(), name='portal-dashboard'),
    path('portal/profile/', CustomerPortalProfileView.as_view(), name='portal-profile'),
    path('portal/payment-methods/', CustomerPortalPaymentMethodsView.as_view(), name='portal-payment-methods'),
    path('portal/schedules/', CustomerPortalSchedulesView.as_view(), name='portal-schedules'),
    path('portal/invoices/', CustomerPortalInvoicesView.as_view(), name='portal-invoices'),
    path('portal/payments/', CustomerPortalPaymentsView.as_view(), name='portal-payments'),
]

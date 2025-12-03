"""
Operations URL Configuration
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ServiceAreaViewSet, RouteViewSet, CollectorViewSet, ScheduleViewSet
from .collector_views import (
    CollectorPortalDashboardView,
    CollectorPortalSchedulesView,
    CollectorPortalScheduleDetailView,
    CollectorPortalStartScheduleView,
    CollectorPortalCompleteScheduleView,
    CollectorPortalRoutesView,
    CollectorPortalUpdateLocationView,
    CollectorPortalProfileView,
)

router = DefaultRouter()
router.register(r'service-areas', ServiceAreaViewSet, basename='servicearea')
router.register(r'routes', RouteViewSet, basename='route')
router.register(r'collectors', CollectorViewSet, basename='collector')
router.register(r'schedules', ScheduleViewSet, basename='schedule')

urlpatterns = [
    path('', include(router.urls)),
    
    # Collector Portal endpoints
    path('collector-portal/dashboard/', CollectorPortalDashboardView.as_view(), name='collector-portal-dashboard'),
    path('collector-portal/schedules/', CollectorPortalSchedulesView.as_view(), name='collector-portal-schedules'),
    path('collector-portal/schedules/<uuid:schedule_id>/', CollectorPortalScheduleDetailView.as_view(), name='collector-portal-schedule-detail'),
    path('collector-portal/schedules/<uuid:schedule_id>/start/', CollectorPortalStartScheduleView.as_view(), name='collector-portal-schedule-start'),
    path('collector-portal/schedules/<uuid:schedule_id>/complete/', CollectorPortalCompleteScheduleView.as_view(), name='collector-portal-schedule-complete'),
    path('collector-portal/routes/', CollectorPortalRoutesView.as_view(), name='collector-portal-routes'),
    path('collector-portal/location/', CollectorPortalUpdateLocationView.as_view(), name='collector-portal-location'),
    path('collector-portal/profile/', CollectorPortalProfileView.as_view(), name='collector-portal-profile'),
]

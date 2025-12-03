"""
Collector Portal Views
API endpoints for collectors to access their schedules, routes, and update collection status.
"""

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.db.models import Count, Q, Sum
from django.utils import timezone
from datetime import timedelta

from .models import Schedule, Route, Collector, ServiceArea
from customers.models import Customer


def get_collector_for_user(user):
    """Get the collector profile for a user, if any."""
    if hasattr(user, 'collector_profile'):
        return user.collector_profile
    return None


class CollectorPortalPermission(IsAuthenticated):
    """Permission class to ensure user is a collector with a linked collector profile."""
    
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        
        # Check if user has collector_profile
        collector = get_collector_for_user(request.user)
        if collector:
            return True
        
        # Also allow if user role is 'collector' (even without profile for now)
        role_name = None
        if hasattr(request.user, 'role') and request.user.role:
            role_name = getattr(request.user.role, 'name', None) or request.user.role
        
        return role_name == 'collector'


class CollectorPortalDashboardView(APIView):
    """Get collector portal dashboard data."""
    
    permission_classes = [CollectorPortalPermission]
    
    def get(self, request):
        collector = get_collector_for_user(request.user)
        now = timezone.now()
        today = now.date()
        
        # If no collector profile, return placeholder data
        if not collector:
            return Response({
                'collector': {
                    'id': None,
                    'full_name': request.user.get_full_name() or request.user.email,
                    'email': request.user.email,
                    'status': 'active',
                    'rating': 5.0,
                    'total_collections': 0,
                },
                'summary': {
                    'today_schedules': 0,
                    'pending_pickups': 0,
                    'completed_today': 0,
                    'assigned_routes': 0,
                },
                'today_schedules': [],
                'message': 'No collector profile linked to this account yet.',
            })
        
        # Get today's schedules
        today_schedules = Schedule.objects.filter(
            collector=collector,
            scheduled_date=today
        ).select_related('route', 'route__service_area').order_by('scheduled_time_start')
        
        # Get pending pickups (scheduled and in_progress)
        pending_count = today_schedules.filter(status__in=['scheduled', 'in_progress']).count()
        completed_count = today_schedules.filter(status='completed').count()
        
        # Get upcoming schedules (next 7 days)
        upcoming_schedules = Schedule.objects.filter(
            collector=collector,
            scheduled_date__gt=today,
            scheduled_date__lte=today + timedelta(days=7),
            status='scheduled'
        ).select_related('route', 'route__service_area').order_by('scheduled_date', 'scheduled_time_start')[:5]
        
        today_schedule_data = [{
            'id': str(s.id),
            'route_id': str(s.route.id),
            'route_name': s.route.name,
            'route_code': s.route.code,
            'service_area_name': s.route.service_area.name if s.route.service_area else None,
            'scheduled_date': s.scheduled_date,
            'scheduled_time_start': s.scheduled_time_start,
            'scheduled_time_end': s.scheduled_time_end,
            'status': s.status,
            'customers_scheduled': s.customers_scheduled,
            'customers_collected': s.customers_collected,
            'customers_missed': s.customers_missed,
            'actual_start_time': s.actual_start_time,
            'actual_end_time': s.actual_end_time,
            'route_latitude': float(s.route.service_area.latitude) if s.route.service_area and s.route.service_area.latitude else None,
            'route_longitude': float(s.route.service_area.longitude) if s.route.service_area and s.route.service_area.longitude else None,
        } for s in today_schedules]
        
        upcoming_schedule_data = [{
            'id': str(s.id),
            'route_name': s.route.name,
            'service_area_name': s.route.service_area.name if s.route.service_area else None,
            'scheduled_date': s.scheduled_date,
            'scheduled_time_start': s.scheduled_time_start,
            'scheduled_time_end': s.scheduled_time_end,
            'status': s.status,
        } for s in upcoming_schedules]
        
        return Response({
            'collector': {
                'id': str(collector.id),
                'employee_id': collector.employee_id,
                'full_name': collector.full_name,
                'email': collector.email,
                'phone': collector.phone,
                'status': collector.status,
                'rating': float(collector.rating),
                'total_collections': collector.total_collections,
                'photo': collector.photo.url if collector.photo else None,
            },
            'summary': {
                'today_schedules': today_schedules.count(),
                'pending_pickups': pending_count,
                'completed_today': completed_count,
                'assigned_routes': collector.assigned_routes_count,
            },
            'today_schedules': today_schedule_data,
            'upcoming_schedules': upcoming_schedule_data,
        })


class CollectorPortalSchedulesView(APIView):
    """Get collector's schedules."""
    
    permission_classes = [CollectorPortalPermission]
    
    def get(self, request):
        collector = get_collector_for_user(request.user)
        now = timezone.now()
        today = now.date()
        
        if not collector:
            return Response({
                'count': 0,
                'results': [],
                'message': 'No collector profile linked.',
            })
        
        # Get filter params
        date_filter = request.query_params.get('date')  # 'today', 'upcoming', 'past', 'week'
        status_filter = request.query_params.get('status')
        
        schedules = Schedule.objects.filter(
            collector=collector
        ).select_related('route', 'route__service_area')
        
        # Apply date filter
        if date_filter == 'today':
            schedules = schedules.filter(scheduled_date=today)
        elif date_filter == 'upcoming':
            schedules = schedules.filter(scheduled_date__gt=today)
        elif date_filter == 'past':
            schedules = schedules.filter(scheduled_date__lt=today)
        elif date_filter == 'week':
            schedules = schedules.filter(
                scheduled_date__gte=today,
                scheduled_date__lte=today + timedelta(days=7)
            )
        
        # Apply status filter
        if status_filter:
            schedules = schedules.filter(status=status_filter)
        
        schedules = schedules.order_by('scheduled_date', 'scheduled_time_start')[:100]
        
        schedule_data = [{
            'id': str(s.id),
            'route_id': str(s.route.id),
            'route_name': s.route.name,
            'route_code': s.route.code,
            'service_area_name': s.route.service_area.name if s.route.service_area else None,
            'scheduled_date': s.scheduled_date,
            'scheduled_time_start': s.scheduled_time_start,
            'scheduled_time_end': s.scheduled_time_end,
            'status': s.status,
            'customers_scheduled': s.customers_scheduled,
            'customers_collected': s.customers_collected,
            'customers_missed': s.customers_missed,
            'actual_start_time': s.actual_start_time,
            'actual_end_time': s.actual_end_time,
            'notes': s.notes,
        } for s in schedules]
        
        return Response({
            'count': len(schedule_data),
            'results': schedule_data,
        })


class CollectorPortalScheduleDetailView(APIView):
    """Get details for a specific schedule including customers."""
    
    permission_classes = [CollectorPortalPermission]
    
    def get(self, request, schedule_id):
        collector = get_collector_for_user(request.user)
        
        if not collector:
            return Response({
                'error': 'No collector profile linked.',
            }, status=status.HTTP_403_FORBIDDEN)
        
        try:
            schedule = Schedule.objects.select_related(
                'route', 'route__service_area'
            ).get(id=schedule_id, collector=collector)
        except Schedule.DoesNotExist:
            return Response({
                'error': 'Schedule not found.',
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Get customers on this route
        customers = Customer.objects.filter(
            route=schedule.route,
            status='active'
        ).values('id', 'first_name', 'last_name', 'phone', 'billing_address', 'company_name')
        
        customer_data = [{
            'id': str(c['id']),
            'name': f"{c['first_name']} {c['last_name']}",
            'company_name': c['company_name'] or '',
            'phone': c['phone'] or '',
            'address': c['billing_address'].get('street', '') if c['billing_address'] else '',
            'latitude': c['billing_address'].get('latitude') if c['billing_address'] else None,
            'longitude': c['billing_address'].get('longitude') if c['billing_address'] else None,
        } for c in customers]
        
        return Response({
            'id': str(schedule.id),
            'route': {
                'id': str(schedule.route.id),
                'name': schedule.route.name,
                'code': schedule.route.code,
                'description': schedule.route.description,
                'estimated_distance_km': float(schedule.route.estimated_distance_km),
                'estimated_duration_minutes': schedule.route.estimated_duration_minutes,
                'path_geojson': schedule.route.path_geojson,
            },
            'service_area': {
                'id': str(schedule.route.service_area.id) if schedule.route.service_area else None,
                'name': schedule.route.service_area.name if schedule.route.service_area else None,
                'latitude': float(schedule.route.service_area.latitude) if schedule.route.service_area and schedule.route.service_area.latitude else None,
                'longitude': float(schedule.route.service_area.longitude) if schedule.route.service_area and schedule.route.service_area.longitude else None,
            },
            'scheduled_date': schedule.scheduled_date,
            'scheduled_time_start': schedule.scheduled_time_start,
            'scheduled_time_end': schedule.scheduled_time_end,
            'status': schedule.status,
            'customers_scheduled': schedule.customers_scheduled,
            'customers_collected': schedule.customers_collected,
            'customers_missed': schedule.customers_missed,
            'actual_start_time': schedule.actual_start_time,
            'actual_end_time': schedule.actual_end_time,
            'notes': schedule.notes,
            'customers': customer_data,
        })


class CollectorPortalStartScheduleView(APIView):
    """Start a scheduled collection."""
    
    permission_classes = [CollectorPortalPermission]
    
    def post(self, request, schedule_id):
        collector = get_collector_for_user(request.user)
        
        if not collector:
            return Response({
                'error': 'No collector profile linked.',
            }, status=status.HTTP_403_FORBIDDEN)
        
        try:
            schedule = Schedule.objects.get(id=schedule_id, collector=collector)
        except Schedule.DoesNotExist:
            return Response({
                'error': 'Schedule not found.',
            }, status=status.HTTP_404_NOT_FOUND)
        
        if schedule.status != 'scheduled':
            return Response({
                'error': f'Cannot start schedule with status: {schedule.status}',
            }, status=status.HTTP_400_BAD_REQUEST)
        
        schedule.status = 'in_progress'
        schedule.actual_start_time = timezone.now()
        schedule.save()
        
        return Response({
            'message': 'Schedule started successfully.',
            'id': str(schedule.id),
            'status': schedule.status,
            'actual_start_time': schedule.actual_start_time,
        })


class CollectorPortalCompleteScheduleView(APIView):
    """Complete a collection schedule."""
    
    permission_classes = [CollectorPortalPermission]
    
    def post(self, request, schedule_id):
        collector = get_collector_for_user(request.user)
        
        if not collector:
            return Response({
                'error': 'No collector profile linked.',
            }, status=status.HTTP_403_FORBIDDEN)
        
        try:
            schedule = Schedule.objects.get(id=schedule_id, collector=collector)
        except Schedule.DoesNotExist:
            return Response({
                'error': 'Schedule not found.',
            }, status=status.HTTP_404_NOT_FOUND)
        
        if schedule.status != 'in_progress':
            return Response({
                'error': f'Cannot complete schedule with status: {schedule.status}',
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Update with provided data
        customers_collected = request.data.get('customers_collected', 0)
        customers_missed = request.data.get('customers_missed', 0)
        notes = request.data.get('notes', '')
        
        schedule.status = 'completed'
        schedule.actual_end_time = timezone.now()
        schedule.customers_collected = customers_collected
        schedule.customers_missed = customers_missed
        if notes:
            schedule.notes = notes
        schedule.save()
        
        # Update collector's total collections
        collector.total_collections += 1
        collector.save()
        
        return Response({
            'message': 'Schedule completed successfully.',
            'id': str(schedule.id),
            'status': schedule.status,
            'actual_end_time': schedule.actual_end_time,
        })


class CollectorPortalRoutesView(APIView):
    """Get collector's assigned routes."""
    
    permission_classes = [CollectorPortalPermission]
    
    def get(self, request):
        collector = get_collector_for_user(request.user)
        
        if not collector:
            return Response({
                'count': 0,
                'results': [],
                'message': 'No collector profile linked.',
            })
        
        # Get routes where collector is assigned as default
        routes = Route.objects.filter(
            default_collector=collector,
            status='active'
        ).select_related('service_area')
        
        route_data = [{
            'id': str(r.id),
            'name': r.name,
            'code': r.code,
            'description': r.description,
            'service_area_id': str(r.service_area.id) if r.service_area else None,
            'service_area_name': r.service_area.name if r.service_area else None,
            'estimated_distance_km': float(r.estimated_distance_km),
            'estimated_duration_minutes': r.estimated_duration_minutes,
            'frequency': r.frequency,
            'collection_days': r.collection_days,
            'collection_time_start': r.collection_time_start,
            'collection_time_end': r.collection_time_end,
            'customers_count': r.customers_count,
            'path_geojson': r.path_geojson,
            'latitude': float(r.service_area.latitude) if r.service_area and r.service_area.latitude else None,
            'longitude': float(r.service_area.longitude) if r.service_area and r.service_area.longitude else None,
        } for r in routes]
        
        return Response({
            'count': len(route_data),
            'results': route_data,
        })


class CollectorPortalUpdateLocationView(APIView):
    """Update collector's current location."""
    
    permission_classes = [CollectorPortalPermission]
    
    def post(self, request):
        collector = get_collector_for_user(request.user)
        
        if not collector:
            return Response({
                'error': 'No collector profile linked.',
            }, status=status.HTTP_403_FORBIDDEN)
        
        latitude = request.data.get('latitude')
        longitude = request.data.get('longitude')
        
        if not latitude or not longitude:
            return Response({
                'error': 'latitude and longitude are required.',
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # TODO: Store location in a separate LocationHistory model
        # For now, just acknowledge the update
        
        return Response({
            'message': 'Location updated successfully.',
            'latitude': latitude,
            'longitude': longitude,
            'timestamp': timezone.now(),
        })


class CollectorPortalProfileView(APIView):
    """Get and update collector profile."""
    
    permission_classes = [CollectorPortalPermission]
    
    def get(self, request):
        collector = get_collector_for_user(request.user)
        
        if not collector:
            return Response({
                'id': None,
                'full_name': request.user.get_full_name() or request.user.email,
                'email': request.user.email,
                'message': 'No collector profile linked.',
            })
        
        return Response({
            'id': str(collector.id),
            'employee_id': collector.employee_id,
            'first_name': collector.first_name,
            'last_name': collector.last_name,
            'full_name': collector.full_name,
            'email': collector.email,
            'phone': collector.phone,
            'address': collector.address,
            'photo': collector.photo.url if collector.photo else None,
            'employment_type': collector.employment_type,
            'hire_date': collector.hire_date,
            'status': collector.status,
            'rating': float(collector.rating),
            'total_collections': collector.total_collections,
            'assigned_routes_count': collector.assigned_routes_count,
            'service_areas': [
                {'id': str(sa.id), 'name': sa.name}
                for sa in collector.service_areas.all()
            ],
        })

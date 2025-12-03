"""
Operations Views
API endpoints for service areas, routes, collectors, and schedules.
"""

from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count, Q, Sum
from django.utils import timezone
from datetime import timedelta

from .models import ServiceArea, Route, Collector, Schedule
from .serializers import (
    ServiceAreaListSerializer,
    ServiceAreaDetailSerializer,
    ServiceAreaCreateUpdateSerializer,
    ServiceAreaStatsSerializer,
    RouteListSerializer,
    RouteDetailSerializer,
    RouteCreateUpdateSerializer,
    CollectorListSerializer,
    CollectorDetailSerializer,
    CollectorCreateUpdateSerializer,
    ScheduleListSerializer,
    ScheduleDetailSerializer,
    ScheduleCreateUpdateSerializer,
)


class ServiceAreaViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Service Area management.
    
    Provides CRUD operations plus:
    - List with filtering, searching, ordering
    - Statistics endpoint
    - Activation/deactivation actions
    """
    queryset = ServiceArea.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'province', 'district', 'sector', 'cell']
    search_fields = ['name', 'code', 'province', 'district', 'sector', 'cell', 'village']
    ordering_fields = ['name', 'code', 'created_at', 'estimated_customers']
    ordering = ['name']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ServiceAreaListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return ServiceAreaCreateUpdateSerializer
        return ServiceAreaDetailSerializer
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get statistics about service areas"""
        stats = {
            'total_areas': ServiceArea.objects.count(),
            'active_areas': ServiceArea.objects.filter(status='active').count(),
            'inactive_areas': ServiceArea.objects.filter(status='inactive').count(),
            'planned_areas': ServiceArea.objects.filter(status='planned').count(),
            'total_households': ServiceArea.objects.aggregate(Sum('estimated_households'))['estimated_households__sum'] or 0,
            'total_customers': ServiceArea.objects.aggregate(Sum('estimated_customers'))['estimated_customers__sum'] or 0,
            'total_routes': Route.objects.filter(status='active').count(),
            'total_collectors': Collector.objects.filter(status='active').count(),
        }
        serializer = ServiceAreaStatsSerializer(stats)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """Activate a service area"""
        service_area = self.get_object()
        service_area.status = 'active'
        service_area.save()
        serializer = self.get_serializer(service_area)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def deactivate(self, request, pk=None):
        """Deactivate a service area"""
        service_area = self.get_object()
        service_area.status = 'inactive'
        service_area.save()
        serializer = self.get_serializer(service_area)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def routes(self, request, pk=None):
        """Get all routes in this service area"""
        service_area = self.get_object()
        routes = service_area.routes.all()
        serializer = RouteListSerializer(routes, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def collectors(self, request, pk=None):
        """Get all collectors assigned to this service area"""
        service_area = self.get_object()
        collectors = service_area.collectors.filter(status='active')
        serializer = CollectorListSerializer(collectors, many=True)
        return Response(serializer.data)


class RouteViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Route management.
    
    Provides CRUD operations plus:
    - List with filtering, searching, ordering
    - Schedule generation
    - Assignment to collectors
    """
    queryset = Route.objects.select_related('service_area', 'default_collector').all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'service_area', 'frequency', 'default_collector']
    search_fields = ['name', 'code', 'service_area__name']
    ordering_fields = ['name', 'code', 'sequence_number', 'created_at']
    ordering = ['service_area', 'sequence_number']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return RouteListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return RouteCreateUpdateSerializer
        return RouteDetailSerializer
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    @action(detail=True, methods=['post'])
    def assign_collector(self, request, pk=None):
        """Assign a collector to this route"""
        route = self.get_object()
        collector_id = request.data.get('collector_id')
        
        if not collector_id:
            return Response(
                {'error': 'collector_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            collector = Collector.objects.get(id=collector_id)
            route.default_collector = collector
            route.save()
            serializer = self.get_serializer(route)
            return Response(serializer.data)
        except Collector.DoesNotExist:
            return Response(
                {'error': 'Collector not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['get'])
    def schedules(self, request, pk=None):
        """Get all schedules for this route"""
        route = self.get_object()
        schedules = route.schedules.all()
        serializer = ScheduleListSerializer(schedules, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def generate_schedule(self, request, pk=None):
        """Generate schedules for this route for a date range"""
        route = self.get_object()
        start_date = request.data.get('start_date')
        end_date = request.data.get('end_date')
        
        if not start_date or not end_date:
            return Response(
                {'error': 'start_date and end_date are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Parse dates
        from datetime import datetime
        start = datetime.strptime(start_date, '%Y-%m-%d').date()
        end = datetime.strptime(end_date, '%Y-%m-%d').date()
        
        # Generate schedules based on collection_days
        schedules_created = []
        current_date = start
        
        while current_date <= end:
            day_name = current_date.strftime('%A')
            
            if day_name in route.collection_days:
                # Check if schedule already exists
                if not Schedule.objects.filter(route=route, scheduled_date=current_date).exists():
                    schedule = Schedule.objects.create(
                        route=route,
                        collector=route.default_collector,
                        scheduled_date=current_date,
                        scheduled_time_start=route.collection_time_start,
                        scheduled_time_end=route.collection_time_end,
                        customers_scheduled=route.customers_count,
                        created_by=request.user
                    )
                    schedules_created.append(schedule)
            
            current_date += timedelta(days=1)
        
        serializer = ScheduleListSerializer(schedules_created, many=True)
        return Response({
            'message': f'Created {len(schedules_created)} schedules',
            'schedules': serializer.data
        })


class CollectorViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Collector management.
    
    Provides CRUD operations plus:
    - List with filtering, searching, ordering
    - Performance statistics
    - Status management
    """
    queryset = Collector.objects.prefetch_related('service_areas').all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'employment_type']
    search_fields = ['employee_id', 'first_name', 'last_name', 'phone', 'email']
    ordering_fields = ['employee_id', 'last_name', 'hire_date', 'rating', 'total_collections']
    ordering = ['last_name', 'first_name']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return CollectorListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return CollectorCreateUpdateSerializer
        return CollectorDetailSerializer
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    @action(detail=False, methods=['get'])
    def available(self, request):
        """Get all available collectors (active status)"""
        collectors = self.queryset.filter(status='active')
        serializer = CollectorListSerializer(collectors, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """Activate a collector"""
        collector = self.get_object()
        collector.status = 'active'
        collector.save()
        serializer = self.get_serializer(collector)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def suspend(self, request, pk=None):
        """Suspend a collector"""
        collector = self.get_object()
        collector.status = 'suspended'
        collector.save()
        serializer = self.get_serializer(collector)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def set_on_leave(self, request, pk=None):
        """Mark collector as on leave"""
        collector = self.get_object()
        collector.status = 'on_leave'
        collector.save()
        serializer = self.get_serializer(collector)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def routes(self, request, pk=None):
        """Get all routes assigned to this collector"""
        collector = self.get_object()
        routes = collector.default_routes.all()
        serializer = RouteListSerializer(routes, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def schedules(self, request, pk=None):
        """Get schedules for this collector"""
        collector = self.get_object()
        # Get upcoming schedules
        schedules = collector.schedules.filter(
            scheduled_date__gte=timezone.now().date()
        ).order_by('scheduled_date')
        serializer = ScheduleListSerializer(schedules, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def performance(self, request, pk=None):
        """Get performance statistics for this collector"""
        collector = self.get_object()
        
        # Calculate statistics
        total_schedules = collector.schedules.count()
        completed = collector.schedules.filter(status='completed').count()
        missed = collector.schedules.filter(status='missed').count()
        
        # Calculate collection rate
        if total_schedules > 0:
            completion_rate = (completed / total_schedules) * 100
        else:
            completion_rate = 0
        
        # Get this month's collections
        month_start = timezone.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        this_month = collector.schedules.filter(
            scheduled_date__gte=month_start.date(),
            status='completed'
        ).count()
        
        stats = {
            'total_collections': collector.total_collections,
            'total_schedules': total_schedules,
            'completed_schedules': completed,
            'missed_schedules': missed,
            'completion_rate': round(completion_rate, 2),
            'rating': float(collector.rating),
            'collections_this_month': this_month,
        }
        
        return Response(stats)


class ScheduleViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Schedule management.
    
    Provides CRUD operations plus:
    - List with filtering, searching, ordering
    - Today's schedules
    - Status updates (start, complete, cancel)
    """
    queryset = Schedule.objects.select_related('route', 'collector', 'route__service_area').all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'route', 'collector', 'scheduled_date']
    search_fields = ['route__name', 'collector__first_name', 'collector__last_name']
    ordering_fields = ['scheduled_date', 'scheduled_time_start', 'created_at']
    ordering = ['-scheduled_date', 'scheduled_time_start']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ScheduleListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return ScheduleCreateUpdateSerializer
        return ScheduleDetailSerializer
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    @action(detail=False, methods=['get'])
    def today(self, request):
        """Get today's schedules"""
        today = timezone.now().date()
        schedules = self.queryset.filter(scheduled_date=today)
        serializer = ScheduleListSerializer(schedules, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        """Get upcoming schedules (next 7 days)"""
        today = timezone.now().date()
        next_week = today + timedelta(days=7)
        schedules = self.queryset.filter(
            scheduled_date__gte=today,
            scheduled_date__lte=next_week,
            status='scheduled'
        )
        serializer = ScheduleListSerializer(schedules, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def overdue(self, request):
        """Get overdue schedules"""
        today = timezone.now().date()
        schedules = self.queryset.filter(
            scheduled_date__lt=today,
            status='scheduled'
        )
        serializer = ScheduleListSerializer(schedules, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def start(self, request, pk=None):
        """Mark schedule as started"""
        schedule = self.get_object()
        schedule.status = 'in_progress'
        schedule.actual_start_time = timezone.now()
        schedule.save()
        serializer = self.get_serializer(schedule)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Mark schedule as completed"""
        schedule = self.get_object()
        schedule.status = 'completed'
        schedule.actual_end_time = timezone.now()
        
        # Update statistics if provided
        customers_collected = request.data.get('customers_collected')
        customers_missed = request.data.get('customers_missed')
        
        if customers_collected is not None:
            schedule.customers_collected = customers_collected
        if customers_missed is not None:
            schedule.customers_missed = customers_missed
        
        schedule.save()
        
        # Update collector's total collections
        if schedule.collector:
            schedule.collector.total_collections += schedule.customers_collected
            schedule.collector.save()
        
        serializer = self.get_serializer(schedule)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel a schedule"""
        schedule = self.get_object()
        schedule.status = 'cancelled'
        schedule.cancellation_reason = request.data.get('reason', '')
        schedule.save()
        serializer = self.get_serializer(schedule)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def mark_missed(self, request, pk=None):
        """Mark schedule as missed"""
        schedule = self.get_object()
        schedule.status = 'missed'
        schedule.save()
        serializer = self.get_serializer(schedule)
        return Response(serializer.data)

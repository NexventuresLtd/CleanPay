"""
Operations Serializers
Handles serialization for service areas, routes, collectors, and schedules.
"""

from rest_framework import serializers
from .models import ServiceArea, Route, Collector, Schedule


class ServiceAreaListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for service area lists"""
    active_routes_count = serializers.ReadOnlyField()
    assigned_collectors_count = serializers.ReadOnlyField()
    full_address = serializers.ReadOnlyField()
    
    class Meta:
        model = ServiceArea
        fields = [
            'id', 'name', 'code', 'status',
            'province', 'district', 'sector', 'cell', 'village',
            'full_address', 'estimated_households', 'estimated_customers',
            'active_routes_count', 'assigned_collectors_count',
            'created_at', 'updated_at'
        ]


class ServiceAreaDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for service area detail view"""
    active_routes_count = serializers.ReadOnlyField()
    assigned_collectors_count = serializers.ReadOnlyField()
    full_address = serializers.ReadOnlyField()
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    
    class Meta:
        model = ServiceArea
        fields = '__all__'


class ServiceAreaCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating service areas"""
    
    class Meta:
        model = ServiceArea
        fields = [
            'name', 'code', 'description',
            'province', 'district', 'sector', 'cell', 'village',
            'latitude', 'longitude', 'boundary_geojson',
            'status', 'estimated_households', 'estimated_customers'
        ]
    
    def validate_code(self, value):
        """Ensure code is unique"""
        if self.instance:
            # Update: exclude current instance from uniqueness check
            if ServiceArea.objects.exclude(id=self.instance.id).filter(code=value).exists():
                raise serializers.ValidationError("Service area with this code already exists.")
        else:
            # Create: check if code exists
            if ServiceArea.objects.filter(code=value).exists():
                raise serializers.ValidationError("Service area with this code already exists.")
        return value.upper()  # Store codes in uppercase


class RouteListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for route lists"""
    service_area_name = serializers.CharField(source='service_area.name', read_only=True)
    default_collector_name = serializers.CharField(source='default_collector.full_name', read_only=True)
    customers_count = serializers.ReadOnlyField()
    collection_schedule_display = serializers.ReadOnlyField()
    
    class Meta:
        model = Route
        fields = [
            'id', 'name', 'code', 'status',
            'service_area', 'service_area_name',
            'sequence_number', 'frequency',
            'collection_days', 'collection_time_start',
            'default_collector', 'default_collector_name',
            'customers_count', 'collection_schedule_display',
            'estimated_distance_km', 'estimated_duration_minutes',
            'created_at', 'updated_at'
        ]


class RouteDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for route detail view"""
    service_area_name = serializers.CharField(source='service_area.name', read_only=True)
    default_collector_name = serializers.CharField(source='default_collector.full_name', read_only=True)
    customers_count = serializers.ReadOnlyField()
    collection_schedule_display = serializers.ReadOnlyField()
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    
    class Meta:
        model = Route
        fields = '__all__'


class RouteCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating routes"""
    
    class Meta:
        model = Route
        fields = [
            'service_area', 'name', 'code', 'description',
            'sequence_number', 'estimated_distance_km', 'estimated_duration_minutes',
            'path_geojson', 'frequency', 'collection_days',
            'collection_time_start', 'collection_time_end',
            'default_collector', 'status', 'notes'
        ]
    
    def validate(self, data):
        """Validate route data"""
        # Ensure collection days is a list
        if 'collection_days' in data and not isinstance(data['collection_days'], list):
            raise serializers.ValidationError({
                'collection_days': 'Must be a list of day names'
            })
        
        # Validate day names if provided
        if 'collection_days' in data:
            valid_days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
            for day in data['collection_days']:
                if day not in valid_days:
                    raise serializers.ValidationError({
                        'collection_days': f'Invalid day name: {day}. Must be one of {valid_days}'
                    })
        
        return data
    
    def validate_code(self, value):
        """Ensure code is unique"""
        if self.instance:
            if Route.objects.exclude(id=self.instance.id).filter(code=value).exists():
                raise serializers.ValidationError("Route with this code already exists.")
        else:
            if Route.objects.filter(code=value).exists():
                raise serializers.ValidationError("Route with this code already exists.")
        return value.upper()


class CollectorListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for collector lists"""
    full_name = serializers.ReadOnlyField()
    assigned_routes_count = serializers.ReadOnlyField()
    is_available = serializers.ReadOnlyField()
    
    class Meta:
        model = Collector
        fields = [
            'id', 'employee_id', 'first_name', 'last_name', 'full_name',
            'phone', 'email', 'photo',
            'employment_type', 'status', 'rating',
            'assigned_routes_count', 'total_collections', 'is_available',
            'created_at', 'updated_at'
        ]


class CollectorDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for collector detail view"""
    full_name = serializers.ReadOnlyField()
    assigned_routes_count = serializers.ReadOnlyField()
    is_available = serializers.ReadOnlyField()
    service_area_names = serializers.SerializerMethodField()
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    
    class Meta:
        model = Collector
        fields = '__all__'
    
    def get_service_area_names(self, obj):
        """Get list of service area names"""
        return [area.name for area in obj.service_areas.all()]


class CollectorCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating collectors"""
    
    class Meta:
        model = Collector
        fields = [
            'employee_id', 'first_name', 'last_name',
            'email', 'phone', 'national_id', 'photo',
            'address', 'employment_type', 'hire_date', 'termination_date',
            'service_areas', 'device_id', 'nfc_reader_id',
            'status', 'notes'
        ]
    
    def validate_employee_id(self, value):
        """Ensure employee ID is unique"""
        if self.instance:
            if Collector.objects.exclude(id=self.instance.id).filter(employee_id=value).exists():
                raise serializers.ValidationError("Collector with this employee ID already exists.")
        else:
            if Collector.objects.filter(employee_id=value).exists():
                raise serializers.ValidationError("Collector with this employee ID already exists.")
        return value.upper()


class ScheduleListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for schedule lists"""
    route_name = serializers.CharField(source='route.name', read_only=True)
    collector_name = serializers.CharField(source='collector.full_name', read_only=True)
    service_area_name = serializers.CharField(source='route.service_area.name', read_only=True)
    collection_rate = serializers.ReadOnlyField()
    is_today = serializers.ReadOnlyField()
    is_overdue = serializers.ReadOnlyField()
    
    class Meta:
        model = Schedule
        fields = [
            'id', 'route', 'route_name', 'service_area_name',
            'collector', 'collector_name',
            'scheduled_date', 'scheduled_time_start', 'scheduled_time_end',
            'status', 'customers_scheduled', 'customers_collected', 'customers_missed',
            'collection_rate', 'is_today', 'is_overdue',
            'created_at', 'updated_at'
        ]


class ScheduleDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for schedule detail view"""
    route_name = serializers.CharField(source='route.name', read_only=True)
    collector_name = serializers.CharField(source='collector.full_name', read_only=True)
    service_area_name = serializers.CharField(source='route.service_area.name', read_only=True)
    collection_rate = serializers.ReadOnlyField()
    duration_minutes = serializers.ReadOnlyField()
    is_today = serializers.ReadOnlyField()
    is_overdue = serializers.ReadOnlyField()
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    
    class Meta:
        model = Schedule
        fields = '__all__'


class ScheduleCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating schedules"""
    
    class Meta:
        model = Schedule
        fields = [
            'route', 'collector', 'scheduled_date',
            'scheduled_time_start', 'scheduled_time_end',
            'status', 'customers_scheduled', 'customers_collected', 'customers_missed',
            'notes', 'cancellation_reason'
        ]
    
    def validate(self, data):
        """Validate schedule data"""
        # Check for duplicate schedule
        if not self.instance:  # Only for create
            route = data.get('route')
            scheduled_date = data.get('scheduled_date')
            if route and scheduled_date:
                if Schedule.objects.filter(route=route, scheduled_date=scheduled_date).exists():
                    raise serializers.ValidationError({
                        'scheduled_date': 'A schedule already exists for this route on this date.'
                    })
        
        return data


class ServiceAreaStatsSerializer(serializers.Serializer):
    """Statistics for service areas"""
    total_areas = serializers.IntegerField()
    active_areas = serializers.IntegerField()
    inactive_areas = serializers.IntegerField()
    planned_areas = serializers.IntegerField()
    total_households = serializers.IntegerField()
    total_customers = serializers.IntegerField()
    total_routes = serializers.IntegerField()
    total_collectors = serializers.IntegerField()

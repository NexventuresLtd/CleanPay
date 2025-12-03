"""
Operations Admin Configuration
"""

from django.contrib import admin
from django.utils.html import format_html
from .models import ServiceArea, Route, Collector, Schedule


@admin.register(ServiceArea)
class ServiceAreaAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'status', 'province', 'district', 'sector', 
                    'estimated_customers', 'active_routes_count', 'created_at']
    list_filter = ['status', 'province', 'district', 'sector']
    search_fields = ['name', 'code', 'province', 'district', 'sector', 'cell', 'village']
    readonly_fields = ['id', 'created_by', 'created_at', 'updated_at', 
                       'active_routes_count', 'assigned_collectors_count', 'full_address']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('id', 'code', 'name', 'description', 'status')
        }),
        ('Geographic Details', {
            'fields': ('province', 'district', 'sector', 'cell', 'village', 'full_address')
        }),
        ('Coordinates & Boundary', {
            'fields': ('latitude', 'longitude', 'boundary_geojson'),
            'classes': ('collapse',)
        }),
        ('Estimates', {
            'fields': ('estimated_households', 'estimated_customers')
        }),
        ('Statistics', {
            'fields': ('active_routes_count', 'assigned_collectors_count')
        }),
        ('Metadata', {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def active_routes_count(self, obj):
        return obj.active_routes_count
    active_routes_count.short_description = 'Active Routes'
    
    actions = ['activate_areas', 'deactivate_areas']
    
    def activate_areas(self, request, queryset):
        count = queryset.update(status='active')
        self.message_user(request, f'{count} service areas activated.')
    activate_areas.short_description = 'Activate selected service areas'
    
    def deactivate_areas(self, request, queryset):
        count = queryset.update(status='inactive')
        self.message_user(request, f'{count} service areas deactivated.')
    deactivate_areas.short_description = 'Deactivate selected service areas'


@admin.register(Route)
class RouteAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'service_area', 'frequency', 'status', 
                    'default_collector', 'customers_count', 'sequence_number']
    list_filter = ['status', 'frequency', 'service_area']
    search_fields = ['name', 'code', 'service_area__name']
    readonly_fields = ['id', 'created_by', 'created_at', 'updated_at', 
                       'customers_count', 'collection_schedule_display']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('id', 'code', 'name', 'description', 'status')
        }),
        ('Assignment', {
            'fields': ('service_area', 'default_collector', 'sequence_number')
        }),
        ('Route Details', {
            'fields': ('estimated_distance_km', 'estimated_duration_minutes', 'path_geojson'),
            'classes': ('collapse',)
        }),
        ('Collection Schedule', {
            'fields': ('frequency', 'collection_days', 'collection_time_start', 
                      'collection_time_end', 'collection_schedule_display')
        }),
        ('Statistics', {
            'fields': ('customers_count',)
        }),
        ('Metadata', {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def customers_count(self, obj):
        return obj.customers_count
    customers_count.short_description = 'Customers'
    
    actions = ['activate_routes', 'deactivate_routes', 'archive_routes']
    
    def activate_routes(self, request, queryset):
        count = queryset.update(status='active')
        self.message_user(request, f'{count} routes activated.')
    activate_routes.short_description = 'Activate selected routes'
    
    def deactivate_routes(self, request, queryset):
        count = queryset.update(status='inactive')
        self.message_user(request, f'{count} routes deactivated.')
    deactivate_routes.short_description = 'Deactivate selected routes'
    
    def archive_routes(self, request, queryset):
        count = queryset.update(status='archived')
        self.message_user(request, f'{count} routes archived.')
    archive_routes.short_description = 'Archive selected routes'


@admin.register(Collector)
class CollectorAdmin(admin.ModelAdmin):
    list_display = ['employee_id', 'full_name_display', 'phone', 'status', 
                    'employment_type', 'rating', 'total_collections', 'photo_thumbnail']
    list_filter = ['status', 'employment_type']
    search_fields = ['employee_id', 'first_name', 'last_name', 'phone', 'email', 'national_id']
    readonly_fields = ['id', 'created_by', 'created_at', 'updated_at', 
                       'full_name', 'is_available', 'assigned_routes_count', 'photo_preview']
    filter_horizontal = ['service_areas']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('id', 'employee_id', 'user', 'first_name', 'last_name', 'full_name')
        }),
        ('Contact Information', {
            'fields': ('email', 'phone', 'address')
        }),
        ('Identification', {
            'fields': ('national_id', 'photo', 'photo_preview'),
            'classes': ('collapse',)
        }),
        ('Employment Details', {
            'fields': ('employment_type', 'hire_date', 'termination_date', 'status')
        }),
        ('Assignments', {
            'fields': ('service_areas', 'assigned_routes_count')
        }),
        ('Devices', {
            'fields': ('device_id', 'nfc_reader_id'),
            'classes': ('collapse',)
        }),
        ('Performance', {
            'fields': ('rating', 'total_collections', 'is_available')
        }),
        ('Metadata', {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def full_name_display(self, obj):
        return obj.full_name
    full_name_display.short_description = 'Full Name'
    
    def photo_thumbnail(self, obj):
        if obj.photo:
            return format_html('<img src="{}" width="30" height="30" style="border-radius: 50%;" />', obj.photo.url)
        return '-'
    photo_thumbnail.short_description = 'Photo'
    
    def photo_preview(self, obj):
        if obj.photo:
            return format_html('<img src="{}" width="150" />', obj.photo.url)
        return 'No photo'
    photo_preview.short_description = 'Photo Preview'
    
    actions = ['activate_collectors', 'suspend_collectors', 'set_on_leave']
    
    def activate_collectors(self, request, queryset):
        count = queryset.update(status='active')
        self.message_user(request, f'{count} collectors activated.')
    activate_collectors.short_description = 'Activate selected collectors'
    
    def suspend_collectors(self, request, queryset):
        count = queryset.update(status='suspended')
        self.message_user(request, f'{count} collectors suspended.')
    suspend_collectors.short_description = 'Suspend selected collectors'
    
    def set_on_leave(self, request, queryset):
        count = queryset.update(status='on_leave')
        self.message_user(request, f'{count} collectors set to on leave.')
    set_on_leave.short_description = 'Set selected collectors on leave'


@admin.register(Schedule)
class ScheduleAdmin(admin.ModelAdmin):
    list_display = ['id', 'route', 'collector', 'scheduled_date', 'scheduled_time_start', 
                    'status', 'collection_rate_display', 'is_today', 'is_overdue']
    list_filter = ['status', 'scheduled_date', 'route__service_area']
    search_fields = ['route__name', 'collector__first_name', 'collector__last_name']
    readonly_fields = ['id', 'created_by', 'created_at', 'updated_at', 
                       'collection_rate', 'duration_minutes', 'is_today', 'is_overdue']
    date_hierarchy = 'scheduled_date'
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('id', 'route', 'collector', 'status')
        }),
        ('Schedule', {
            'fields': ('scheduled_date', 'scheduled_time_start', 'scheduled_time_end', 
                      'is_today', 'is_overdue')
        }),
        ('Actual Times', {
            'fields': ('actual_start_time', 'actual_end_time', 'duration_minutes')
        }),
        ('Collection Statistics', {
            'fields': ('customers_scheduled', 'customers_collected', 'customers_missed', 'collection_rate')
        }),
        ('Additional Info', {
            'fields': ('notes', 'cancellation_reason'),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def collection_rate_display(self, obj):
        rate = obj.collection_rate
        if rate >= 90:
            color = 'green'
        elif rate >= 70:
            color = 'orange'
        else:
            color = 'red'
        return format_html('<span style="color: {};">{:.1f}%</span>', color, rate)
    collection_rate_display.short_description = 'Collection Rate'
    
    actions = ['mark_completed', 'mark_cancelled', 'mark_missed']
    
    def mark_completed(self, request, queryset):
        count = queryset.update(status='completed')
        self.message_user(request, f'{count} schedules marked as completed.')
    mark_completed.short_description = 'Mark selected schedules as completed'
    
    def mark_cancelled(self, request, queryset):
        count = queryset.update(status='cancelled')
        self.message_user(request, f'{count} schedules cancelled.')
    mark_cancelled.short_description = 'Cancel selected schedules'
    
    def mark_missed(self, request, queryset):
        count = queryset.update(status='missed')
        self.message_user(request, f'{count} schedules marked as missed.')
    mark_missed.short_description = 'Mark selected schedules as missed'

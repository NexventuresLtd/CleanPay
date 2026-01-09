"""
Operations Models
Handles service areas, routes, collectors, and schedules for waste collection operations.
"""

import uuid
from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import RegexValidator
from django.utils import timezone

User = get_user_model()


class ServiceArea(models.Model):
    """
    Service Area - Geographic zone for waste collection (e.g., cell, village, sector).
    """
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('planned', 'Planned'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Company relationship (multi-tenant support)
    company = models.ForeignKey(
        'accounts.Company',
        on_delete=models.CASCADE,
        related_name='service_areas',
        null=True,
        blank=True,
        help_text="Company managing this service area"
    )
    
    name = models.CharField(max_length=255, help_text="Name of the service area (e.g., 'Kimironko Cell')")
    code = models.CharField(max_length=50, unique=True, help_text="Unique code for the area")
    description = models.TextField(blank=True, help_text="Additional details about the area")
    
    # Geographic hierarchy (for Rwanda context)
    province = models.CharField(max_length=100, blank=True, help_text="Province name")
    district = models.CharField(max_length=100, blank=True, help_text="District name")
    sector = models.CharField(max_length=100, blank=True, help_text="Sector name")
    cell = models.CharField(max_length=100, blank=True, help_text="Cell name")
    village = models.CharField(max_length=100, blank=True, help_text="Village name")
    
    # Geographic coordinates (optional, for mapping)
    latitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    longitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    boundary_geojson = models.JSONField(
        null=True, 
        blank=True, 
        help_text="GeoJSON polygon defining area boundaries"
    )
    
    # Operational details
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    estimated_households = models.IntegerField(default=0, help_text="Estimated number of households")
    estimated_customers = models.IntegerField(default=0, help_text="Number of registered customers")
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='created_service_areas'
    )
    
    class Meta:
        ordering = ['province', 'district', 'sector', 'cell', 'name']
        indexes = [
            models.Index(fields=['code']),
            models.Index(fields=['status']),
            models.Index(fields=['province', 'district', 'sector']),
        ]
        verbose_name = 'Service Area'
        verbose_name_plural = 'Service Areas'
    
    def __str__(self):
        return f"{self.name} ({self.code})"
    
    @property
    def full_address(self):
        """Return full hierarchical address"""
        parts = [
            self.village,
            self.cell,
            self.sector,
            self.district,
            self.province
        ]
        return ", ".join(filter(None, parts))
    
    @property
    def active_routes_count(self):
        """Count of active routes in this area"""
        return self.routes.filter(status='active').count()
    
    @property
    def assigned_collectors_count(self):
        """Count of collectors assigned to this area"""
        return self.collectors.filter(status='active').count()


class Route(models.Model):
    """
    Collection Route - Specific path within a service area for waste collection.
    """
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('archived', 'Archived'),
    ]
    
    FREQUENCY_CHOICES = [
        ('daily', 'Daily'),
        ('twice_weekly', 'Twice Weekly'),
        ('weekly', 'Weekly'),
        ('biweekly', 'Biweekly'),
        ('monthly', 'Monthly'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    service_area = models.ForeignKey(
        ServiceArea,
        on_delete=models.CASCADE,
        related_name='routes'
    )
    
    name = models.CharField(max_length=255, help_text="Route name (e.g., 'Route A - Kimironko North')")
    code = models.CharField(max_length=50, unique=True, help_text="Unique route code")
    description = models.TextField(blank=True)
    
    # Route details
    sequence_number = models.IntegerField(
        default=1,
        help_text="Order of this route within the service area"
    )
    estimated_distance_km = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        default=0,
        help_text="Estimated route distance in kilometers"
    )
    estimated_duration_minutes = models.IntegerField(
        default=0,
        help_text="Estimated time to complete route in minutes"
    )
    
    # Route path (optional GeoJSON line string)
    path_geojson = models.JSONField(
        null=True,
        blank=True,
        help_text="GeoJSON LineString defining route path"
    )
    
    # Schedule
    frequency = models.CharField(
        max_length=20,
        choices=FREQUENCY_CHOICES,
        default='weekly',
        help_text="Collection frequency"
    )
    collection_days = models.JSONField(
        default=list,
        blank=True,
        help_text="List of collection days (e.g., ['Monday', 'Thursday'])"
    )
    collection_time_start = models.TimeField(
        null=True,
        blank=True,
        help_text="Usual start time for collections"
    )
    collection_time_end = models.TimeField(
        null=True,
        blank=True,
        help_text="Usual end time for collections"
    )
    
    # Assignment
    default_collector = models.ForeignKey(
        'Collector',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='default_routes',
        help_text="Default collector assigned to this route"
    )
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    notes = models.TextField(blank=True, help_text="Special instructions or notes about the route")
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='created_routes'
    )
    
    class Meta:
        ordering = ['service_area', 'sequence_number', 'name']
        unique_together = [['service_area', 'sequence_number']]
        indexes = [
            models.Index(fields=['code']),
            models.Index(fields=['service_area', 'status']),
            models.Index(fields=['default_collector']),
        ]
        verbose_name = 'Route'
        verbose_name_plural = 'Routes'
    
    def __str__(self):
        return f"{self.name} - {self.service_area.name}"
    
    @property
    def customers_count(self):
        """Count of customers assigned to this route"""
        # TODO: Add route field to Customer model to enable customer-route assignment
        # For now, return 0 as customers are not yet linked to routes
        return 0
    
    @property
    def collection_schedule_display(self):
        """Human-readable collection schedule"""
        if self.collection_days:
            days = ", ".join(self.collection_days)
            return f"{self.get_frequency_display()} on {days}"
        return self.get_frequency_display()


class Collector(models.Model):
    """
    Collector - Staff member who performs waste collection.
    """
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('on_leave', 'On Leave'),
        ('inactive', 'Inactive'),
        ('suspended', 'Suspended'),
    ]
    
    EMPLOYMENT_TYPE_CHOICES = [
        ('full_time', 'Full Time'),
        ('part_time', 'Part Time'),
        ('contractor', 'Contractor'),
        ('temporary', 'Temporary'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Company relationship (multi-tenant support)
    company = models.ForeignKey(
        'accounts.Company',
        on_delete=models.CASCADE,
        related_name='collectors',
        null=True,
        blank=True,
        help_text="Company employing this collector"
    )
    
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='collector_profile',
        help_text="Linked user account for app access"
    )
    
    # Personal Information
    employee_id = models.CharField(
        max_length=50,
        unique=True,
        help_text="Unique employee/collector ID"
    )
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(blank=True)
    phone = models.CharField(
        max_length=20,
        validators=[RegexValidator(
            regex=r'^\+?1?\d{9,15}$',
            message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
        )]
    )
    national_id = models.CharField(
        max_length=50,
        blank=True,
        help_text="National ID number"
    )
    photo = models.ImageField(upload_to='collectors/', null=True, blank=True)
    
    # Address
    address = models.TextField(blank=True)
    
    # Employment Details
    employment_type = models.CharField(
        max_length=20,
        choices=EMPLOYMENT_TYPE_CHOICES,
        default='full_time'
    )
    hire_date = models.DateField(null=True, blank=True)
    termination_date = models.DateField(null=True, blank=True)
    
    # Assignment
    service_areas = models.ManyToManyField(
        ServiceArea,
        related_name='collectors',
        blank=True,
        help_text="Service areas this collector can work in"
    )
    
    # Device Assignment
    device_id = models.CharField(
        max_length=255,
        blank=True,
        help_text="Assigned mobile device ID"
    )
    nfc_reader_id = models.CharField(
        max_length=255,
        blank=True,
        help_text="Assigned NFC reader device ID"
    )
    
    # Status and Performance
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=5.00,
        help_text="Average rating (1-5)"
    )
    total_collections = models.IntegerField(
        default=0,
        help_text="Total number of collections completed"
    )
    
    # Metadata
    notes = models.TextField(blank=True, help_text="Internal notes about the collector")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='created_collectors'
    )
    
    class Meta:
        ordering = ['last_name', 'first_name']
        indexes = [
            models.Index(fields=['employee_id']),
            models.Index(fields=['phone']),
            models.Index(fields=['status']),
        ]
        verbose_name = 'Collector'
        verbose_name_plural = 'Collectors'
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.employee_id})"
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    @property
    def is_available(self):
        """Check if collector is available for assignments"""
        return self.status == 'active'
    
    @property
    def assigned_routes_count(self):
        """Count of routes assigned as default collector"""
        return self.default_routes.filter(status='active').count()


class Schedule(models.Model):
    """
    Collection Schedule - Specific scheduled collection for a route.
    """
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('missed', 'Missed'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    route = models.ForeignKey(
        Route,
        on_delete=models.CASCADE,
        related_name='schedules'
    )
    collector = models.ForeignKey(
        Collector,
        on_delete=models.SET_NULL,
        null=True,
        related_name='schedules',
        help_text="Assigned collector for this collection"
    )
    
    # Schedule Details
    scheduled_date = models.DateField(help_text="Date of scheduled collection")
    scheduled_time_start = models.TimeField(
        null=True,
        blank=True,
        help_text="Scheduled start time"
    )
    scheduled_time_end = models.TimeField(
        null=True,
        blank=True,
        help_text="Scheduled end time"
    )
    
    # Waste Type
    WASTE_TYPE_CHOICES = [
        ('biodegradable', 'Biodegradable'),
        ('non_biodegradable', 'Non-Biodegradable'),
        ('mixed', 'Mixed'),
    ]
    waste_type = models.CharField(
        max_length=20,
        choices=WASTE_TYPE_CHOICES,
        default='mixed',
        help_text="Type of waste to be collected"
    )
    
    # Actual Times (recorded during collection)
    actual_start_time = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Actual collection start time"
    )
    actual_end_time = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Actual collection completion time"
    )
    
    # Status and Statistics
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    customers_scheduled = models.IntegerField(
        default=0,
        help_text="Number of customers scheduled for collection"
    )
    customers_collected = models.IntegerField(
        default=0,
        help_text="Number of successful collections"
    )
    customers_missed = models.IntegerField(
        default=0,
        help_text="Number of missed collections"
    )
    
    # Additional Details
    notes = models.TextField(blank=True, help_text="Notes about this scheduled collection")
    cancellation_reason = models.TextField(blank=True, help_text="Reason if cancelled")
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='created_schedules'
    )
    
    class Meta:
        ordering = ['-scheduled_date', 'scheduled_time_start']
        unique_together = [['route', 'scheduled_date']]
        indexes = [
            models.Index(fields=['scheduled_date', 'status']),
            models.Index(fields=['collector', 'scheduled_date']),
            models.Index(fields=['route', 'scheduled_date']),
        ]
        verbose_name = 'Schedule'
        verbose_name_plural = 'Schedules'
    
    def __str__(self):
        return f"{self.route.name} - {self.scheduled_date} ({self.status})"
    
    @property
    def collection_rate(self):
        """Calculate percentage of successful collections"""
        if self.customers_scheduled > 0:
            return (self.customers_collected / self.customers_scheduled) * 100
        return 0
    
    @property
    def duration_minutes(self):
        """Calculate actual duration if both times are recorded"""
        if self.actual_start_time and self.actual_end_time:
            delta = self.actual_end_time - self.actual_start_time
            return delta.total_seconds() / 60
        return None
    
    @property
    def is_today(self):
        """Check if this schedule is for today"""
        return self.scheduled_date == timezone.now().date()
    
    @property
    def is_overdue(self):
        """Check if schedule is overdue"""
        return (
            self.status == 'scheduled' and
            self.scheduled_date < timezone.now().date()
        )

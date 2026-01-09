"""
Company Model for Multi-tenant System
Enables System Admin to manage multiple waste collection companies.
"""

import uuid
from django.db import models
from django.core.validators import EmailValidator
from django.utils import timezone


class Company(models.Model):
    """
    Company model - represents a waste collection company (tenant).
    System Admin can manage multiple companies.
    """
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('suspended', 'Suspended'),
        ('inactive', 'Inactive'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Basic Information
    name = models.CharField(max_length=255, unique=True, help_text="Company name (e.g., C&GS Ltd)")
    registration_number = models.CharField(max_length=100, unique=True, blank=True, null=True, help_text="Business registration number")
    tax_id = models.CharField(max_length=100, blank=True, null=True, help_text="Tax identification number")
    
    # Contact Information
    email = models.EmailField(validators=[EmailValidator()], help_text="Primary contact email")
    phone = models.CharField(max_length=20, blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    
    # Address Information (Rwanda structure)
    address = models.JSONField(
        default=dict,
        blank=True,
        help_text="Address: {district, sector, cell, village, street}"
    )
    
    # Service Areas (Districts they operate in)
    service_districts = models.JSONField(
        default=list,
        blank=True,
        help_text="List of districts where company provides service"
    )
    
    # Status and Settings
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    is_verified = models.BooleanField(default=False, help_text="Company has been verified by system admin")
    
    # Subscription/License Information
    license_start_date = models.DateField(blank=True, null=True)
    license_end_date = models.DateField(blank=True, null=True)
    max_customers = models.IntegerField(default=1000, help_text="Maximum number of customers allowed")
    max_collectors = models.IntegerField(default=50, help_text="Maximum number of collectors allowed")
    
    # Branding (optional)
    logo = models.ImageField(upload_to='company_logos/', blank=True, null=True)
    primary_color = models.CharField(max_length=7, default='#047857', help_text="Hex color code for branding")
    
    # Billing/Payment Settings
    prepaid_collection_price = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        default=1000.00,
        help_text="Price per prepaid collection in RWF"
    )
    
    # Metadata
    notes = models.TextField(blank=True, null=True, help_text="Internal notes about the company")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        'accounts.User', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='companies_created',
        help_text="System admin who created this company"
    )
    
    class Meta:
        verbose_name = "Company"
        verbose_name_plural = "Companies"
        ordering = ['name']
    
    def __str__(self):
        return self.name
    
    @property
    def is_active(self):
        """Check if company is currently active."""
        return self.status == 'active' and self.is_license_valid
    
    @property
    def is_license_valid(self):
        """Check if company license is still valid."""
        if not self.license_end_date:
            return True  # No expiry set
        return self.license_end_date >= timezone.now().date()
    
    @property
    def customer_count(self):
        """Get total number of customers for this company."""
        return self.customers.count()
    
    @property
    def collector_count(self):
        """Get total number of collectors for this company."""
        from operations.models import Collector
        return Collector.objects.filter(company=self).count()
    
    @property
    def address_display(self):
        """Format address for display."""
        if not self.address:
            return "N/A"
        parts = [
            self.address.get('district', ''),
            self.address.get('sector', ''),
            self.address.get('cell', ''),
        ]
        return ' · '.join(filter(None, parts)) or "N/A"
    
    def can_add_customer(self):
        """Check if company can add more customers."""
        return self.customer_count < self.max_customers
    
    def can_add_collector(self):
        """Check if company can add more collectors."""
        return self.collector_count < self.max_collectors

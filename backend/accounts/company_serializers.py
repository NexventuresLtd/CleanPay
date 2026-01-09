"""
Company Serializers for System Admin Portal
"""

from rest_framework import serializers
from .company_models import Company
from customers.models import Customer
from operations.models import Collector


class CompanyListSerializer(serializers.ModelSerializer):
    """Serializer for listing companies."""
    
    customer_count = serializers.IntegerField(read_only=True)
    collector_count = serializers.IntegerField(read_only=True)
    is_active = serializers.BooleanField(read_only=True)
    is_license_valid = serializers.BooleanField(read_only=True)
    address_display = serializers.CharField(read_only=True)
    
    class Meta:
        model = Company
        fields = [
            'id', 'name', 'email', 'phone', 'status', 'is_verified',
            'customer_count', 'collector_count', 'is_active', 'is_license_valid',
            'address_display', 'service_districts', 'created_at', 'license_end_date'
        ]


class CompanyDetailSerializer(serializers.ModelSerializer):
    """Serializer for detailed company view."""
    
    customer_count = serializers.IntegerField(read_only=True)
    collector_count = serializers.IntegerField(read_only=True)
    is_active = serializers.BooleanField(read_only=True)
    is_license_valid = serializers.BooleanField(read_only=True)
    address_display = serializers.CharField(read_only=True)
    created_by_email = serializers.EmailField(source='created_by.email', read_only=True)
    
    class Meta:
        model = Company
        fields = [
            'id', 'name', 'registration_number', 'tax_id', 'email', 'phone', 'website',
            'address', 'address_display', 'service_districts', 'status', 'is_verified',
            'license_start_date', 'license_end_date', 'max_customers', 'max_collectors',
            'logo', 'primary_color', 'prepaid_collection_price', 'notes',
            'customer_count', 'collector_count', 'is_active', 'is_license_valid',
            'created_at', 'updated_at', 'created_by_email'
        ]


class CompanyCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a new company."""
    
    class Meta:
        model = Company
        fields = [
            'name', 'registration_number', 'tax_id', 'email', 'phone', 'website',
            'address', 'service_districts', 'status', 'is_verified',
            'license_start_date', 'license_end_date', 'max_customers', 'max_collectors',
            'logo', 'primary_color', 'prepaid_collection_price', 'notes'
        ]
    
    def create(self, validated_data):
        # Set created_by from request context
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['created_by'] = request.user
        return super().create(validated_data)


class CompanyUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating company information."""
    
    class Meta:
        model = Company
        fields = [
            'name', 'registration_number', 'tax_id', 'email', 'phone', 'website',
            'address', 'service_districts', 'status', 'is_verified',
            'license_start_date', 'license_end_date', 'max_customers', 'max_collectors',
            'logo', 'primary_color', 'prepaid_collection_price', 'notes'
        ]


class CompanyStatsSerializer(serializers.Serializer):
    """Serializer for company statistics."""
    
    total_companies = serializers.IntegerField()
    active_companies = serializers.IntegerField()
    suspended_companies = serializers.IntegerField()
    total_customers = serializers.IntegerField()
    total_collectors = serializers.IntegerField()
    expiring_licenses = serializers.IntegerField()

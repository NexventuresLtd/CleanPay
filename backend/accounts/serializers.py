from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate
from .models import User, Role, AuditLog


class RoleSerializer(serializers.ModelSerializer):
    """Serializer for Role model."""
    
    class Meta:
        model = Role
        fields = ['id', 'name', 'display_name', 'description', 'permissions', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model."""
    
    role_details = RoleSerializer(source='role', read_only=True)
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'full_name', 'phone', 'role', 'role_details',
            'avatar', 'company', 'job_title', 'address', 'city', 'country', 'timezone', 'language',
            'is_verified', 'is_active', 'mfa_enabled', 'email_notifications', 'sms_notifications',
            'last_login', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'is_verified', 'created_at', 'updated_at', 'last_login']
        extra_kwargs = {'password': {'write_only': True}}
    
    def get_full_name(self, obj):
        return obj.get_full_name()


class UserCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating new users."""
    
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = [
            'email', 'password', 'password_confirm', 'first_name', 'last_name',
            'phone', 'company', 'job_title', 'timezone', 'language'
        ]
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user profile."""
    
    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'phone', 'avatar', 'company', 'job_title',
            'address', 'city', 'country', 'timezone', 'language',
            'email_notifications', 'sms_notifications'
        ]


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for password change endpoint."""
    
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True, validators=[validate_password])
    new_password_confirm = serializers.CharField(required=True, write_only=True)
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({"new_password": "Password fields didn't match."})
        return attrs
    
    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is not correct.")
        return value


class PasswordResetRequestSerializer(serializers.Serializer):
    """Serializer for requesting password reset."""
    
    email = serializers.EmailField(required=True)


class PasswordResetConfirmSerializer(serializers.Serializer):
    """Serializer for confirming password reset."""
    
    token = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, write_only=True, validators=[validate_password])
    new_password_confirm = serializers.CharField(required=True, write_only=True)
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({"new_password": "Password fields didn't match."})
        return attrs


class LoginSerializer(serializers.Serializer):
    """Serializer for user login - supports email or card_number."""
    
    email = serializers.EmailField(required=False, allow_blank=True)
    card_number = serializers.CharField(required=False, allow_blank=True, max_length=8)
    password = serializers.CharField(required=True, write_only=True)
    
    def validate(self, attrs):
        email = attrs.get('email')
        card_number = attrs.get('card_number')
        password = attrs.get('password')
        
        # Must provide either email or card_number
        if not email and not card_number:
            raise serializers.ValidationError('Must include either "email" or "card_number".')
        
        if not password:
            raise serializers.ValidationError('Must include "password".')
        
        user = None
        
        # Try card_number login first (for customers)
        if card_number:
            from customers.models import Customer
            try:
                customer = Customer.objects.select_related('user').get(card_number=card_number)
                if customer.user:
                    user = customer.user
                    if user.check_password(password):
                        if not user.is_active:
                            raise serializers.ValidationError('User account is disabled.')
                    else:
                        user = None
                else:
                    raise serializers.ValidationError('No user account linked to this card.')
            except Customer.DoesNotExist:
                raise serializers.ValidationError('Invalid card number.')
        
        # Try email login (for staff/admin)
        if not user and email:
            user = authenticate(username=email, password=password)
        
        if not user:
            raise serializers.ValidationError('Unable to log in with provided credentials.')
        
        if not user.is_active:
            raise serializers.ValidationError('User account is disabled.')
        
        if not user.is_verified:
            raise serializers.ValidationError('Email is not verified.')
        
        attrs['user'] = user
        return attrs


class AuditLogSerializer(serializers.ModelSerializer):
    """Serializer for Audit Log model."""
    
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_name = serializers.SerializerMethodField()
    
    class Meta:
        model = AuditLog
        fields = [
            'id', 'user', 'user_email', 'user_name', 'action', 'entity_type', 'entity_id',
            'old_values', 'new_values', 'ip_address', 'user_agent', 'created_at'
        ]
        read_only_fields = fields
    
    def get_user_name(self, obj):
        return obj.user.get_full_name() if obj.user else None

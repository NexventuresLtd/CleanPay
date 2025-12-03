from rest_framework import permissions


class IsAdmin(permissions.BasePermission):
    """Permission check for admin users."""
    
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and (
            request.user.is_superuser or 
            (request.user.role and request.user.role.name == 'admin')
        )


class IsOwnerOrAdmin(permissions.BasePermission):
    """Permission check for object owner or admin."""
    
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        # Admin can access any object
        if request.user.is_superuser or (request.user.role and request.user.role.name == 'admin'):
            return True
        
        # Owner can access their own object
        if hasattr(obj, 'user'):
            return obj.user == request.user
        return obj == request.user


class IsFinanceManager(permissions.BasePermission):
    """Permission check for finance managers."""
    
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and (
            request.user.is_superuser or
            (request.user.role and request.user.role.name in ['admin', 'finance_manager'])
        )


class IsAccountant(permissions.BasePermission):
    """Permission check for accountants."""
    
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and (
            request.user.is_superuser or
            (request.user.role and request.user.role.name in ['admin', 'finance_manager', 'accountant'])
        )

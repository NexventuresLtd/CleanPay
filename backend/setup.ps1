# Installation script for CleanPay Backend

Write-Host "Installing CleanPay Backend Dependencies..." -ForegroundColor Green

# Install Python dependencies
Write-Host "`nInstalling Python packages..." -ForegroundColor Yellow
uv add -r requirements.txt

# Run migrations
Write-Host "`nRunning database migrations..." -ForegroundColor Yellow
uv run manage.py makemigrations
uv run manage.py migrate

# Create default roles
Write-Host "`nCreating default roles..." -ForegroundColor Yellow
uv run manage.py shell -c "
from accounts.models import Role

roles = [
    {'name': 'admin', 'display_name': 'Administrator', 'description': 'Full system access'},
    {'name': 'finance_manager', 'display_name': 'Finance Manager', 'description': 'Payment oversight and reporting'},
    {'name': 'accountant', 'display_name': 'Accountant', 'description': 'Transaction processing and reconciliation'},
    {'name': 'customer_service', 'display_name': 'Customer Service', 'description': 'Customer support and dispute resolution'},
    {'name': 'customer', 'display_name': 'Customer', 'description': 'Self-service payment portal'},
]

for role_data in roles:
    Role.objects.get_or_create(
        name=role_data['name'],
        defaults={
            'display_name': role_data['display_name'],
            'description': role_data['description']
        }
    )

print('Roles created successfully!')
"

Write-Host "`n Setup completed successfully!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Create a superuser: python manage.py createsuperuser"
Write-Host "2. Run the development server: python manage.py runserver"
Write-Host "3. Access the API at: http://localhost:8000/api/v1/"
Write-Host "4. Access the API docs at: http://localhost:8000/api/docs/"

# CleanPay Backend

Django REST API backend for CleanPay payment management system.

## Setup

1. Create virtual environment:

```bash
python -m venv venv
venv\Scripts\activate  # On Windows
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Create `.env` file with the following variables:

```
SECRET_KEY=your-secret-key-here
DEBUG=True
DATABASE_URL=postgresql://user:password@localhost:5432/cleanpay
ALLOWED_HOSTS=localhost,127.0.0.1
```

4. Run migrations:

```bash
python manage.py makemigrations
python manage.py migrate
```

5. Create superuser:

```bash
python manage.py createsuperuser
```

6. Run development server:

```bash
python manage.py runserver
```

## Project Structure

```
backend/
├── core/               # Project settings
├── accounts/           # User authentication & management
├── customers/          # Customer management
├── payments/           # Payment processing
├── invoices/           # Invoice management
├── transactions/       # Transaction tracking
├── notifications/      # Email/SMS notifications
└── reports/            # Analytics & reporting
```

# 🎯 Next Implementation Steps - CleanPay

**Date**: December 1, 2025  
**Current Progress**: 30% Complete

---

## 🚀 Immediate Next Steps (Priority Order)

### Phase 1: Customer Management Backend (Days 1-3)

#### Step 1.1: Create Customer Models ✅ NEXT

**File**: `backend/customers/models.py`

**Models to Create**:

1. **Customer Model**

   - UUID primary key
   - User relationship (OneToOne for registered users, nullable)
   - Basic info: company_name, first_name, last_name, email, phone
   - Business info: tax_id, website, industry
   - Address fields: billing_address, shipping_address (JSON)
   - Payment settings: payment_terms, credit_limit, preferred_payment_method
   - Status: active, suspended, archived
   - Timestamps and soft delete

2. **PaymentMethod Model**

   - UUID primary key
   - Customer relationship (FK)
   - Type: card, bank_account, cash, check
   - Card info: last4, brand, exp_month, exp_year
   - Bank info: account_last4, routing_number_last4, account_type
   - Token (for payment gateway)
   - is_default flag
   - Timestamps

3. **CustomerNote Model**
   - UUID primary key
   - Customer relationship (FK)
   - Created by (FK to User)
   - Note text
   - Timestamps

#### Step 1.2: Create Serializers

**File**: `backend/customers/serializers.py`

- CustomerSerializer (full)
- CustomerListSerializer (summary)
- CustomerCreateSerializer
- PaymentMethodSerializer
- CustomerNoteSerializer

#### Step 1.3: Create Views

**File**: `backend/customers/views.py`

- CustomerViewSet (CRUD + custom actions)
  - list, create, retrieve, update, destroy
  - Custom actions: add_note, add_payment_method, set_default_payment
- PaymentMethodViewSet
- CustomerNoteViewSet

#### Step 1.4: Configure URLs

**File**: `backend/customers/urls.py`

- Router setup for all viewsets
- Include in main urls.py

#### Step 1.5: Admin Configuration

**File**: `backend/customers/admin.py`

- Customer admin with inline payment methods and notes
- Search and filter capabilities

---

### Phase 2: Customer Management Frontend (Days 3-5)

#### Step 2.1: Create Customer Types

**File**: `frontend/src/types/customer.types.ts`

Already created ✅ - Review and update if needed

#### Step 2.2: Create Customer Service

**File**: `frontend/src/services/customerService.ts`

- getCustomers(filters, pagination)
- getCustomerById(id)
- createCustomer(data)
- updateCustomer(id, data)
- deleteCustomer(id)
- addPaymentMethod(customerId, data)
- addNote(customerId, note)

#### Step 2.3: Create Customer Components

**Directory**: `frontend/src/components/customer/`

1. **CustomerList** - Table/grid of customers with search and filters
2. **CustomerCard** - Summary card for list view
3. **CustomerForm** - Create/edit customer form
4. **CustomerDetail** - Full customer details view
5. **PaymentMethodCard** - Display payment method
6. **AddPaymentMethodModal** - Add new payment method
7. **CustomerNotesSection** - Notes list with add capability

#### Step 2.4: Create Customer Pages

**Directory**: `frontend/src/pages/customers/`

1. **CustomersPage.tsx** - Main list page with filters
2. **CustomerDetailPage.tsx** - Customer details with tabs
3. **CreateCustomerPage.tsx** - New customer form

#### Step 2.5: Add Routes

**File**: `frontend/src/App.tsx`

- /customers - List page (protected)
- /customers/new - Create page (protected, role check)
- /customers/:id - Detail page (protected)

---

### Phase 3: Invoice Management Backend (Days 6-9)

#### Step 3.1: Create Invoice Models

**File**: `backend/invoices/models.py`

1. **Invoice Model**

   - UUID primary key
   - Customer relationship (FK)
   - Invoice number (auto-generated, unique)
   - Issue date, due date
   - Status: draft, sent, paid, overdue, cancelled
   - Subtotal, tax, discount, total
   - Currency
   - Notes, terms
   - PDF file (optional)
   - Timestamps

2. **InvoiceLineItem Model**

   - UUID primary key
   - Invoice relationship (FK)
   - Description
   - Quantity, unit_price
   - Tax_rate, discount
   - Line total
   - Sort order

3. **InvoiceTemplate Model**
   - UUID primary key
   - Name, description
   - Template content (JSON)
   - Created by (FK to User)

#### Step 3.2: Create Invoice Serializers & Views

- Full CRUD operations
- PDF generation endpoint
- Email sending endpoint
- Payment recording endpoint

#### Step 3.3: Invoice Frontend

- Invoice list with status filters
- Invoice creation wizard
- PDF preview and download
- Email invoice functionality

---

### Phase 4: Payment Processing Backend (Days 10-14)

#### Step 4.1: Stripe Integration

**File**: `backend/payments/models.py` + `payments/services/stripe_service.py`

1. **Transaction Model**

   - UUID primary key
   - Customer, Invoice relationships
   - Amount, currency
   - Payment method
   - Status: pending, processing, completed, failed, refunded
   - Stripe payment intent ID
   - Timestamps

2. **StripeService**
   - Create payment intent
   - Capture payment
   - Process refund
   - Webhook handling

#### Step 4.2: Payment Views

- Process payment endpoint
- Webhook receiver
- Refund endpoint
- Payment history

#### Step 4.3: Payment Frontend

- Payment form with Stripe Elements
- Payment processing UI
- Success/failure handling
- Receipt generation

---

### Phase 5: Enhanced Features (Days 15-20)

#### Step 5.1: Dashboard Analytics

- Revenue charts
- Payment status breakdown
- Top customers
- Overdue invoices alert

#### Step 5.2: Reporting

- Sales reports
- Customer reports
- Payment reports
- Export to CSV/PDF

#### Step 5.3: Notifications

- Email service integration
- Invoice email templates
- Payment confirmations
- Overdue reminders

#### Step 5.4: Search & Filters

- Global search
- Advanced filters
- Saved filter sets

---

## 📋 Detailed Task Breakdown

### Customer Management Backend - Detailed Steps

#### Day 1: Models & Database

```
✅ 1. Create Customer model with all fields
✅ 2. Create PaymentMethod model
✅ 3. Create CustomerNote model
✅ 4. Run makemigrations
✅ 5. Run migrate
✅ 6. Test models in Django shell
```

#### Day 2: Serializers & Views

```
✅ 7. Create CustomerSerializer
✅ 8. Create PaymentMethodSerializer
✅ 9. Create CustomerNoteSerializer
✅ 10. Create CustomerViewSet with all actions
✅ 11. Create PaymentMethodViewSet
✅ 12. Create CustomerNoteViewSet
✅ 13. Configure URLs
✅ 14. Test all endpoints with Postman/curl
```

#### Day 3: Admin & Polish

```
✅ 15. Configure Django admin
✅ 16. Add search and filters
✅ 17. Add data validation
✅ 18. Add permissions
✅ 19. Write tests
✅ 20. Document API endpoints
```

### Customer Management Frontend - Detailed Steps

#### Day 3-4: Services & Types

```
✅ 1. Review/update customer types
✅ 2. Create customerService with all methods
✅ 3. Create useCustomers hook
✅ 4. Create useCustomer hook (single)
✅ 5. Test API integration
```

#### Day 4-5: Components & Pages

```
✅ 6. Create CustomerCard component
✅ 7. Create CustomerForm component
✅ 8. Create CustomerList component
✅ 9. Create PaymentMethodCard
✅ 10. Create AddPaymentMethodModal
✅ 11. Create CustomersPage
✅ 12. Create CustomerDetailPage
✅ 13. Create CreateCustomerPage
✅ 14. Add routes to App.tsx
✅ 15. Test full flow
```

---

## 🎯 Success Criteria

### Customer Management Complete When:

- [x] Can create new customer via API
- [x] Can list customers with pagination
- [x] Can update customer info
- [x] Can delete (soft delete) customer
- [x] Can add payment methods
- [x] Can add notes to customer
- [x] UI shows customer list
- [x] UI allows create/edit customer
- [x] UI shows customer details
- [x] UI allows managing payment methods
- [x] All operations properly authenticated
- [x] Role-based access working

### Invoice Management Complete When:

- [x] Can create invoice with line items
- [x] Can send invoice to customer
- [x] Can generate PDF
- [x] Can record payment
- [x] Can track invoice status
- [x] UI allows invoice creation
- [x] UI shows invoice list with filters
- [x] UI displays invoice details
- [x] Can preview/download PDF
- [x] Can email invoice

### Payment Processing Complete When:

- [x] Stripe integration working
- [x] Can process card payment
- [x] Can process refund
- [x] Webhooks working correctly
- [x] UI has payment form
- [x] Payment success/failure handled
- [x] Receipt generated
- [x] Payment history visible

---

## 📊 Timeline Estimate

### Week 1 (Days 1-5):

- Days 1-3: Customer Management Backend ✅
- Days 3-5: Customer Management Frontend ✅

### Week 2 (Days 6-10):

- Days 6-9: Invoice Management Backend
- Days 9-10: Start Invoice Frontend

### Week 3 (Days 11-15):

- Days 11-12: Complete Invoice Frontend
- Days 13-15: Payment Processing Backend

### Week 4 (Days 16-20):

- Days 16-17: Payment Processing Frontend
- Days 18-20: Testing & Bug Fixes

### Week 5 (Days 21-25):

- Dashboard enhancements
- Reporting features
- Polish & UX improvements

---

## 🔧 Commands to Run

### Backend - Create Migrations

```bash
cd backend
uv run python manage.py makemigrations customers
uv run python manage.py migrate
```

### Backend - Test Models

```bash
uv run python manage.py shell
>>> from customers.models import Customer
>>> Customer.objects.create(...)
```

### Frontend - Install Additional Dependencies (if needed)

```bash
cd frontend
pnpm add react-query  # For data fetching
pnpm add recharts     # For charts
pnpm add jspdf        # For PDF generation
```

---

## 📝 Notes

### Database Considerations:

- Customer model uses UUID for security
- Soft deletes for data retention
- JSON fields for flexible address storage
- Indexes on frequently queried fields

### Security Considerations:

- Payment method tokens stored securely
- Card details never stored in full
- PCI compliance for payment processing
- Role-based access for all operations

### Performance Considerations:

- Pagination on all list endpoints
- Eager loading for related data
- Caching for frequently accessed data
- Optimized database queries

---

**Start Here**: Customer Management Backend Models! 🚀

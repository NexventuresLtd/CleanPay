/**
 * Customer Detail Page
 * Displays customer information with tabs for overview, payment methods, and notes
 */

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useCustomer,
  useCustomerPaymentMethods,
  useCustomerNotes,
  useSuspendCustomer,
  useActivateCustomer,
  useDeleteCustomer,
  useSetDefaultPaymentMethod,
  useDeletePaymentMethod,
  useCreateCustomerNote,
  usePinCustomerNote,
  useUnpinCustomerNote,
  useDeleteCustomerNote,
} from "../../hooks/useCustomers";
import { AppLayout } from "../../components/layout";
import {
  PageHeader,
  Card,
  Button,
  EmptyState,
  Badge,
} from "../../components/common";
import { PageLoader } from "../../components/common/LoadingSpinner";
import { StatusBadge } from "../../components/common/Badge";
import { Alert } from "../../components/common/Alert";
import { format } from "date-fns";
import type { CreateCustomerNoteData } from "../../services/customerService";

type TabType = "overview" | "payment-methods" | "notes";

const CustomerDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [showAddNote, setShowAddNote] = useState(false);
  const [noteText, setNoteText] = useState("");

  // Fetch customer data
  const { data: customer, isLoading, error } = useCustomer(id!);
  const { data: paymentMethods } = useCustomerPaymentMethods(id!);
  const { data: notes } = useCustomerNotes(id!);

  // Mutations
  const suspendCustomer = useSuspendCustomer();
  const activateCustomer = useActivateCustomer();
  const deleteCustomer = useDeleteCustomer();
  const setDefaultPaymentMethod = useSetDefaultPaymentMethod();
  const deletePaymentMethod = useDeletePaymentMethod();
  const createNote = useCreateCustomerNote();
  const pinNote = usePinCustomerNote();
  const unpinNote = useUnpinCustomerNote();
  const deleteNote = useDeleteCustomerNote();

  if (isLoading) {
    return (
      <AppLayout>
        <PageLoader />
      </AppLayout>
    );
  }

  if (error || !customer) {
    return (
      <AppLayout>
        <div className="p-8">
          <Alert
            type="error"
            title="Error loading customer"
            message={
              error instanceof Error ? error.message : "Customer not found"
            }
          />
          <div className="mt-4">
            <Button onClick={() => navigate("/customers")} variant="outline">
              Back to Customers
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  const handleStatusChange = async () => {
    try {
      if (customer.status === "active") {
        await suspendCustomer.mutateAsync(customer.id);
        alert("Customer suspended successfully");
      } else {
        await activateCustomer.mutateAsync(customer.id);
        alert("Customer activated successfully");
      }
    } catch (err) {
      alert("Failed to change customer status");
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(`Are you sure you want to archive ${customer.full_name}?`)
    ) {
      try {
        await deleteCustomer.mutateAsync(customer.id);
        alert("Customer archived successfully");
        navigate("/customers");
      } catch (err) {
        alert("Failed to archive customer");
      }
    }
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;

    try {
      const noteData: CreateCustomerNoteData = {
        customer: customer.id,
        note: noteText,
      };
      await createNote.mutateAsync(noteData);
      setNoteText("");
      setShowAddNote(false);
      alert("Note added successfully");
    } catch (err) {
      alert("Failed to add note");
    }
  };

  const handleTogglePin = async (noteId: string, isPinned: boolean) => {
    try {
      if (isPinned) {
        await unpinNote.mutateAsync({ id: noteId, customerId: customer.id });
      } else {
        await pinNote.mutateAsync({ id: noteId, customerId: customer.id });
      }
    } catch (err) {
      alert("Failed to toggle pin");
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await deleteNote.mutateAsync({ id: noteId, customerId: customer.id });
        alert("Note deleted successfully");
      } catch (err) {
        alert("Failed to delete note");
      }
    }
  };

  const handleSetDefaultPaymentMethod = async (pmId: string) => {
    try {
      await setDefaultPaymentMethod.mutateAsync({
        id: pmId,
        customerId: customer.id,
      });
      alert("Payment method set as default");
    } catch (err) {
      alert("Failed to set default payment method");
    }
  };

  const handleDeletePaymentMethod = async (pmId: string) => {
    if (
      window.confirm("Are you sure you want to delete this payment method?")
    ) {
      try {
        await deletePaymentMethod.mutateAsync({
          id: pmId,
          customerId: customer.id,
        });
        alert("Payment method deleted successfully");
      } catch (err) {
        alert("Failed to delete payment method");
      }
    }
  };

  return (
    <AppLayout>
      {/* Header */}
      <PageHeader
        title={customer.full_name}
        subtitle={customer.company_name || undefined}
        backHref="/customers"
        actions={
          <div className="flex gap-2">
            <Button
              onClick={() => navigate(`/customers/${customer.id}/edit`)}
              variant="secondary"
            >
              Edit
            </Button>
            <Button
              onClick={handleStatusChange}
              variant="outline"
              disabled={suspendCustomer.isPending || activateCustomer.isPending}
            >
              {customer.status === "active" ? "Suspend" : "Activate"}
            </Button>
            <Button
              onClick={handleDelete}
              variant="danger"
              disabled={deleteCustomer.isPending}
            >
              Archive
            </Button>
          </div>
        }
      />

      <div className="px-6 pb-6">
        {/* Status Badge & Tabs */}
        <div className="mb-6 flex items-center gap-4">
          <StatusBadge status={customer.status} />
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-border-base">
          <nav className="-mb-px flex gap-8">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "overview"
                  ? "border-primary text-primary"
                  : "border-transparent text-text-secondary hover:text-text-primary hover:border-border-base"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("payment-methods")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "payment-methods"
                  ? "border-primary text-primary"
                  : "border-transparent text-text-secondary hover:text-text-primary hover:border-border-base"
              }`}
            >
              Payment Methods ({paymentMethods?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab("notes")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "notes"
                  ? "border-primary text-primary"
                  : "border-transparent text-text-secondary hover:text-text-primary hover:border-border-base"
              }`}
            >
              Notes ({notes?.length || 0})
            </button>
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Contact Information */}
            <Card className="lg:col-span-2">
              <h2 className="text-xl font-bold text-text-primary mb-4">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-text-secondary">
                    Email
                  </label>
                  <p className="mt-1 text-text-primary">{customer.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary">
                    Phone
                  </label>
                  <p className="mt-1 text-text-primary">
                    {customer.phone || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary">
                    Company
                  </label>
                  <p className="mt-1 text-text-primary">
                    {customer.company_name || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary">
                    Industry
                  </label>
                  <p className="mt-1 text-text-primary">
                    {customer.industry || "N/A"}
                  </p>
                </div>
                {customer.website && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-text-secondary">
                      Website
                    </label>
                    <p className="mt-1">
                      <a
                        href={customer.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {customer.website}
                      </a>
                    </p>
                  </div>
                )}
                {customer.tax_id && (
                  <div>
                    <label className="text-sm font-medium text-text-secondary">
                      Tax ID
                    </label>
                    <p className="mt-1 text-text-primary">{customer.tax_id}</p>
                  </div>
                )}
              </div>

              {/* Addresses */}
              {customer.billing_address_string && (
                <div className="mt-6">
                  <label className="text-sm font-medium text-text-secondary">
                    Billing Address
                  </label>
                  <p className="mt-1 text-text-primary">
                    {customer.billing_address_string}
                  </p>
                </div>
              )}
              {customer.shipping_address_string && (
                <div className="mt-4">
                  <label className="text-sm font-medium text-text-secondary">
                    Shipping Address
                  </label>
                  <p className="mt-1 text-text-primary">
                    {customer.shipping_address_string}
                  </p>
                </div>
              )}

              {/* Notes */}
              {customer.notes && (
                <div className="mt-6">
                  <label className="text-sm font-medium text-text-secondary">
                    Notes
                  </label>
                  <p className="mt-1 text-text-primary whitespace-pre-wrap">
                    {customer.notes}
                  </p>
                </div>
              )}
            </Card>

            {/* Account Details Sidebar */}
            <div className="space-y-6">
              {/* Payment Settings */}
              <Card>
                <h3 className="text-lg font-bold text-text-primary mb-4">
                  Payment Settings
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-text-secondary">
                      Payment Terms
                    </label>
                    <p className="mt-1 text-text-primary font-medium">
                      {customer.payment_terms.replace("_", " ")}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-secondary">
                      Credit Limit
                    </label>
                    <p className="mt-1 text-text-primary font-medium text-2xl">
                      ${parseFloat(customer.credit_limit).toLocaleString()}
                    </p>
                  </div>
                  {customer.preferred_payment_method && (
                    <div>
                      <label className="text-sm font-medium text-text-secondary">
                        Preferred Method
                      </label>
                      <p className="mt-1 text-text-primary">
                        {customer.preferred_payment_method}
                      </p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Metadata */}
              <Card>
                <h3 className="text-lg font-bold text-text-primary mb-4">
                  Account Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-text-secondary">
                      Created
                    </label>
                    <p className="mt-1 text-text-primary">
                      {format(new Date(customer.created_at), "MMM d, yyyy")}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-secondary">
                      Last Updated
                    </label>
                    <p className="mt-1 text-text-primary">
                      {format(new Date(customer.updated_at), "MMM d, yyyy")}
                    </p>
                  </div>
                  {customer.created_by_name && (
                    <div>
                      <label className="text-sm font-medium text-text-secondary">
                        Created By
                      </label>
                      <p className="mt-1 text-text-primary">
                        {customer.created_by_name}
                      </p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Tags */}
              {customer.tags && customer.tags.length > 0 && (
                <Card>
                  <h3 className="text-lg font-bold text-text-primary mb-3">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {customer.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary-light text-primary rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Payment Methods Tab */}
        {activeTab === "payment-methods" && (
          <Card>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-text-primary">
                Payment Methods
              </h2>
              <p className="mt-1 text-sm text-text-secondary">
                Manage customer payment methods
              </p>
            </div>

            {!paymentMethods || paymentMethods.length === 0 ? (
              <EmptyState
                icon={
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                }
                title="No payment methods"
                description="Get started by adding a payment method."
              />
            ) : (
              <div className="space-y-4">
                {paymentMethods.map((pm) => (
                  <div
                    key={pm.id}
                    className="flex items-center justify-between p-4 border border-border-base rounded-lg hover:bg-bg-subtle transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center">
                        {pm.type === "card" ? (
                          <svg
                            className="w-6 h-6 text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-6 h-6 text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-text-primary">
                            {pm.display_name}
                          </p>
                          {pm.is_default && (
                            <Badge variant="success" size="sm">
                              Default
                            </Badge>
                          )}
                          {pm.is_verified && (
                            <Badge variant="info" size="sm">
                              Verified
                            </Badge>
                          )}
                          {pm.is_expired_flag && (
                            <Badge variant="danger" size="sm">
                              Expired
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-text-secondary">
                          Added {format(new Date(pm.created_at), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!pm.is_default && (
                        <button
                          onClick={() => handleSetDefaultPaymentMethod(pm.id)}
                          className="text-sm text-primary hover:text-primary-hover font-medium"
                        >
                          Set Default
                        </button>
                      )}
                      <button
                        onClick={() => handleDeletePaymentMethod(pm.id)}
                        className="text-sm text-danger hover:text-danger-dark font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Notes Tab */}
        {activeTab === "notes" && (
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-text-primary">
                Customer Notes
              </h2>
              <Button
                onClick={() => setShowAddNote(true)}
                variant="primary"
                size="sm"
              >
                Add Note
              </Button>
            </div>

            {/* Add Note Form */}
            {showAddNote && (
              <div className="mb-6 p-4 border border-border-base rounded-lg bg-bg-subtle">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Enter your note..."
                  rows={4}
                  className="w-full px-3 py-2 border border-border-base rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-bg-base text-text-primary"
                />
                <div className="mt-3 flex gap-2">
                  <Button
                    onClick={handleAddNote}
                    variant="primary"
                    size="sm"
                    disabled={!noteText.trim() || createNote.isPending}
                  >
                    Save Note
                  </Button>
                  <Button
                    onClick={() => {
                      setShowAddNote(false);
                      setNoteText("");
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {!notes || notes.length === 0 ? (
              <EmptyState
                icon={
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                }
                title="No notes yet"
                description="Add notes to keep track of important information."
              />
            ) : (
              <div className="space-y-4">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className={`p-4 border rounded-lg ${
                      note.is_pinned
                        ? "border-primary bg-primary-light"
                        : "border-border-base bg-bg-base"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {note.is_pinned && (
                            <svg
                              className="w-5 h-5 text-primary"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 3a1 1 0 011 1v5h3a1 1 0 110 2h-3v5a1 1 0 11-2 0v-5H6a1 1 0 110-2h3V4a1 1 0 011-1z" />
                            </svg>
                          )}
                          <p className="text-sm text-text-secondary">
                            {note.created_by_name} •{" "}
                            {format(
                              new Date(note.created_at),
                              "MMM d, yyyy h:mm a"
                            )}
                          </p>
                        </div>
                        <p className="text-text-primary whitespace-pre-wrap">
                          {note.note}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() =>
                            handleTogglePin(note.id, note.is_pinned)
                          }
                          className="text-sm text-text-secondary hover:text-text-primary font-medium"
                          title={note.is_pinned ? "Unpin" : "Pin"}
                        >
                          {note.is_pinned ? "Unpin" : "Pin"}
                        </button>
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className="text-sm text-danger hover:text-danger-dark font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default CustomerDetailPage;

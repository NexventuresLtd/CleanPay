/**
 * Company Form Page
 * Create or edit a waste collection company
 */

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AppLayout } from "../../components/layout";
import { Card, Button } from "../../components/common";
import { PageLoader } from "../../components/common/LoadingSpinner";
import companyService from "../../services/companyService";
import { ArrowLeft, Building2 } from "lucide-react";

const RWANDA_DISTRICTS = [
  "Kigali",
  "Nyarugenge",
  "Gasabo",
  "Kicukiro",
  "Rwamagana",
  "Kayonza",
  "Kirehe",
  "Ngoma",
  "Bugesera",
  "Gatsibo",
  "Nyagatare",
  "Muhanga",
  "Kamonyi",
  "Ruhango",
  "Nyanza",
  "Gisagara",
  "Nyaruguru",
  "Huye",
  "Nyamagabe",
  "Rubavu",
  "Nyabihu",
  "Ngororero",
  "Rutsiro",
  "Karongi",
  "Rusizi",
  "Nyamasheke",
  "Rulindo",
  "Gakenke",
  "Musanze",
  "Burera",
  "Gicumbi",
];

export const CompanyFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const isEditing = Boolean(id);

  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState<{
    email: string;
    password: string;
    message: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    registration_number: "",
    tax_id: "",
    website: "",
    address: {
      district: "",
      sector: "",
      cell: "",
      village: "",
      street: "",
    },
    service_districts: [] as string[],
    max_customers: 1000,
    max_collectors: 50,
    prepaid_collection_price: "1000",
    status: "active" as "active" | "suspended" | "inactive",
    is_verified: false,
    license_start_date: "",
    license_end_date: "",
  });

  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);

  const { data: company, isLoading: companyLoading } = useQuery({
    queryKey: ["company", id],
    queryFn: () => companyService.getCompany(id!),
    enabled: isEditing,
  });

  // Populate form when editing
  if (company && isEditing && formData.name === "") {
    setFormData({
      name: company.name,
      email: company.email,
      phone: company.phone || "",
      registration_number: company.registration_number || "",
      tax_id: company.tax_id || "",
      website: company.website || "",
      address: company.address || {
        district: "",
        sector: "",
        cell: "",
        village: "",
        street: "",
      },
      service_districts: company.service_districts || [],
      max_customers: company.max_customers || 1000,
      max_collectors: company.max_collectors || 50,
      prepaid_collection_price: String(
        company.prepaid_collection_price || "1000"
      ),
      status: company.status,
      is_verified: company.is_verified,
      license_start_date: company.license_start_date || "",
      license_end_date: company.license_end_date || "",
    });
    setSelectedDistricts(company.service_districts || []);
  }

  const createMutation = useMutation({
    mutationFn: (data: any) => companyService.createCompany(data),
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });

      // Check if admin credentials were returned
      if (response.admin_credentials) {
        setAdminCredentials(response.admin_credentials);
        setShowCredentialsModal(true);
      } else {
        navigate("/system-admin/companies");
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => companyService.updateCompany(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      queryClient.invalidateQueries({ queryKey: ["company", id] });
      navigate("/system-admin/companies");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = {
      ...formData,
      service_districts: selectedDistricts,
    };

    if (isEditing) {
      updateMutation.mutate(submitData);
    } else {
      createMutation.mutate(submitData);
    }
  };

  const toggleDistrict = (district: string) => {
    setSelectedDistricts((prev) =>
      prev.includes(district)
        ? prev.filter((d) => d !== district)
        : [...prev, district]
    );
  };

  if (companyLoading) {
    return (
      <AppLayout>
        <PageLoader />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/system-admin/companies")}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {isEditing ? "Edit Company" : "Create New Company"}
            </h1>
            <p className="text-slate-600 mt-1">
              {isEditing
                ? "Update company information"
                : "Add a new waste collection company"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-teal-100 rounded-lg">
                <Building2 className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">
                Basic Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="e.g., C&GS Ltd"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="contact@company.rw"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="+250788123456"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="https://company.rw"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Registration Number
                </label>
                <input
                  type="text"
                  value={formData.registration_number}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      registration_number: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Business registration number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tax ID
                </label>
                <input
                  type="text"
                  value={formData.tax_id}
                  onChange={(e) =>
                    setFormData({ ...formData, tax_id: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Tax identification number"
                />
              </div>
            </div>
          </Card>

          {/* Address */}
          <Card>
            <h2 className="text-lg font-semibold text-slate-900 mb-6">
              Company Address
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  District
                </label>
                <select
                  value={formData.address.district}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: {
                        ...formData.address,
                        district: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">Select district</option>
                  {RWANDA_DISTRICTS.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Sector
                </label>
                <input
                  type="text"
                  value={formData.address.sector}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, sector: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Sector name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Cell
                </label>
                <input
                  type="text"
                  value={formData.address.cell}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, cell: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Cell name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Village
                </label>
                <input
                  type="text"
                  value={formData.address.village}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, village: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Village name"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  value={formData.address.street}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, street: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Street address"
                />
              </div>
            </div>
          </Card>

          {/* Service Districts */}
          <Card>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">
              Service Districts
            </h2>
            <p className="text-sm text-slate-600 mb-4">
              Select the districts where this company provides service
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {RWANDA_DISTRICTS.map((district) => (
                <label
                  key={district}
                  className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedDistricts.includes(district)}
                    onChange={() => toggleDistrict(district)}
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-sm text-slate-700">{district}</span>
                </label>
              ))}
            </div>
          </Card>

          {/* Operational Settings */}
          <Card>
            <h2 className="text-lg font-semibold text-slate-900 mb-6">
              Operational Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Max Customers
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.max_customers}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      max_customers: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Max Collectors
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.max_collectors}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      max_collectors: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Collection Price (RWF)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.prepaid_collection_price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      prepaid_collection_price: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as any })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  License Start Date
                </label>
                <input
                  type="date"
                  value={formData.license_start_date}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      license_start_date: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  License End Date
                </label>
                <input
                  type="date"
                  value={formData.license_end_date}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      license_end_date: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_verified}
                  onChange={(e) =>
                    setFormData({ ...formData, is_verified: e.target.checked })
                  }
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <span className="text-sm font-medium text-slate-700">
                  Verified Company
                </span>
              </label>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/system-admin/companies")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={createMutation.isPending || updateMutation.isPending}
            >
              {isEditing ? "Update Company" : "Create Company"}
            </Button>
          </div>
        </form>

        {/* Admin Credentials Modal */}
        {showCredentialsModal && adminCredentials && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Company Created Successfully!
                </h2>
                <p className="text-slate-600">{adminCredentials.message}</p>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 mb-6 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Admin Email
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={adminCredentials.email}
                      className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded text-sm"
                    />
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(adminCredentials.email)
                      }
                      className="px-3 py-2 bg-slate-200 hover:bg-slate-300 rounded text-sm transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Default Password
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={adminCredentials.password}
                      className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded text-sm font-mono"
                    />
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(adminCredentials.password)
                      }
                      className="px-3 py-2 bg-slate-200 hover:bg-slate-300 rounded text-sm transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> Please save these credentials
                  securely. The admin should change their password upon first
                  login.
                </p>
              </div>

              <Button
                variant="primary"
                onClick={() => {
                  setShowCredentialsModal(false);
                  navigate("/system-admin/companies");
                }}
                className="w-full"
              >
                Continue to Companies
              </Button>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default CompanyFormPage;

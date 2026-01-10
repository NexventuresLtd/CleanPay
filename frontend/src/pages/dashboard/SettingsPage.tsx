/**
 * Company Admin Settings Page
 * User profile and company preferences
 */

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AppLayout } from "../../components/layout";
import { Card, Button } from "../../components/common";
import { Save, User, Building2, Bell, Lock, Shield } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export const SettingsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: user?.first_name || "",
    lastName: user?.last_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [companySettings, setCompanySettings] = useState({
    companyName: "",
    district: "",
    address: "",
    phone: "",
    email: "",
    prepaidEnabled: true,
    collectionPrice: "500",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    collectionReminders: true,
    paymentNotifications: true,
    dailyReports: false,
    weeklyReports: true,
  });

  const profileMutation = useMutation({
    mutationFn: async (data: any) => {
      // API call to update profile
      return new Promise((resolve) => setTimeout(() => resolve(data), 1000));
    },
    onSuccess: () => {
      alert("Profile updated successfully!");
    },
  });

  const passwordMutation = useMutation({
    mutationFn: async (data: any) => {
      // API call to change password
      return new Promise((resolve) => setTimeout(() => resolve(data), 1000));
    },
    onSuccess: () => {
      alert("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordChange(false);
    },
  });

  const companyMutation = useMutation({
    mutationFn: async (data: any) => {
      // API call to update company settings
      return new Promise((resolve) => setTimeout(() => resolve(data), 1000));
    },
    onSuccess: () => {
      alert("Company settings updated successfully!");
    },
  });

  const notificationMutation = useMutation({
    mutationFn: async (data: any) => {
      // API call to update notification settings
      return new Promise((resolve) => setTimeout(() => resolve(data), 1000));
    },
    onSuccess: () => {
      alert("Notification settings updated successfully!");
    },
  });

  const handleSaveProfile = () => {
    profileMutation.mutate(profileData);
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (passwordData.newPassword.length < 8) {
      alert("Password must be at least 8 characters!");
      return;
    }
    passwordMutation.mutate(passwordData);
  };

  const handleSaveCompany = () => {
    companyMutation.mutate(companySettings);
  };

  const handleSaveNotifications = () => {
    notificationMutation.mutate(notificationSettings);
  };

  const tabs = [
    { id: "profile", name: "Profile", icon: User },
    { id: "company", name: "Company", icon: Building2 },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "security", name: "Security", icon: Shield },
  ];

  return (
    <AppLayout>
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-600 mt-1">
            Manage your profile and preferences
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-teal-600 text-teal-600"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900">
                  Profile Information
                </h2>
                <Button
                  variant="primary"
                  onClick={handleSaveProfile}
                  loading={profileMutation.isPending}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        firstName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        lastName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-slate-900">
                      Account Information
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                      Role: {user?.role}
                    </p>
                    <p className="text-sm text-slate-600">
                      Company: {(user as any)?.company_name || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Company Tab */}
        {activeTab === "company" && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900">
                  Company Settings
                </h2>
                <Button
                  variant="primary"
                  onClick={handleSaveCompany}
                  loading={companyMutation.isPending}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={companySettings.companyName}
                    onChange={(e) =>
                      setCompanySettings({
                        ...companySettings,
                        companyName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    District
                  </label>
                  <select
                    value={companySettings.district}
                    onChange={(e) =>
                      setCompanySettings({
                        ...companySettings,
                        district: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="">Select district</option>
                    <option value="Gasabo">Gasabo</option>
                    <option value="Kicukiro">Kicukiro</option>
                    <option value="Nyarugenge">Nyarugenge</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={companySettings.address}
                    onChange={(e) =>
                      setCompanySettings({
                        ...companySettings,
                        address: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={companySettings.phone}
                    onChange={(e) =>
                      setCompanySettings({
                        ...companySettings,
                        phone: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={companySettings.email}
                    onChange={(e) =>
                      setCompanySettings({
                        ...companySettings,
                        email: e.target.value,
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
                    type="text"
                    value={companySettings.collectionPrice}
                    onChange={(e) =>
                      setCompanySettings({
                        ...companySettings,
                        collectionPrice: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={companySettings.prepaidEnabled}
                      onChange={(e) =>
                        setCompanySettings({
                          ...companySettings,
                          prepaidEnabled: e.target.checked,
                        })
                      }
                      className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-sm font-medium text-slate-700">
                      Enable Prepaid Collections
                    </span>
                  </label>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900">
                  Notification Preferences
                </h2>
                <Button
                  variant="primary"
                  onClick={handleSaveNotifications}
                  loading={notificationMutation.isPending}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-slate-900 mb-4">
                    Communication Channels
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={notificationSettings.emailNotifications}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            emailNotifications: e.target.checked,
                          })
                        }
                        className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="text-sm text-slate-700">
                        Email Notifications
                      </span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={notificationSettings.smsNotifications}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            smsNotifications: e.target.checked,
                          })
                        }
                        className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="text-sm text-slate-700">
                        SMS Notifications
                      </span>
                    </label>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200">
                  <h3 className="text-sm font-medium text-slate-900 mb-4">
                    Event Notifications
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={notificationSettings.collectionReminders}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            collectionReminders: e.target.checked,
                          })
                        }
                        className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="text-sm text-slate-700">
                        Collection Reminders
                      </span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={notificationSettings.paymentNotifications}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            paymentNotifications: e.target.checked,
                          })
                        }
                        className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="text-sm text-slate-700">
                        Payment Notifications
                      </span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={notificationSettings.dailyReports}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            dailyReports: e.target.checked,
                          })
                        }
                        className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="text-sm text-slate-700">
                        Daily Reports
                      </span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={notificationSettings.weeklyReports}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            weeklyReports: e.target.checked,
                          })
                        }
                        className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="text-sm text-slate-700">
                        Weekly Reports
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="space-y-6">
            <Card>
              <h2 className="text-lg font-semibold text-slate-900 mb-6">
                Security Settings
              </h2>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-medium text-slate-900">
                        Password
                      </h3>
                      <p className="text-sm text-slate-600 mt-1">
                        {showPasswordChange
                          ? "Enter your current and new password"
                          : "Last changed 30 days ago"}
                      </p>
                    </div>
                    {!showPasswordChange && (
                      <Button
                        variant="outline"
                        onClick={() => setShowPasswordChange(true)}
                      >
                        Change Password
                      </Button>
                    )}
                  </div>

                  {showPasswordChange && (
                    <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              currentPassword: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              newPassword: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              confirmPassword: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="primary"
                          onClick={handleChangePassword}
                          loading={passwordMutation.isPending}
                        >
                          <Lock className="w-4 h-4 mr-2" />
                          Update Password
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowPasswordChange(false);
                            setPasswordData({
                              currentPassword: "",
                              newPassword: "",
                              confirmPassword: "",
                            });
                          }}
                        >
                          Cancel
                        </Button>
                      </div>

                      <p className="text-xs text-slate-600">
                        Password must be at least 8 characters long
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-slate-200">
                  <h3 className="text-sm font-medium text-slate-900 mb-4">
                    Login Activity
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2">
                      <div>
                        <p className="text-sm text-slate-900">
                          Current Session
                        </p>
                        <p className="text-xs text-slate-600">
                          Windows • Chrome
                        </p>
                      </div>
                      <span className="text-xs text-emerald-600">
                        Active now
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default SettingsPage;

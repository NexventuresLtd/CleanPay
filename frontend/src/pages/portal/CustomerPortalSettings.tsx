/**
 * Customer Portal Settings Page
 * Customer profile and preferences
 */

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { CustomerPortalLayout } from "../../components/layout/CustomerPortalLayout";
import { Card, Button } from "../../components/common";
import { Save, User, Bell, Lock, Shield, CreditCard } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export const CustomerPortalSettings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: user?.first_name || "",
    lastName: user?.last_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    collectionReminders: true,
    paymentNotifications: true,
    balanceAlerts: true,
    lowBalanceThreshold: 5000,
  });

  const [paymentPreferences, setPaymentPreferences] = useState({
    autoTopUp: false,
    autoTopUpThreshold: 3000,
    autoTopUpAmount: 10000,
    preferredPaymentMethod: "momo",
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

  const notificationMutation = useMutation({
    mutationFn: async (data: any) => {
      // API call to update notification settings
      return new Promise((resolve) => setTimeout(() => resolve(data), 1000));
    },
    onSuccess: () => {
      alert("Notification settings updated successfully!");
    },
  });

  const paymentMutation = useMutation({
    mutationFn: async (data: any) => {
      // API call to update payment preferences
      return new Promise((resolve) => setTimeout(() => resolve(data), 1000));
    },
    onSuccess: () => {
      alert("Payment preferences updated successfully!");
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

  const handleSaveNotifications = () => {
    notificationMutation.mutate(notificationSettings);
  };

  const handleSavePayment = () => {
    paymentMutation.mutate(paymentPreferences);
  };

  const tabs = [
    { id: "profile", name: "Profile", icon: User },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "payment", name: "Payment", icon: CreditCard },
    { id: "security", name: "Security", icon: Shield },
  ];

  return (
    <CustomerPortalLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-600 mt-1">
            Manage your account settings and preferences
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
                  Personal Information
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

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Address
                  </label>
                  <textarea
                    value={profileData.address}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        address: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
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
                    Notification Types
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
                      <div>
                        <span className="text-sm text-slate-700 block">
                          Collection Reminders
                        </span>
                        <span className="text-xs text-slate-500">
                          Get notified before your scheduled collection
                        </span>
                      </div>
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
                      <div>
                        <span className="text-sm text-slate-700 block">
                          Payment Confirmations
                        </span>
                        <span className="text-xs text-slate-500">
                          Receive confirmations for all payments
                        </span>
                      </div>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={notificationSettings.balanceAlerts}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            balanceAlerts: e.target.checked,
                          })
                        }
                        className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                      />
                      <div>
                        <span className="text-sm text-slate-700 block">
                          Low Balance Alerts
                        </span>
                        <span className="text-xs text-slate-500">
                          Alert when prepaid balance is low
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                {notificationSettings.balanceAlerts && (
                  <div className="pt-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Low Balance Threshold (RWF)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      value={notificationSettings.lowBalanceThreshold}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          lowBalanceThreshold: parseInt(e.target.value),
                        })
                      }
                      className="w-full max-w-xs px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      You'll be notified when your balance falls below this
                      amount
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Payment Tab */}
        {activeTab === "payment" && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900">
                  Payment Preferences
                </h2>
                <Button
                  variant="primary"
                  onClick={handleSavePayment}
                  loading={paymentMutation.isPending}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Preferred Payment Method
                  </label>
                  <select
                    value={paymentPreferences.preferredPaymentMethod}
                    onChange={(e) =>
                      setPaymentPreferences({
                        ...paymentPreferences,
                        preferredPaymentMethod: e.target.value,
                      })
                    }
                    className="w-full max-w-xs px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="momo">MTN Mobile Money</option>
                    <option value="airtel">Airtel Money</option>
                    <option value="bank">Bank Transfer</option>
                  </select>
                </div>

                <div className="pt-6 border-t border-slate-200">
                  <label className="flex items-center gap-2 mb-4">
                    <input
                      type="checkbox"
                      checked={paymentPreferences.autoTopUp}
                      onChange={(e) =>
                        setPaymentPreferences({
                          ...paymentPreferences,
                          autoTopUp: e.target.checked,
                        })
                      }
                      className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-slate-700 block">
                        Enable Auto Top-Up
                      </span>
                      <span className="text-xs text-slate-500">
                        Automatically add funds when balance is low
                      </span>
                    </div>
                  </label>

                  {paymentPreferences.autoTopUp && (
                    <div className="ml-6 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Auto Top-Up Threshold (RWF)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="1000"
                          value={paymentPreferences.autoTopUpThreshold}
                          onChange={(e) =>
                            setPaymentPreferences({
                              ...paymentPreferences,
                              autoTopUpThreshold: parseInt(e.target.value),
                            })
                          }
                          className="w-full max-w-xs px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                        <p className="text-xs text-slate-500 mt-1">
                          Top-up when balance falls below this amount
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Auto Top-Up Amount (RWF)
                        </label>
                        <input
                          type="number"
                          min="1000"
                          step="1000"
                          value={paymentPreferences.autoTopUpAmount}
                          onChange={(e) =>
                            setPaymentPreferences({
                              ...paymentPreferences,
                              autoTopUpAmount: parseInt(e.target.value),
                            })
                          }
                          className="w-full max-w-xs px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                        <p className="text-xs text-slate-500 mt-1">
                          Amount to add when auto top-up is triggered
                        </p>
                      </div>

                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                          Auto top-up will charge your{" "}
                          {paymentPreferences.preferredPaymentMethod === "momo"
                            ? "MTN Mobile Money"
                            : paymentPreferences.preferredPaymentMethod ===
                              "airtel"
                            ? "Airtel Money"
                            : "bank account"}{" "}
                          automatically when your balance reaches{" "}
                          {paymentPreferences.autoTopUpThreshold.toLocaleString()}{" "}
                          RWF
                        </p>
                      </div>
                    </div>
                  )}
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
                          : "Keep your account secure"}
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
    </CustomerPortalLayout>
  );
};

export default CustomerPortalSettings;

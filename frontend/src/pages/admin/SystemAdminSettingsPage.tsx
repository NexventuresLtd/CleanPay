/**
 * System Admin Settings Page
 * System-wide configuration and preferences
 */

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AppLayout } from "../../components/layout";
import { Card, Button } from "../../components/common";
import { Save, Bell, Shield, Globe, Database } from "lucide-react";

export const SystemAdminSettingsPage = () => {
  const [activeTab, setActiveTab] = useState("general");

  const [settings, setSettings] = useState({
    // General Settings
    siteName: "IsukuPay",
    siteUrl: "https://isukupay.rw",
    supportEmail: "support@isukupay.rw",
    timezone: "Africa/Kigali",
    dateFormat: "YYYY-MM-DD",
    currency: "RWF",

    // Security Settings
    sessionTimeout: 30,
    passwordMinLength: 8,
    requirePasswordChange: 90,
    enableTwoFactor: false,
    maxLoginAttempts: 5,

    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    companySignupAlert: true,
    licenseExpiryAlert: true,
    alertDaysBefore: 30,

    // System Settings
    maintenanceMode: false,
    allowNewCompanies: true,
    autoVerifyCompanies: false,
    maxCompaniesLimit: 100,
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      // API call to save settings
      return new Promise((resolve) => setTimeout(() => resolve(data), 1000));
    },
    onSuccess: () => {
      alert("Settings saved successfully!");
    },
  });

  const handleSave = () => {
    saveMutation.mutate(settings);
  };

  const tabs = [
    { id: "general", name: "General", icon: Globe },
    { id: "security", name: "Security", icon: Shield },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "system", name: "System", icon: Database },
  ];

  return (
    <AppLayout>
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              System Settings
            </h1>
            <p className="text-slate-600 mt-1">
              Configure system-wide settings and preferences
            </p>
          </div>
          <Button
            variant="primary"
            onClick={handleSave}
            loading={saveMutation.isPending}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
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

        {/* General Settings */}
        {activeTab === "general" && (
          <div className="space-y-6">
            <Card>
              <h2 className="text-lg font-semibold text-slate-900 mb-6">
                General Configuration
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Site Name
                  </label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) =>
                      setSettings({ ...settings, siteName: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Site URL
                  </label>
                  <input
                    type="url"
                    value={settings.siteUrl}
                    onChange={(e) =>
                      setSettings({ ...settings, siteUrl: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Support Email
                  </label>
                  <input
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) =>
                      setSettings({ ...settings, supportEmail: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Timezone
                  </label>
                  <select
                    value={settings.timezone}
                    onChange={(e) =>
                      setSettings({ ...settings, timezone: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="Africa/Kigali">Africa/Kigali (CAT)</option>
                    <option value="UTC">UTC</option>
                    <option value="Africa/Nairobi">Africa/Nairobi (EAT)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Date Format
                  </label>
                  <select
                    value={settings.dateFormat}
                    onChange={(e) =>
                      setSettings({ ...settings, dateFormat: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Currency
                  </label>
                  <input
                    type="text"
                    value={settings.currency}
                    readOnly
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50"
                  />
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === "security" && (
          <div className="space-y-6">
            <Card>
              <h2 className="text-lg font-semibold text-slate-900 mb-6">
                Security Configuration
              </h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Session Timeout (minutes)
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="120"
                      value={settings.sessionTimeout}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          sessionTimeout: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Password Min Length
                    </label>
                    <input
                      type="number"
                      min="6"
                      max="20"
                      value={settings.passwordMinLength}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          passwordMinLength: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Force Password Change (days)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={settings.requirePasswordChange}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          requirePasswordChange: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    <p className="text-xs text-slate-500 mt-1">0 = disabled</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Max Login Attempts
                    </label>
                    <input
                      type="number"
                      min="3"
                      max="10"
                      value={settings.maxLoginAttempts}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          maxLoginAttempts: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.enableTwoFactor}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          enableTwoFactor: e.target.checked,
                        })
                      }
                      className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-sm font-medium text-slate-700">
                      Enable Two-Factor Authentication
                    </span>
                  </label>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === "notifications" && (
          <div className="space-y-6">
            <Card>
              <h2 className="text-lg font-semibold text-slate-900 mb-6">
                Notification Preferences
              </h2>
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          emailNotifications: e.target.checked,
                        })
                      }
                      className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-sm font-medium text-slate-700">
                      Enable Email Notifications
                    </span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.smsNotifications}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          smsNotifications: e.target.checked,
                        })
                      }
                      className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-sm font-medium text-slate-700">
                      Enable SMS Notifications
                    </span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.companySignupAlert}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          companySignupAlert: e.target.checked,
                        })
                      }
                      className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-sm font-medium text-slate-700">
                      Alert on New Company Signup
                    </span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.licenseExpiryAlert}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          licenseExpiryAlert: e.target.checked,
                        })
                      }
                      className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-sm font-medium text-slate-700">
                      Alert on License Expiry
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    License Expiry Alert (days before)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="90"
                    value={settings.alertDaysBefore}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        alertDaysBefore: parseInt(e.target.value),
                      })
                    }
                    className="w-full max-w-xs px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* System Settings */}
        {activeTab === "system" && (
          <div className="space-y-6">
            <Card>
              <h2 className="text-lg font-semibold text-slate-900 mb-6">
                System Configuration
              </h2>
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.maintenanceMode}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          maintenanceMode: e.target.checked,
                        })
                      }
                      className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-sm font-medium text-slate-700">
                      Maintenance Mode
                    </span>
                  </label>
                  {settings.maintenanceMode && (
                    <div className="ml-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        System is in maintenance mode. Only system admins can
                        access.
                      </p>
                    </div>
                  )}

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.allowNewCompanies}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          allowNewCompanies: e.target.checked,
                        })
                      }
                      className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-sm font-medium text-slate-700">
                      Allow New Company Registrations
                    </span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.autoVerifyCompanies}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          autoVerifyCompanies: e.target.checked,
                        })
                      }
                      className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-sm font-medium text-slate-700">
                      Auto-Verify New Companies
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Maximum Companies Limit
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={settings.maxCompaniesLimit}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        maxCompaniesLimit: parseInt(e.target.value),
                      })
                    }
                    className="w-full max-w-xs px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>
            </Card>

            <Card>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                System Information
              </h2>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-slate-600">
                    Version
                  </dt>
                  <dd className="text-sm text-slate-900 mt-1">1.0.0</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-600">
                    Database
                  </dt>
                  <dd className="text-sm text-slate-900 mt-1">
                    PostgreSQL 14.5
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-600">
                    Last Backup
                  </dt>
                  <dd className="text-sm text-slate-900 mt-1">
                    2026-01-10 03:00 AM
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-600">
                    Server Status
                  </dt>
                  <dd className="text-sm text-emerald-600 mt-1 flex items-center gap-1">
                    <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
                    Online
                  </dd>
                </div>
              </dl>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default SystemAdminSettingsPage;

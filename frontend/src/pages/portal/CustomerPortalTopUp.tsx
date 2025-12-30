/**
 * Customer Portal Top Up Page
 * Allows customers to purchase additional collection credits
 */

import { useState } from "react";
import { CustomerPortalLayout } from "../../components/layout/CustomerPortalLayout";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { usePortalDashboard, useSubmitTopUp } from "../../hooks/useCustomerPortal";
import { Alert } from "../../components/common/Alert";

const topUpPackages = [
  {
    id: "package-4",
    collections: 4,
    price: 2000,
    popular: false,
    description: "Perfect for small households",
  },
  {
    id: "package-8",
    collections: 8,
    price: 3500,
    popular: true,
    savings: 500,
    description: "Most popular choice",
  },
  {
    id: "package-12",
    collections: 12,
    price: 5000,
    popular: false,
    savings: 1000,
    description: "Best value for regular use",
  },
  {
    id: "package-24",
    collections: 24,
    price: 9000,
    popular: false,
    savings: 3000,
    description: "Maximum savings",
  },
];

export const CustomerPortalTopUp = () => {
  const { data: dashboard } = usePortalDashboard();
  const submitTopUp = useSubmitTopUp();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"momo" | "airtel" | "card">("momo");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleTopUp = async () => {
    const pkg = topUpPackages.find(p => p.id === selectedPackage);
    const collections = pkg ? pkg.collections : parseInt(customAmount);

    if (!collections || collections <= 0) {
      setShowError(true);
      return;
    }

    try {
      await submitTopUp.mutateAsync({
        collections,
        payment_method: paymentMethod,
      });
      setShowSuccess(true);
      setSelectedPackage(null);
      setCustomAmount("");
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    }
  };

  return (
    <CustomerPortalLayout>
      <div className="p-6 space-y-6">
        {/* Success/Error Alerts */}
        {showSuccess && (
          <Alert
            type="success"
            message="Top-up request submitted successfully! Your payment is being processed."
          />
        )}
        {showError && (
          <Alert
            type="error"
            message="Failed to submit top-up request. Please try again."
          />
        )}

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Top Up Collections
          </h1>
          <p className="text-text-secondary mt-1">
            Add more collections to your account
          </p>
        </div>

        {/* Current Balance */}
        <Card className="bg-linear-to-br from-primary to-primary-dark text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Current Balance</p>
              <p className="text-4xl font-bold mt-2">
                {dashboard?.summary.remaining_collections || 0}
              </p>
              <p className="text-sm opacity-80 mt-1">
                collections remaining
              </p>
            </div>
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
              <svg
                className="w-10 h-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </Card>

        {/* Package Selection */}
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            Choose a Package
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {topUpPackages.map((pkg) => (
              <Card
                key={pkg.id}
                className={`relative cursor-pointer transition-all ${
                  selectedPackage === pkg.id
                    ? "ring-2 ring-primary shadow-lg"
                    : "hover:shadow-md"
                } ${pkg.popular ? "border-primary" : ""}`}
                onClick={() => setSelectedPackage(pkg.id)}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                      POPULAR
                    </span>
                  </div>
                )}
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {pkg.collections}
                  </div>
                  <div className="text-sm text-text-secondary mb-3">
                    collections
                  </div>
                  <div className="text-2xl font-bold text-text-primary mb-1">
                    RWF {pkg.price.toLocaleString()}
                  </div>
                  {pkg.savings && (
                    <div className="text-xs text-success font-medium mb-3">
                      Save RWF {pkg.savings.toLocaleString()}
                    </div>
                  )}
                  <p className="text-xs text-text-secondary">
                    {pkg.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Custom Amount */}
        <Card>
          <h3 className="font-semibold text-text-primary mb-3">
            Or enter a custom amount
          </h3>
          <div className="flex gap-3">
            <input
              type="number"
              min="1"
              placeholder="Number of collections"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setSelectedPackage(null);
              }}
              className="flex-1 px-4 py-2 bg-bg-subtle border border-border-base rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="px-4 py-2 bg-bg-subtle border border-border-base rounded-lg text-text-secondary">
              × RWF 500 each
            </div>
          </div>
          {customAmount && (
            <div className="mt-3 text-right">
              <span className="text-sm text-text-secondary">Total: </span>
              <span className="text-lg font-bold text-primary">
                RWF {(parseInt(customAmount) * 500).toLocaleString()}
              </span>
            </div>
          )}
        </Card>

        {/* Payment Method */}
        <Card>
          <h3 className="font-semibold text-text-primary mb-3">
            Payment Method
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={() => setPaymentMethod("momo")}
              className={`p-4 border-2 rounded-lg transition-all ${
                paymentMethod === "momo"
                  ? "border-primary bg-primary-light"
                  : "border-border-base hover:border-primary"
              }`}
            >
              <div className="text-center">
                <div className="font-semibold text-text-primary">MTN MoMo</div>
                <div className="text-xs text-text-secondary mt-1">
                  Pay with Mobile Money
                </div>
              </div>
            </button>
            <button
              onClick={() => setPaymentMethod("airtel")}
              className={`p-4 border-2 rounded-lg transition-all ${
                paymentMethod === "airtel"
                  ? "border-primary bg-primary-light"
                  : "border-border-base hover:border-primary"
              }`}
            >
              <div className="text-center">
                <div className="font-semibold text-text-primary">
                  Airtel Money
                </div>
                <div className="text-xs text-text-secondary mt-1">
                  Pay with Airtel
                </div>
              </div>
            </button>
            <button
              onClick={() => setPaymentMethod("card")}
              className={`p-4 border-2 rounded-lg transition-all ${
                paymentMethod === "card"
                  ? "border-primary bg-primary-light"
                  : "border-border-base hover:border-primary"
              }`}
            >
              <div className="text-center">
                <div className="font-semibold text-text-primary">
                  Credit/Debit Card
                </div>
                <div className="text-xs text-text-secondary mt-1">
                  Pay with card
                </div>
              </div>
            </button>
          </div>
        </Card>

        {/* Proceed Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleTopUp}
            disabled={!selectedPackage && !customAmount}
            size="lg"
          >
            Proceed to Payment
          </Button>
        </div>
      </div>
    </CustomerPortalLayout>
  );
};

export default CustomerPortalTopUp;

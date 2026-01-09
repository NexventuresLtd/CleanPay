/**
 * Customer Card Component
 * Displays customer identification card with key information
 */

import {
  User,
  MapPin,
  Building2,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from "lucide-react";

interface CustomerCardProps {
  customerName: string;
  cardNumber: string;
  location: string;
  serviceProvider: string;
  accountStatus: "active" | "pending" | "suspended";
  prepaidBalance?: number;
}

export const CustomerCard = ({
  customerName,
  cardNumber,
  location,
  serviceProvider,
  accountStatus,
  prepaidBalance = 0,
}: CustomerCardProps) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active":
        return {
          icon: CheckCircle2,
          text: "Active",
          bgColor: "bg-emerald-50",
          textColor: "text-emerald-700",
          borderColor: "border-emerald-200",
          iconColor: "text-emerald-600",
        };
      case "pending":
        return {
          icon: AlertCircle,
          text: "Pending Payment",
          bgColor: "bg-amber-50",
          textColor: "text-amber-700",
          borderColor: "border-amber-200",
          iconColor: "text-amber-600",
        };
      case "suspended":
        return {
          icon: XCircle,
          text: "Suspended",
          bgColor: "bg-red-50",
          textColor: "text-red-700",
          borderColor: "border-red-200",
          iconColor: "text-red-600",
        };
      default:
        return {
          icon: AlertCircle,
          text: "Unknown",
          bgColor: "bg-slate-50",
          textColor: "text-slate-700",
          borderColor: "border-slate-200",
          iconColor: "text-slate-600",
        };
    }
  };

  const statusConfig = getStatusConfig(accountStatus);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="bg-gradient-to-br from-teal-600 to-emerald-700 rounded-2xl p-6 shadow-xl text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24"></div>
      </div>

      {/* Card Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="text-white/80 text-sm font-medium mb-1">
              IsukuPay Customer
            </div>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <h3 className="text-xl font-bold">{customerName}</h3>
            </div>
          </div>
          <div
            className={`px-3 py-1 rounded-full border ${statusConfig.bgColor} ${statusConfig.borderColor} flex items-center gap-1.5`}
          >
            <StatusIcon className={`w-4 h-4 ${statusConfig.iconColor}`} />
            <span className={`text-xs font-semibold ${statusConfig.textColor}`}>
              {statusConfig.text}
            </span>
          </div>
        </div>

        {/* Card Number */}
        <div className="mb-6">
          <div className="text-white/70 text-xs font-medium mb-1 flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5" />
            Card Number / IsukuPay ID
          </div>
          <div className="text-3xl font-mono font-bold tracking-wider">
            {cardNumber}
          </div>
        </div>

        {/* Location & Service Provider */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-white/70 text-xs font-medium mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              Location
            </div>
            <div className="text-sm font-medium">{location}</div>
          </div>
          <div>
            <div className="text-white/70 text-xs font-medium mb-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              Service Provider
            </div>
            <div className="text-sm font-medium">{serviceProvider}</div>
          </div>
        </div>

        {/* Prepaid Balance */}
        {prepaidBalance !== undefined && (
          <div className="mt-6 pt-4 border-t border-white/20">
            <div className="flex items-center justify-between">
              <div className="text-white/70 text-sm font-medium">
                Remaining Collections
              </div>
              <div className="text-2xl font-bold">{prepaidBalance}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerCard;

import React, { useState } from "react";

const plans = [
  {
    id: 1,
    title: "1 Month",
    months: 1,
    price: 299,
    badge: null,
    color: "blue",
  },
  {
    id: 2,
    title: "3 Months",
    months: 3,
    price: 799,
    badge: { text: "Free for new doctors", type: "free" },
    color: "green",
  },
  {
    id: 3,
    title: "6 Months",
    months: 6,
    price: 1499,
    badge: null,
    color: "purple",
  },
  {
    id: 4,
    title: "12 Months",
    months: 12,
    price: 2499,
    badge: { text: "Best value", type: "best" },
    color: "orange",
  },
];

const featureList = [
  "Unlimited appointments",
  "Doctor profile",
  "Priority support",
  "Clinic management",
];

const planAccent = {
  blue:   { ring: "ring-blue-500",   dot: "bg-blue-500",   btn: "bg-blue-600 hover:bg-blue-700",     icon: "text-blue-500"   },
  green:  { ring: "ring-green-500",  dot: "bg-green-500",  btn: "bg-green-600 hover:bg-green-700",   icon: "text-green-500"  },
  purple: { ring: "ring-purple-500", dot: "bg-purple-500", btn: "bg-purple-600 hover:bg-purple-700", icon: "text-purple-500" },
  orange: { ring: "ring-orange-500", dot: "bg-orange-500", btn: "bg-orange-500 hover:bg-orange-600", icon: "text-orange-500" },
};

const CheckIcon = ({ colorClass }) => (
  <svg
    className={`w-3.5 h-3.5 flex-shrink-0 ${colorClass}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export default function RazorpayPaymentPage() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const getFinalPrice = () => {
    if (!selectedPlan) return 0;
    if (couponApplied && selectedPlan.months === 3) return 0;
    return selectedPlan.price;
  };

  const discount = selectedPlan ? selectedPlan.price - getFinalPrice() : 0;

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setMessage({ text: "", type: "" });
    setCouponApplied(false);
    setCoupon("");
  };

  const applyCoupon = () => {
    if (!selectedPlan) {
      setMessage({ text: "Please select a plan first.", type: "error" });
      return;
    }
    if (coupon.trim().toUpperCase() === "WELCOME3" && selectedPlan.months === 3) {
      setCouponApplied(true);
      setMessage({ text: "3-month subscription activated for free!", type: "success" });
    } else {
      setCouponApplied(false);
      setMessage({ text: "Invalid coupon code.", type: "error" });
    }
  };

  const handleContinue = () => {
    if (!selectedPlan) return;
    alert(`Plan: ${selectedPlan.title}\nTotal: ₹${getFinalPrice().toLocaleString()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-4 py-14">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4 tracking-wide uppercase">
            Subscription Plans
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
            Choose your plan
          </h1>
          <p className="text-gray-500 text-base max-w-md mx-auto">
            Everything you need to manage your clinic — pick a plan that works for you.
          </p>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {plans.map((plan) => {
            const isSelected = selectedPlan?.id === plan.id;
            const accent = planAccent[plan.color];
            return (
              <div
                key={plan.id}
                onClick={() => handleSelectPlan(plan)}
                className={`relative bg-white rounded-2xl p-5 cursor-pointer transition-all duration-200
                  ${isSelected
                    ? `ring-2 ${accent.ring} shadow-xl scale-[1.03]`
                    : "ring-1 ring-gray-200 hover:ring-gray-300 hover:shadow-md"
                  }`}
              >
                {/* Selected indicator dot */}
                {isSelected && (
                  <span className={`absolute top-3.5 right-3.5 w-2.5 h-2.5 rounded-full ${accent.dot}`} />
                )}

                {/* Badge */}
                <div className="h-7 mb-3">
                  {plan.badge && (
                    <span
                      className={`inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full
                        ${plan.badge.type === "free"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                        }`}
                    >
                      {plan.badge.text}
                    </span>
                  )}
                </div>

                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                  {plan.title}
                </p>
                <p className="text-3xl font-bold text-gray-900 mb-0.5">
                  ₹{plan.price.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 mb-5">
                  for {plan.months} {plan.months === 1 ? "month" : "months"}
                </p>

                <ul className="space-y-2 mb-6">
                  {featureList.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-gray-600">
                      <CheckIcon colorClass={accent.icon} />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-all duration-150
                    ${isSelected
                      ? `${accent.btn} text-white shadow-sm`
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  {isSelected ? "✓ Selected" : "Choose plan"}
                </button>
              </div>
            );
          })}
        </div>

        {/* Bottom — Coupon + Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Coupon Card */}
          <div className="bg-white rounded-2xl ring-1 ring-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-violet-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                  <line x1="7" y1="7" x2="7.01" y2="7" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-800">Apply coupon</p>
            </div>

            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                className="flex-1 text-sm px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
              />
              <button
                onClick={applyCoupon}
                className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 active:scale-95 text-white text-sm font-semibold rounded-xl transition-all duration-150"
              >
                Apply
              </button>
            </div>

            <p className="text-xs text-gray-400">
              Try{" "}
              <span className="font-bold text-violet-600 bg-violet-50 px-1.5 py-0.5 rounded-md">
                WELCOME3
              </span>{" "}
              for a free 3-month plan.
            </p>

            {message.text && (
              <div
                className={`mt-3 flex items-center gap-2 text-xs font-medium px-3 py-2.5 rounded-xl
                  ${message.type === "success"
                    ? "bg-green-50 text-green-700 ring-1 ring-green-200"
                    : "bg-red-50 text-red-600 ring-1 ring-red-200"
                  }`}
              >
                <span className="text-base">{message.type === "success" ? "✓" : "✕"}</span>
                {message.text}
              </div>
            )}
          </div>

          {/* Summary Card */}
          <div className="bg-white rounded-2xl ring-1 ring-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 6 2 18 2 18 9" />
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                  <rect x="6" y="14" width="12" height="8" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-800">Payment summary</p>
            </div>

            {!selectedPlan ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <path d="M3 9h18M9 21V9" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-400">No plan selected</p>
                <p className="text-xs text-gray-300 mt-1">Choose a plan above to continue</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">Plan</span>
                    <span className="text-xs font-semibold text-gray-800 bg-gray-100 px-2.5 py-1 rounded-full">
                      {selectedPlan.title}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">Original price</span>
                    <span className="text-xs font-medium text-gray-700">
                      ₹{selectedPlan.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">Discount</span>
                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                      − ₹{discount.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="border-t border-dashed border-gray-200 pt-4 flex justify-between items-center mb-5">
                  <span className="text-sm font-semibold text-gray-700">Total payable</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ₹{getFinalPrice().toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={handleContinue}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] text-white text-sm font-semibold rounded-xl transition-all duration-150 shadow-md shadow-blue-100 flex items-center justify-center gap-2"
                >
                  Continue to payment
                  <ArrowRightIcon />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-8 flex items-center justify-center gap-1.5">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Secure payments powered by Razorpay · Cancel anytime
        </p>

      </div>
    </div>
  );
}
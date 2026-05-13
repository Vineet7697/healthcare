import React, { useState } from "react";

const BILLING_HISTORY = [
  { id: "INV-2024-089", date: "1 May 2025", amount: "₹1,999", status: "Paid", plan: "Premium" },
  { id: "INV-2024-061", date: "1 Apr 2025", amount: "₹1,999", status: "Paid", plan: "Premium" },
  { id: "INV-2024-032", date: "1 Mar 2025", amount: "₹1,999", status: "Paid", plan: "Premium" },
  { id: "INV-2024-011", date: "1 Feb 2025", amount: "₹999",   status: "Paid", plan: "Basic"   },
];

/* ─── 3-color palette ───────────────────────────────────────────
   #0F172A  (slate-900)  → primary text / dark backgrounds
   #0D9488  (teal-600)   → brand accent
   #F8FAFC  (slate-50)   → page background / light surfaces
──────────────────────────────────────────────────────────────── */

const MySubscription = () => {
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const [page, setPage] = useState("subscription");

  /* ── SUCCESS PAGE ── */
  if (page === "success") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-5 font-sans">
        <div className="w-full max-w-2xl bg-white rounded-3xl p-12 text-center shadow-xl">

          {/* icon */}
          <div className="w-24 h-24 rounded-full bg-teal-100 mx-auto mb-8 flex items-center justify-center text-5xl text-teal-600">
            ✓
          </div>

          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
            Subscription Activated!
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed mb-10">
            Welcome to MediCare Pro Premium. Your healthcare platform is ready.
          </p>

          {/* info grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {[
              { label: "PLAN",            value: "Premium"        },
              { label: "STATUS",          value: "● Active",  chip: true },
              { label: "SUBSCRIPTION ID", value: "SUB-8U6HNB5D"  },
              { label: "NEXT BILLING",    value: "13 Jun 2026"    },
            ].map(({ label, value, chip }) => (
              <div key={label} className="border border-slate-200 rounded-2xl p-5 text-left">
                <p className="text-xs font-bold text-slate-400 mb-2 tracking-widest">{label}</p>
                {chip
                  ? <span className="bg-teal-100 text-teal-700 px-4 py-1.5 rounded-full text-sm font-bold">{value}</span>
                  : <p className="text-xl font-extrabold text-slate-900">{value}</p>
                }
              </div>
            ))}
          </div>

          {/* action buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => setPage("subscription")}
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl py-4 text-lg font-bold transition-colors"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => setPage("subscription")}
              className="flex-1 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl py-4 text-lg font-bold transition-colors"
            >
              Manage Subscription
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── FAILED PAGE ── */
  if (page === "failed") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-5 font-sans">
        <div className="w-full max-w-md bg-white rounded-3xl p-10 text-center shadow-xl">

          <div className="w-20 h-20 rounded-full bg-red-100 mx-auto mb-7 flex items-center justify-center text-4xl text-red-500">
            ✕
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 mb-3">Payment Failed</h1>
          <p className="text-base text-slate-500 leading-relaxed mb-7">
            We couldn't process your payment. Your card was declined or there was a network issue.
          </p>

          <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-left mb-7">
            <p className="text-sm font-bold text-red-800 mb-2">Error Details</p>
            <p className="text-sm text-red-700 leading-relaxed">
              Transaction declined by issuing bank. Error code: PAYMENT_DECLINED_003
            </p>
          </div>

          <div className="flex gap-3 mb-5">
            <button
              onClick={() => setPage("subscription")}
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white rounded-xl py-4 text-base font-bold transition-colors"
            >
              Retry Payment
            </button>
            <button
              onClick={() => setPage("subscription")}
              className="flex-1 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 rounded-xl py-4 text-base font-bold transition-colors"
            >
              Go Back
            </button>
          </div>

          <p className="text-sm text-slate-400">
            Need help?{" "}
            <span className="text-teal-600 font-bold">support@medicare.pro</span>
          </p>
        </div>
      </div>
    );
  }

  /* ── MAIN PAGE ── */
  return (
    <div className="max-w-5xl mx-auto px-5 py-10 pb-20 font-sans bg-slate-50 min-h-screen">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-2">My Subscription</h1>
        <p className="text-sm text-slate-500">Manage your plan, billing, and payment details.</p>
      </div>

      {/* Plan Banner */}
      <div className="bg-slate-900 rounded-2xl p-7 text-white relative overflow-hidden mb-6">
        {/* decorative circles */}
        <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full bg-teal-600 opacity-20 pointer-events-none" />
        <div className="absolute -bottom-12 -left-8 w-44 h-44 rounded-full bg-teal-400 opacity-10 pointer-events-none" />

        <div className="relative flex justify-between items-start">
          <div>
            <p className="text-xs font-bold tracking-widest text-teal-400 mb-2">CURRENT PLAN</p>
            <h2 className="text-5xl font-extrabold mb-2">Premium ⚕️</h2>
            <p className="text-base text-slate-300">Annual billing · ₹1,999/month</p>
          </div>
          <span className="bg-teal-600 bg-opacity-30 border border-teal-500 text-teal-300 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap">
            ● Active
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl px-6 py-3.5 text-sm font-bold transition-colors">
          ⬆ Upgrade to Enterprise
        </button>
        <button className="bg-white hover:bg-slate-100 text-slate-900 border border-slate-200 rounded-xl px-6 py-3.5 text-sm font-bold transition-colors">
          ✏️ Update Payment
        </button>

        {!cancelConfirm ? (
          <button
            onClick={() => setCancelConfirm(true)}
            className="bg-red-50 hover:bg-red-100 text-red-500 rounded-xl px-6 py-3.5 text-sm font-bold transition-colors"
          >
            Cancel Subscription
          </button>
        ) : (
          <button
            onClick={() => setCancelConfirm(false)}
            className="bg-red-500 hover:bg-red-600 text-white rounded-xl px-6 py-3.5 text-sm font-bold transition-colors"
          >
            Confirm Cancel?
          </button>
        )}

        <button
          onClick={() => setPage("success")}
          className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl px-6 py-3.5 text-sm font-bold transition-colors"
        >
          ✅ Payment Success
        </button>
        <button
          onClick={() => setPage("failed")}
          className="bg-red-500 hover:bg-red-600 text-white rounded-xl px-6 py-3.5 text-sm font-bold transition-colors"
        >
          ❌ Payment Failed
        </button>
      </div>

      {/* Billing Table */}
      <div className="bg-white rounded-2xl p-7 border border-slate-200 overflow-x-auto shadow-sm">
        <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Billing History</h2>

        <table className="w-full border-collapse">
          <thead>
            <tr>
              {["INVOICE ID", "DATE", "PLAN", "AMOUNT", "STATUS"].map((head) => (
                <th
                  key={head}
                  className="text-left px-3 py-4 text-xs font-bold text-slate-400 tracking-widest border-b border-slate-200"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BILLING_HISTORY.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-3 py-4 font-bold text-slate-900 font-mono text-sm border-b border-slate-100">
                  {row.id}
                </td>
                <td className="px-3 py-4 text-sm text-slate-700 border-b border-slate-100">
                  {row.date}
                </td>
                <td className="px-3 py-4 text-sm text-slate-700 border-b border-slate-100">
                  {row.plan}
                </td>
                <td className="px-3 py-4 text-sm font-bold text-slate-900 border-b border-slate-100">
                  {row.amount}
                </td>
                <td className="px-3 py-4 border-b border-slate-100">
                  <span className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-xs font-bold">
                    ● {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MySubscription;
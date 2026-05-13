// import React from "react";
// import { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// // ─── Data ─────────────────────────────────────────────────────────────────────
// const PLANS = [
//   {
//     id: "basic",
//     name: "Basic",
//     icon: "🏥",
//     iconBg: "#f0fdfa",
//     desc: "Perfect for individual practitioners and small clinics.",
//     monthlyPrice: 999,
//     yearlyPrice: 799,
//     recommended: false,
//     features: [
//       { text: "Up to 50 patient records", included: true },
//       { text: "Basic appointment scheduling", included: true },
//       { text: "Email support", included: true },
//       { text: "Basic reports & analytics", included: true },
//       { text: "Telemedicine integration", included: false },
//       { text: "Advanced AI diagnostics", included: false },
//     ],
//   },
//   {
//     id: "premium",
//     name: "Premium",
//     icon: "⚕️",
//     iconBg: "#f0fdfa",
//     desc: "Ideal for growing healthcare teams and multi-specialty clinics.",
//     monthlyPrice: 2499,
//     yearlyPrice: 1999,
//     recommended: true,
//     features: [
//       { text: "Unlimited patient records", included: true },
//       { text: "Advanced scheduling & reminders", included: true },
//       { text: "Priority 24/7 support", included: true },
//       { text: "Advanced analytics dashboard", included: true },
//       { text: "Telemedicine integration", included: true },
//       { text: "Advanced AI diagnostics", included: false },
//     ],
//   },
//   {
//     id: "enterprise",
//     name: "Enterprise",
//     icon: "🏨",
//     iconBg: "#faf5ff",
//     desc: "Full-scale solution for hospitals and large healthcare networks.",
//     monthlyPrice: 5999,
//     yearlyPrice: 4799,
//     recommended: false,
//     features: [
//       { text: "Unlimited everything", included: true },
//       { text: "Custom integrations & API", included: true },
//       { text: "Dedicated account manager", included: true },
//       { text: "White-label option", included: true },
//       { text: "Telemedicine integration", included: true },
//       { text: "Advanced AI diagnostics", included: true },
//     ],
//   },
// ];

// // ─── Styles ───────────────────────────────────────────────────────────────────
// const styles = `
//   @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@300;400;500;600;700;800&family=DM+Sans:wght@0,300;0,400;0,500;0,600&display=swap');

//   :root {
//     --teal: #0d9488;
//     --teal-dark: #0f766e;
//     --teal-muted: #ccfbf1;
//     --teal-border: #99f6e4;
//     --navy: #0f172a;
//     --slate: #1e293b;
//     --muted: #64748b;
//     --soft: #f8fafc;
//     --success: #10b981;
//     --shadow-lg: 0 12px 48px rgba(13,148,136,0.16), 0 2px 8px rgba(0,0,0,0.08);
//   }

//   * { box-sizing: border-box; margin: 0; padding: 0; }

//   body, #root {
//     font-family: 'DM Sans', sans-serif;
//     background: #f0fdfa;
//     min-height: 100vh;
//     color: var(--navy);
//   }

//   h1, h2, h3, h4, h5, h6 {
//     font-family: 'Bricolage Grotesque', sans-serif;
//   }

//   /* Toggle */
//   .toggle-wrap {
//     display: flex;
//     align-items: center;
//     background: white;
//     border: 1.5px solid var(--teal-border);
//     border-radius: 50px;
//     padding: 6px 8px;
//     width: fit-content;
//     margin: 0 auto 40px;
//   }
//   .toggle-label {
//     font-size: 14px;
//     font-weight: 500;
//     padding: 4px 14px;
//     border-radius: 50px;
//     cursor: pointer;
//     transition: all 0.2s;
//     color: var(--muted);
//   }
//   .toggle-label.active { background: var(--teal); color: white; }
//   .toggle-badge {
//     font-size: 10px;
//     background: #fef3c7;
//     color: #92400e;
//     padding: 2px 8px;
//     border-radius: 50px;
//     font-weight: 600;
//     margin-left: 4px;
//   }

//   /* Plans grid */
//   .plans-grid {
//     display: grid;
//     grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
//     gap: 20px;
//     max-width: 1060px;
//     margin: 0 auto;
//     padding: 0 20px 60px;
//   }
//   .plan-card {
//     background: white;
//     border-radius: 20px;
//     border: 2px solid #e2e8f0;
//     padding: 32px 28px;
//     position: relative;
//     transition: all 0.25s;
//   }
//   .plan-card:hover {
//     transform: translateY(-4px);
//     box-shadow: var(--shadow-lg);
//     border-color: var(--teal-border);
//   }
//   .plan-card.recommended {
//     border-color: var(--teal);
//     box-shadow: var(--shadow-lg);
//   }
//   .recommend-badge {
//     position: absolute;
//     top: -13px;
//     left: 50%;
//     transform: translateX(-50%);
//     background: var(--teal);
//     color: white;
//     font-size: 11px;
//     font-weight: 700;
//     padding: 4px 16px;
//     border-radius: 50px;
//     white-space: nowrap;
//     font-family: 'Bricolage Grotesque', sans-serif;
//     letter-spacing: 0.5px;
//   }
//   .plan-icon {
//     width: 44px;
//     height: 44px;
//     border-radius: 12px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     font-size: 20px;
//     margin-bottom: 16px;
//   }
//   .plan-name  { font-size: 18px; font-weight: 700; color: var(--navy); margin-bottom: 4px; }
//   .plan-desc  { font-size: 13px; color: var(--muted); margin-bottom: 20px; line-height: 1.5; }
//   .plan-price-row { display: flex; align-items: flex-end; gap: 4px; margin-bottom: 6px; }
//   .plan-currency { font-size: 18px; font-weight: 600; color: var(--navy); margin-bottom: 4px; }
//   .plan-amount   { font-size: 42px; font-weight: 800; color: var(--navy); line-height: 1; font-family: 'Bricolage Grotesque', sans-serif; }
//   .plan-period   { font-size: 13px; color: var(--muted); margin-bottom: 4px; }
//   .plan-save     { font-size: 12px; color: var(--success); font-weight: 600; margin-bottom: 20px; min-height: 18px; }
//   .plan-divider  { border: none; border-top: 1px solid #f1f5f9; margin: 20px 0; }

//   .feature-list { list-style: none; display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px; }
//   .feature-item { display: flex; align-items: flex-start; gap: 10px; font-size: 13.5px; color: var(--slate); line-height: 1.4; }
//   .feature-check {
//     width: 18px;
//     height: 18px;
//     border-radius: 50%;
//     background: var(--teal-muted);
//     color: var(--teal-dark);
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     font-size: 10px;
//     flex-shrink: 0;
//     margin-top: 1px;
//   }
//   .feature-x { background: #fee2e2; color: #ef4444; }

//   .subscribe-btn {
//     width: 100%;
//     padding: 14px;
//     border-radius: 12px;
//     font-size: 15px;
//     font-weight: 600;
//     cursor: pointer;
//     border: 2px solid;
//     transition: all 0.2s;
//     font-family: 'DM Sans', sans-serif;
//   }
//   .subscribe-btn-outline { background: transparent; border-color: var(--teal); color: var(--teal); }
//   .subscribe-btn-outline:hover { background: var(--teal-muted); }
//   .subscribe-btn-fill { background: var(--teal); border-color: var(--teal); color: white; }
//   .subscribe-btn-fill:hover { background: var(--teal-dark); border-color: var(--teal-dark); }

//   /* Page header */
//   .page-header { text-align: center; padding: 48px 20px 32px; }
//   .page-title  { font-size: 34px; font-weight: 800; color: var(--navy); margin-bottom: 10px; line-height: 1.2; }
//   .page-sub    { font-size: 16px; color: var(--muted); max-width: 460px; margin: 0 auto; line-height: 1.6; }

//   @media (max-width: 600px) {
//     .plans-grid { grid-template-columns: 1fr; }
//     .page-title { font-size: 26px; }
//   }
// `;

// // ─── Component ────────────────────────────────────────────────────────────────
// export default function MySubscription({
//   onSubscribe,
//   billing,
//   setBilling,
// }) {
//   const price = (plan) =>
//     billing === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
//   const save = (plan) =>
//     Math.round(
//       ((plan.monthlyPrice - plan.yearlyPrice) / plan.monthlyPrice) * 100,
//     );
//   const navigate = useNavigate();

  const handleContinue = async (selectedPlan) => {
    try {
      if (!selectedPlan) return;

      const finalAmount =
        billing === "yearly"
          ? selectedPlan.yearlyPrice
          : selectedPlan.monthlyPrice;

      // CREATE ORDER
      const { data } = await axios.post(
        "http://localhost:4000/api/payment/create-order",
        {
          amount: finalAmount,
        },
      );

      // RAZORPAY OPTIONS
      const options = {
        key: "rzp_test_Sn93hLqCWsB4xv",

        amount: data.amount,

        currency: data.currency,

        order_id: data.id,

        name: "YoDoctor",

        description: selectedPlan.name,

        handler: function (response) {
          console.log("PAYMENT SUCCESS", response);

          navigate("/payment-success");
        },

        theme: {
          color: "#0d9488",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function () {
        navigate("/payment-failed");
      });

      razorpay.open();
    } catch (error) {
      console.log(error);
    }
  };

//   return (
//     <>
//       <style>{styles}</style>
//       <div>
//         {/* Header */}
//         <div className="page-header">
//           <div
//             style={{
//               display: "inline-flex",
//               alignItems: "center",
//               gap: 6,
//               background: "#ccfbf1",
//               color: "#0f766e",
//               padding: "4px 14px",
//               borderRadius: 50,
//               fontSize: 12,
//               fontWeight: 700,
//               marginBottom: 16,
//               textTransform: "uppercase",
//               letterSpacing: 0.5,
//             }}
//           >
//             🩺 Healthcare Plans
//           </div>
//           <h1 className="page-title">Choose Your Plan</h1>
//           <p className="page-sub">
//             Flexible pricing for healthcare providers of every size. No hidden
//             fees.
//           </p>
//         </div>

//         {/* Billing Toggle */}
//         <div className="toggle-wrap">
//           <div
//             className={`toggle-label ${billing === "monthly" ? "active" : ""}`}
//             onClick={() => setBilling("monthly")}
//           >
//             Monthly
//           </div>
//           <div
//             className={`toggle-label ${billing === "yearly" ? "active" : ""}`}
//             onClick={() => setBilling("yearly")}
//           >
//             Yearly <span className="toggle-badge">Save 20%</span>
//           </div>
//         </div>

//         {/* Plans */}
//         <div className="plans-grid">
//           {PLANS.map((plan) => (
//             <div
//               key={plan.id}
//               className={`plan-card ${plan.recommended ? "recommended" : ""}`}
//             >
//               {plan.recommended && (
//                 <div className="recommend-badge">⭐ Most Popular</div>
//               )}

//               <div className="plan-icon" style={{ background: plan.iconBg }}>
//                 {plan.icon}
//               </div>
//               <div className="plan-name">{plan.name}</div>
//               <div className="plan-desc">{plan.desc}</div>

//               <div className="plan-price-row">
//                 <span className="plan-currency">₹</span>
//                 <span className="plan-amount">
//                   {price(plan).toLocaleString("en-IN")}
//                 </span>
//               </div>
//               <div className="plan-period">
//                 per user /{" "}
//                 {billing === "yearly" ? "month, billed annually" : "month"}
//               </div>
//               <div className="plan-save">
//                 {billing === "yearly" ? `Save ${save(plan)}% vs monthly` : " "}
//               </div>

//               <hr className="plan-divider" />

//               <ul className="feature-list">
//                 {plan.features.map((f, i) => (
//                   <li key={i} className="feature-item">
//                     <span
//                       className={`feature-check ${!f.included ? "feature-x" : ""}`}
//                     >
//                       {f.included ? "✓" : "✕"}
//                     </span>
//                     <span
//                       style={{ color: f.included ? "var(--slate)" : "#94a3b8" }}
//                     >
//                       {f.text}
//                     </span>
//                   </li>
//                 ))}
//               </ul>

//               <button
//                 className={`subscribe-btn ${
//                   plan.recommended
//                     ? "subscribe-btn-fill"
//                     : "subscribe-btn-outline"
//                 }`}
//                 onClick={() => handleContinue(plan)}
//               >
//                 {plan.id === "enterprise" ? "Contact Sales" : "Choose Plan"}
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// }




import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  Check,
  X,
  CreditCard,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

const PaymentPage = () => {
  const [billing, setBilling] = useState("monthly");
  const [selectedPlan, setSelectedPlan] = useState(null);

  const navigate = useNavigate();

  // ================= RAZORPAY =================

  const handleContinue = async () => {
    try {
      if (!selectedPlan) {
        alert("Please select a plan");
        return;
      }

      const finalAmount = selectedPlan.price;

      // CREATE ORDER
      const { data } = await axios.post(
        "http://localhost:4000/api/payment/create-order",
        {
          amount: finalAmount,
        }
      );

      // RAZORPAY
      const options = {
        key: "rzp_test_Sn93hLqCWsB4xv",

        amount: data.amount,

        currency: data.currency,

        order_id: data.id,

        name: "YoDoctor",

        description: `${selectedPlan.name} Subscription`,

        handler: function (response) {
          console.log("PAYMENT SUCCESS", response);

          navigate("/payment-success");
        },

        prefill: {
          name: "YoDoctor User",
          email: "test@gmail.com",
          contact: "9999999999",
        },

        theme: {
          color: "#14b8a6",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
        console.log(response);

        navigate("/payment-failed");
      });

      razorpay.open();
    } catch (error) {
      console.log(error);
      alert("Payment Failed");
    }
  };

  // ================= MONTHLY =================

  const monthlyPlans = [
    {
      id: 1,
      name: "Basic",
      duration: "1 MONTH",
      price: 999,
      desc: "Perfect for individual practitioners and small clinics.",
      badge: "",
      color: "text-blue-500",
      features: [
        { text: "Up to 50 patient records", included: true },
        { text: "Basic appointment scheduling", included: true },
        { text: "Email support", included: true },
        { text: "Basic reports & analytics", included: true },
        { text: "Telemedicine integration", included: false },
        { text: "Advanced AI diagnostics", included: false },
      ],
    },

    {
      id: 2,
      name: "Premium",
      duration: "3 MONTHS",
      price: 2499,
      desc: "Ideal for growing healthcare teams and multi-specialty clinics.",
      badge: "⭐ Most Popular",
      color: "text-green-500",
      features: [
        { text: "Unlimited patient records", included: true },
        { text: "Advanced scheduling & reminders", included: true },
        { text: "Priority 24/7 support", included: true },
        { text: "Advanced analytics dashboard", included: true },
        { text: "Telemedicine integration", included: true },
        { text: "Advanced AI diagnostics", included: false },
      ],
    },

    {
      id: 3,
      name: "Enterprise",
      duration: "6 MONTHS",
      price: 5999,
      desc: "Full-scale solution for hospitals and large healthcare networks.",
      badge: "🔥 Best Value",
      color: "text-orange-500",
      features: [
        { text: "Unlimited everything", included: true },
        { text: "Custom integrations & API", included: true },
        { text: "Dedicated account manager", included: true },
        { text: "White-label option", included: true },
        { text: "Telemedicine integration", included: true },
        { text: "Advanced AI diagnostics", included: true },
      ],
    },
  ];

  // ================= YEARLY =================

  const yearlyPlans = [
    {
      id: 1,
      name: "Basic",
      duration: "1 YEAR",
      price: 7999,
      oldPrice: 9999,
      discount: "20% OFF",
      desc: "Perfect for individual practitioners and small clinics.",
      badge: "",
      color: "text-blue-500",
      features: [
        { text: "Up to 50 patient records", included: true },
        { text: "Basic appointment scheduling", included: true },
        { text: "Email support", included: true },
        { text: "Basic reports & analytics", included: true },
        { text: "Telemedicine integration", included: false },
        { text: "Advanced AI diagnostics", included: false },
      ],
    },

    {
      id: 2,
      name: "Premium",
      duration: "3 YEARS",
      price: 19999,
      oldPrice: 24999,
      discount: "20% OFF",
      desc: "Ideal for growing healthcare teams and multi-specialty clinics.",
      badge: "⭐ Most Popular",
      color: "text-green-500",
      features: [
        { text: "Unlimited patient records", included: true },
        { text: "Advanced scheduling & reminders", included: true },
        { text: "Priority 24/7 support", included: true },
        { text: "Advanced analytics dashboard", included: true },
        { text: "Telemedicine integration", included: true },
        { text: "Advanced AI diagnostics", included: false },
      ],
    },

    {
      id: 3,
      name: "Enterprise",
      duration: "5 YEARS",
      price: 39999,
      oldPrice: 49999,
      discount: "20% OFF",
      desc: "Full-scale solution for hospitals and large healthcare networks.",
      badge: "🔥 Best Value",
      color: "text-orange-500",
      features: [
        { text: "Unlimited everything", included: true },
        { text: "Custom integrations & API", included: true },
        { text: "Dedicated account manager", included: true },
        { text: "White-label option", included: true },
        { text: "Telemedicine integration", included: true },
        { text: "Advanced AI diagnostics", included: true },
      ],
    },
  ];

  const plans = billing === "monthly" ? monthlyPlans : yearlyPlans;

  return (
    <div className="min-h-screen bg-[#edf4fb] py-10 px-6">

      {/* HEADER */}

      <div className="max-w-7xl mx-auto text-center mb-10 mt-8">

        <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-5 py-2 rounded-full text-sm font-bold mb-6">
          <Sparkles size={16} />
          HEALTHCARE PLANS
        </div>

        <h1 className="text-4xl font-black text-slate-900 mb-5 tracking-tight">
          Choose Your Plan
        </h1>

        <p className="text-slate-500 max-w-2xl mx-auto text-md leading-relaxed">
          Flexible pricing for healthcare providers of every size.
          <br />
          No hidden fees.
        </p>

        {/* TOGGLE */}

        <div className="mt-6 flex justify-center">
          <div className="bg-white border border-teal-200 rounded-full p-2 flex shadow-xl">

            <button
              onClick={() => {
                setBilling("monthly");
                setSelectedPlan(null);
              }}
              className={`px-5 py-2 rounded-full text-base font-bold transition-all duration-300 ${
                billing === "monthly"
                  ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg"
                  : "text-slate-600"
              }`}
            >
              Monthly
            </button>

            <button
              onClick={() => {
                setBilling("yearly");
                setSelectedPlan(null);
              }}
              className={`px-5 py-2 rounded-full text-base font-bold transition-all duration-300 flex items-center gap-2 ${
                billing === "yearly"
                  ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg"
                  : "text-slate-600"
              }`}
            >
              Yearly

              <span className="bg-yellow-300 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
                SAVE 20%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* CARDS */}

      <div className="max-w-[1250px] mx-auto">

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

          {plans.map((plan) => (

            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan)}
              className={`relative bg-white rounded-[32px] p-5 border cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_25px_70px_rgba(0,0,0,0.08)] min-h-[300px] flex flex-col ${
                selectedPlan?.id === plan.id
                  ? "border-teal-500 shadow-[0_25px_70px_rgba(16,185,129,0.18)]"
                  : "border-slate-200"
              }`}
            >

              {/* BADGE */}

              {plan.badge && (
                <div className="absolute -top-4 left-6">
                  <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                    {plan.badge}
                  </span>
                </div>
              )}

              <p className="text-slate-400 font-bold tracking-[4px] text-xs uppercase mb-4 mt-3">
                {plan.duration}
              </p>

              <h2 className="text-4xl font-black text-slate-900 mb-3">
                ₹{plan.price.toLocaleString("en-IN")}
              </h2>

              {billing === "yearly" && (
                <div className="flex items-center gap-2 mb-3">
                  <span className="line-through text-slate-400">
                    ₹{plan.oldPrice.toLocaleString("en-IN")}
                  </span>

                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                    {plan.discount}
                  </span>
                </div>
              )}

              <p className="text-slate-500 text-sm mb-4 leading-relaxed">
                {plan.desc}
              </p>

              <p className="text-slate-400 text-sm mb-5">
                per user / {billing === "monthly" ? "month" : "year"}
              </p>

              <div className="border-t border-slate-100 mb-5"></div>

              {/* FEATURES */}

              <div className="space-y-3 mb-6">

                {plan.features.map((feature, index) => (

                  <div key={index} className="flex items-start gap-3">

                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center mt-1 ${
                        feature.included
                          ? "bg-emerald-100"
                          : "bg-red-100"
                      }`}
                    >
                      {feature.included ? (
                        <Check
                          className={`${plan.color}`}
                          size={12}
                        />
                      ) : (
                        <X className="text-red-500" size={12} />
                      )}
                    </div>

                    <span
                      className={`text-sm leading-relaxed ${
                        feature.included
                          ? "text-slate-700"
                          : "text-slate-400"
                      }`}
                    >
                      {feature.text}
                    </span>

                  </div>
                ))}
              </div>

              {/* BUTTON */}

              <button
                className={`mt-auto w-full py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                  selectedPlan?.id === plan.id
                    ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-xl"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {plan.name === "Enterprise"
                  ? "Contact Sales"
                  : "Choose Plan"}
              </button>
            </div>
          ))}
        </div>

        {/* PAYMENT SUMMARY */}

        <div className="mt-10 flex justify-center">

          <div className="w-full max-w-lg bg-white rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-slate-200 p-5">

            <div className="flex items-center gap-3 mb-8">

              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
                <CreditCard className="text-blue-600" size={22} />
              </div>

              <h2 className="font-black text-2xl text-slate-900">
                Payment Summary
              </h2>
            </div>

            {!selectedPlan ? (
              <div className="flex flex-col items-center justify-center text-center py-10">

                <div className="w-20 h-20 rounded-[24px] bg-slate-100 flex items-center justify-center mb-5">
                  <ShieldCheck className="text-slate-400" size={34} />
                </div>

                <h3 className="text-xl font-bold text-slate-700 mb-2">
                  No plan selected
                </h3>

                <p className="text-slate-400 text-sm">
                  Choose a plan above to continue
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-5">

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">
                      Plan
                    </span>

                    <span className="bg-slate-100 px-4 py-2 rounded-full font-bold text-sm">
                      {selectedPlan.name}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">
                      Original price
                    </span>

                    <span className="font-bold text-lg">
                      ₹
                      {billing === "yearly"
                        ? selectedPlan.oldPrice?.toLocaleString("en-IN")
                        : selectedPlan.price.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {billing === "yearly" && (
                    <div className="flex justify-between items-center">

                      <span className="text-slate-500">
                        Discount
                      </span>

                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold text-sm">
                        -20%
                      </span>
                    </div>
                  )}
                </div>

                <div className="border-t border-dashed border-slate-300 my-6"></div>

                <div className="flex justify-between items-center mb-8">

                  <span className="text-xl font-black text-slate-800">
                    Total Payable
                  </span>

                  <span className="text-2xl font-black text-slate-900">
                    ₹{selectedPlan.price.toLocaleString("en-IN")}
                  </span>
                </div>

                <button
                  onClick={handleContinue}
                  className="w-full py-3 rounded-2xl text-white font-bold text-lg bg-gradient-to-r from-blue-600 via-violet-600 to-indigo-600 hover:scale-[1.02] transition-all duration-300 shadow-2xl"
                >
                  Continue to Payment →
                </button>

                <p className="text-center text-slate-400 text-sm mt-5">
                  Secured by Razorpay • Cancel anytime
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
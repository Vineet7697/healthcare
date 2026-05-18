// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// import {
//   Check,
//   X,
//   CreditCard,
//   Sparkles,
//   ShieldCheck,
// } from "lucide-react";

// const PaymentPage = () => {
//   const [billing, setBilling] = useState("monthly");
//   const [selectedPlan, setSelectedPlan] = useState(null);

//   const navigate = useNavigate();

//   // ================= RAZORPAY =================

//   const handleContinue = async () => {
//     try {
//       if (!selectedPlan) {
//         alert("Please select a plan");
//         return;
//       }

//       const finalAmount = selectedPlan.price;

//       // CREATE ORDER
//       const { data } = await axios.post(
//         "http://localhost:4000/api/payment/create-order",
//         {
//           amount: finalAmount,
//         }
//       );

//       // RAZORPAY
//       const options = {
//         key: "rzp_test_Sn93hLqCWsB4xv",

//         amount: data.amount,

//         currency: data.currency,

//         order_id: data.id,

//         name: "YoDoctor",

//         description: `${selectedPlan.name} Subscription`,

//         handler: function (response) {
//           console.log("PAYMENT SUCCESS", response);

//           navigate("/payment-success");
//         },

//         prefill: {
//           name: "YoDoctor User",
//           email: "test@gmail.com",
//           contact: "9999999999",
//         },

//         theme: {
//           color: "#14b8a6",
//         },
//       };

//       const razorpay = new window.Razorpay(options);

//       razorpay.on("payment.failed", function (response) {
//         console.log(response);

//         navigate("/payment-failed");
//       });

//       razorpay.open();
//     } catch (error) {
//       console.log(error);
//       alert("Payment Failed");
//     }
//   };

//   // ================= MONTHLY =================

//   const monthlyPlans = [
//     {
//       id: 1,
//       name: "Basic",
//       duration: "1 MONTH",
//       price: 999,
//       desc: "Perfect for individual practitioners and small clinics.",
//       badge: "",
//       color: "text-blue-500",
//       features: [
//         { text: "Up to 50 patient records", included: true },
//         { text: "Basic appointment scheduling", included: true },
//         { text: "Email support", included: true },
//         { text: "Basic reports & analytics", included: true },
//         { text: "Telemedicine integration", included: false },
//         { text: "Advanced AI diagnostics", included: false },
//       ],
//     },

//     {
//       id: 2,
//       name: "Premium",
//       duration: "3 MONTHS",
//       price: 2499,
//       desc: "Ideal for growing healthcare teams and multi-specialty clinics.",
//       badge: "⭐ Most Popular",
//       color: "text-green-500",
//       features: [
//         { text: "Unlimited patient records", included: true },
//         { text: "Advanced scheduling & reminders", included: true },
//         { text: "Priority 24/7 support", included: true },
//         { text: "Advanced analytics dashboard", included: true },
//         { text: "Telemedicine integration", included: true },
//         { text: "Advanced AI diagnostics", included: false },
//       ],
//     },

//     {
//       id: 3,
//       name: "Enterprise",
//       duration: "6 MONTHS",
//       price: 5999,
//       desc: "Full-scale solution for hospitals and large healthcare networks.",
//       badge: "🔥 Best Value",
//       color: "text-orange-500",
//       features: [
//         { text: "Unlimited everything", included: true },
//         { text: "Custom integrations & API", included: true },
//         { text: "Dedicated account manager", included: true },
//         { text: "White-label option", included: true },
//         { text: "Telemedicine integration", included: true },
//         { text: "Advanced AI diagnostics", included: true },
//       ],
//     },
//   ];

//   // ================= YEARLY =================

//   const yearlyPlans = [
//     {
//       id: 1,
//       name: "Basic",
//       duration: "1 YEAR",
//       price: 7999,
//       oldPrice: 9999,
//       discount: "20% OFF",
//       desc: "Perfect for individual practitioners and small clinics.",
//       badge: "",
//       color: "text-blue-500",
//       features: [
//         { text: "Up to 50 patient records", included: true },
//         { text: "Basic appointment scheduling", included: true },
//         { text: "Email support", included: true },
//         { text: "Basic reports & analytics", included: true },
//         { text: "Telemedicine integration", included: false },
//         { text: "Advanced AI diagnostics", included: false },
//       ],
//     },

//     {
//       id: 2,
//       name: "Premium",
//       duration: "3 YEARS",
//       price: 19999,
//       oldPrice: 24999,
//       discount: "20% OFF",
//       desc: "Ideal for growing healthcare teams and multi-specialty clinics.",
//       badge: "⭐ Most Popular",
//       color: "text-green-500",
//       features: [
//         { text: "Unlimited patient records", included: true },
//         { text: "Advanced scheduling & reminders", included: true },
//         { text: "Priority 24/7 support", included: true },
//         { text: "Advanced analytics dashboard", included: true },
//         { text: "Telemedicine integration", included: true },
//         { text: "Advanced AI diagnostics", included: false },
//       ],
//     },

//     {
//       id: 3,
//       name: "Enterprise",
//       duration: "5 YEARS",
//       price: 39999,
//       oldPrice: 49999,
//       discount: "20% OFF",
//       desc: "Full-scale solution for hospitals and large healthcare networks.",
//       badge: "🔥 Best Value",
//       color: "text-orange-500",
//       features: [
//         { text: "Unlimited everything", included: true },
//         { text: "Custom integrations & API", included: true },
//         { text: "Dedicated account manager", included: true },
//         { text: "White-label option", included: true },
//         { text: "Telemedicine integration", included: true },
//         { text: "Advanced AI diagnostics", included: true },
//       ],
//     },
//   ];

//   const plans = billing === "monthly" ? monthlyPlans : yearlyPlans;

//   return (
//     <div className="min-h-screen bg-[#edf4fb] py-10 px-6">

//       {/* HEADER */}

//       <div className="max-w-7xl mx-auto text-center mb-10 mt-8">

//         <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-5 py-2 rounded-full text-sm font-bold mb-6">
//           <Sparkles size={16} />
//           HEALTHCARE PLANS
//         </div>

//         <h1 className="text-4xl font-black text-slate-900 mb-5 tracking-tight">
//           Choose Your Plan
//         </h1>

//         <p className="text-slate-500 max-w-2xl mx-auto text-md leading-relaxed">
//           Flexible pricing for healthcare providers of every size.
//           <br />
//           No hidden fees.
//         </p>

//         {/* TOGGLE */}

//         <div className="mt-6 flex justify-center">
//           <div className="bg-white border border-teal-200 rounded-full p-2 flex shadow-xl">

//             <button
//               onClick={() => {
//                 setBilling("monthly");
//                 setSelectedPlan(null);
//               }}
//               className={`px-5 py-2 rounded-full text-base font-bold transition-all duration-300 ${
//                 billing === "monthly"
//                   ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg"
//                   : "text-slate-600"
//               }`}
//             >
//               Monthly
//             </button>

//             <button
//               onClick={() => {
//                 setBilling("yearly");
//                 setSelectedPlan(null);
//               }}
//               className={`px-5 py-2 rounded-full text-base font-bold transition-all duration-300 flex items-center gap-2 ${
//                 billing === "yearly"
//                   ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg"
//                   : "text-slate-600"
//               }`}
//             >
//               Yearly

//               <span className="bg-yellow-300 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
//                 SAVE 20%
//               </span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* CARDS */}

//       <div className="max-w-[1250px] mx-auto">

//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

//           {plans.map((plan) => (

//             <div
//               key={plan.id}
//               onClick={() => setSelectedPlan(plan)}
//               className={`relative bg-white rounded-[32px] p-5 border cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_25px_70px_rgba(0,0,0,0.08)] min-h-[300px] flex flex-col ${
//                 selectedPlan?.id === plan.id
//                   ? "border-teal-500 shadow-[0_25px_70px_rgba(16,185,129,0.18)]"
//                   : "border-slate-200"
//               }`}
//             >

//               {/* BADGE */}

//               {plan.badge && (
//                 <div className="absolute -top-4 left-6">
//                   <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
//                     {plan.badge}
//                   </span>
//                 </div>
//               )}

//               <p className="text-slate-400 font-bold tracking-[4px] text-xs uppercase mb-4 mt-3">
//                 {plan.duration}
//               </p>

//               <h2 className="text-4xl font-black text-slate-900 mb-3">
//                 ₹{plan.price.toLocaleString("en-IN")}
//               </h2>

//               {billing === "yearly" && (
//                 <div className="flex items-center gap-2 mb-3">
//                   <span className="line-through text-slate-400">
//                     ₹{plan.oldPrice.toLocaleString("en-IN")}
//                   </span>

//                   <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
//                     {plan.discount}
//                   </span>
//                 </div>
//               )}

//               <p className="text-slate-500 text-sm mb-4 leading-relaxed">
//                 {plan.desc}
//               </p>

//               <p className="text-slate-400 text-sm mb-5">
//                 per user / {billing === "monthly" ? "month" : "year"}
//               </p>

//               <div className="border-t border-slate-100 mb-5"></div>

//               {/* FEATURES */}

//               <div className="space-y-3 mb-6">

//                 {plan.features.map((feature, index) => (

//                   <div key={index} className="flex items-start gap-3">

//                     <div
//                       className={`w-5 h-5 rounded-full flex items-center justify-center mt-1 ${
//                         feature.included
//                           ? "bg-emerald-100"
//                           : "bg-red-100"
//                       }`}
//                     >
//                       {feature.included ? (
//                         <Check
//                           className={`${plan.color}`}
//                           size={12}
//                         />
//                       ) : (
//                         <X className="text-red-500" size={12} />
//                       )}
//                     </div>

//                     <span
//                       className={`text-sm leading-relaxed ${
//                         feature.included
//                           ? "text-slate-700"
//                           : "text-slate-400"
//                       }`}
//                     >
//                       {feature.text}
//                     </span>

//                   </div>
//                 ))}
//               </div>

//               {/* BUTTON */}

//               <button
//                 className={`mt-auto w-full py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
//                   selectedPlan?.id === plan.id
//                     ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-xl"
//                     : "bg-slate-100 text-slate-700 hover:bg-slate-200"
//                 }`}
//               >
//                 {plan.name === "Enterprise"
//                   ? "Contact Sales"
//                   : "Choose Plan"}
//               </button>
//             </div>
//           ))}
//         </div>

//         {/* PAYMENT SUMMARY */}

//         <div className="mt-10 flex justify-center">

//           <div className="w-full max-w-lg bg-white rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-slate-200 p-5">

//             <div className="flex items-center gap-3 mb-8">

//               <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
//                 <CreditCard className="text-blue-600" size={22} />
//               </div>

//               <h2 className="font-black text-2xl text-slate-900">
//                 Payment Summary
//               </h2>
//             </div>

//             {!selectedPlan ? (
//               <div className="flex flex-col items-center justify-center text-center py-10">

//                 <div className="w-20 h-20 rounded-[24px] bg-slate-100 flex items-center justify-center mb-5">
//                   <ShieldCheck className="text-slate-400" size={34} />
//                 </div>

//                 <h3 className="text-xl font-bold text-slate-700 mb-2">
//                   No plan selected
//                 </h3>

//                 <p className="text-slate-400 text-sm">
//                   Choose a plan above to continue
//                 </p>
//               </div>
//             ) : (
//               <>
//                 <div className="space-y-5">

//                   <div className="flex justify-between items-center">
//                     <span className="text-slate-500">
//                       Plan
//                     </span>

//                     <span className="bg-slate-100 px-4 py-2 rounded-full font-bold text-sm">
//                       {selectedPlan.name}
//                     </span>
//                   </div>

//                   <div className="flex justify-between items-center">
//                     <span className="text-slate-500">
//                       Original price
//                     </span>

//                     <span className="font-bold text-lg">
//                       ₹
//                       {billing === "yearly"
//                         ? selectedPlan.oldPrice?.toLocaleString("en-IN")
//                         : selectedPlan.price.toLocaleString("en-IN")}
//                     </span>
//                   </div>

//                   {billing === "yearly" && (
//                     <div className="flex justify-between items-center">

//                       <span className="text-slate-500">
//                         Discount
//                       </span>

//                       <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold text-sm">
//                         -20%
//                       </span>
//                     </div>
//                   )}
//                 </div>

//                 <div className="border-t border-dashed border-slate-300 my-6"></div>

//                 <div className="flex justify-between items-center mb-8">

//                   <span className="text-xl font-black text-slate-800">
//                     Total Payable
//                   </span>

//                   <span className="text-2xl font-black text-slate-900">
//                     ₹{selectedPlan.price.toLocaleString("en-IN")}
//                   </span>
//                 </div>

//                 <button
//                   onClick={handleContinue}
//                   className="w-full py-3 rounded-2xl text-white font-bold text-lg bg-gradient-to-r from-blue-600 via-violet-600 to-indigo-600 hover:scale-[1.02] transition-all duration-300 shadow-2xl"
//                 >
//                   Continue to Payment →
//                 </button>

//                 <p className="text-center text-slate-400 text-sm mt-5">
//                   Secured by Razorpay • Cancel anytime
//                 </p>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentPage;

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { CreditCard, Sparkles, ShieldCheck } from "lucide-react";

const PaymentPage = () => {
  const navigate = useNavigate();

  const [selectedPlan, setSelectedPlan] = useState(null);

  const [billing, setBilling] = useState("monthly");

  // ================= PLANS =================

  const plans = [
    // MONTHLY

        {
      id: 1,
      category: "monthly",

      title: "1 MONTH PLAN",

      months: 1,

      originalPrice: 799,

      price: 799,

      freeText: "NO FREE TRIAL",

      subtitle: "Subscribe for 1 Month",

      description: " Perfect for individual practitioners and small clinics.",

      buttonText: "Choose Plan",

      gradient: "from-emerald-500 to-green-600",

      circleColor: "bg-emerald-600",

      discount: "",
    },

    {
      id: 2,
      category: "monthly",

      title: "3 MONTH PLAN",

      months: 3,

      originalPrice: 2397,

      price: 2397,

      freeText: "45 DAYS FREE",

      subtitle: "Subscribe for 3 Months",

      description: "Get 45 days extra access completely free.",

      buttonText: "Choose Plan",

      gradient: "from-emerald-500 to-green-600",

      circleColor: "bg-emerald-600",

      discount: "",
    },

    {
      id: 3,
      category: "monthly",

      title: "6 MONTH PLAN",

      months: 6,

      originalPrice: 4794,

      price: 4794,

      freeText: "3 MONTHS FREE",

      subtitle: "Subscribe for 6 Months",

      description: "Pay for 6 months and use for 9 months.",

      buttonText: "Choose Plan",

      gradient: "from-blue-600 to-indigo-700",

      circleColor: "bg-blue-600",

      discount: "",
    },

    // YEARLY

    {
      id: 4,
      category: "yearly",

      title: "1 YEAR PLAN",

      months: 12,

      originalPrice: 9588,

      price: 7670,

      freeText: "4 MONTHS FREE",

      subtitle: "Subscribe for 1 Year",

      description: "Get 20% OFF + 4 months additional free access.",

      buttonText: "Choose Plan",

      gradient: "from-violet-600 to-purple-700",

      circleColor: "bg-violet-600",

      discount: "20% OFF",
    },

    {
      id: 5,
      category: "yearly",

      title: "2 YEAR PLAN",

      months: 24,

      originalPrice: 19176,

      price: 15340,

      freeText: "20% OFF",

      subtitle: "Subscribe for 2 Years",

      description: "Best long-term subscription plan.",

      buttonText: "Choose Plan",

      gradient: "from-orange-500 to-red-500",

      circleColor: "bg-orange-500",

      discount: "20% OFF",
    },

    {
      id: 6,
      category: "yearly",

      title: "3 YEAR PLAN",

      months: 36,

      originalPrice: 28764,

      price: 23011,

      freeText: "20% OFF",

      subtitle: "Subscribe for 3 Years",

      description: "Maximum savings for hospitals and clinics.",

      buttonText: "Choose Plan",

      gradient: "from-pink-500 to-rose-600",

      circleColor: "bg-pink-600",

      discount: "20% OFF",
    },
  ];

  // ================= PAYMENT =================

  const handleContinue = async () => {
    try {
      if (!selectedPlan) {
        alert("Please select a plan");
        return;
      }

      const { data } = await axios.post(
        "http://localhost:4000/api/payment/create-order",
        {
          amount: selectedPlan.price,
        },
      );

      const options = {
        key: "rzp_test_Sn93hLqCWsB4xv",

        amount: data.amount,

        currency: data.currency,

        order_id: data.id,

        name: "YoDoctor",

        description: selectedPlan.title,

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

      razorpay.on("payment.failed", function () {
        navigate("/payment-failed");
      });

      razorpay.open();
    } catch (error) {
      console.log(error);

      alert("Payment Failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#eef4fb] py-10 px-4">
      {/* HEADER */}

      <div className="max-w-7xl mx-auto text-center mb-14 mt-14">
        <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-5 py-2 rounded-full text-sm font-bold mb-6">
          <Sparkles size={16} />
          HEALTHCARE PLANS
        </div>

        <h1 className="text-4xl font-black text-slate-900 mb-4">
          Choose Your Plan
        </h1>

        <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
          Flexible pricing for healthcare providers of every size.
          <br />
          No hidden fees.
        </p>

        {/* TOGGLE */}

        <div className="mt-8 flex justify-center">
          <div className="bg-white border border-teal-200 rounded-full p-2 flex shadow-xl">
            <button
              onClick={() => {
                setBilling("monthly");
                setSelectedPlan(null);
              }}
              className={`px-6 py-2 rounded-full text-md font-bold transition-all duration-300
              ${
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
              className={`px-6 py-2 rounded-full text-md font-bold transition-all duration-300 flex items-center gap-2
              ${
                billing === "yearly"
                  ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg"
                  : "text-slate-600"
              }`}
            >
              Yearly
              <span className="bg-yellow-300 text-yellow-900 px-2 py-1 rounded-full text-[10px] font-black">
                SAVE 20%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* PLANS */}

      <div className="max-w-[1150px] mx-auto">
        <div className="flex flex-wrap justify-center gap-6">
          {plans
            .filter((plan) => plan.category === billing)
            .map((plan) => (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan)}
                className={`relative w-[300px] bg-white rounded-[18px] border border-[#e5e7eb]
overflow-hidden transition-all duration-300 cursor-pointer
hover:shadow-lg
                ${
                  selectedPlan?.id === plan.id
                    ? "border-teal-500 shadow-[0_20px_50px_rgba(16,185,129,0.18)]"
                    : "border-slate-200"
                }`}
              >
                {/* BADGE */}

                <div
                  className={`absolute top-5 right-5 w-[65px] h-[65px]
rounded-full bg-[#14b8a6]
text-white text-[10px] font-bold
flex items-center justify-center
text-center leading-tight shadow-md z-10 px-2`}
                >
                  {plan.freeText}
                </div>

                {/* HEADER */}

                <div
                  className={`${
                    billing === "monthly" ? "bg-[#0f766e]" : "bg-[#0f766e]"
                  } py-3 text-center`}
                >
                  <h2 className="text-white font-bold text-[15px] tracking-wide">
                    {plan.title}
                  </h2>
                </div>

                {/* BODY */}

                <div className="px-7 py-8 flex flex-col min-h-[360px]">
                  {/* PRICE */}

                  <div className="text-center">
                    {plan.discount && (
                      <p className="text-slate-400 line-through text-lg font-semibold mb-2">
                        ₹{plan.originalPrice.toLocaleString("en-IN")}
                      </p>
                    )}

                    <h1 className="text-[40px] font-bold text-[#0f172a] leading-none">
                      ₹{plan.price.toLocaleString("en-IN")}
                    </h1>

                    <p className="text-slate-500 text-sm mt-3 font-medium">
                      {plan.months} Months Subscription
                    </p>
                  </div>

                  {/* SUBTITLE */}

                  <div className="mt-7 text-center">
                    <h3 className="text-[18px] font-bold text-slate-800">
                      {plan.subtitle}
                    </h3>

                    <p className="text-slate-500 text-sm leading-relaxed mt-3">
                      {plan.description}
                    </p>
                  </div>

                  {/* OFFER */}

                  {plan.discount && (
                    <div className="flex justify-center mt-5">
                      <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-xs font-black">
                        {plan.discount}
                      </span>
                    </div>
                  )}

                  {/* BUTTON */}

                  <button
                   className={`w-full mt-auto py-3 rounded-lg text-sm font-semibold transition-all duration-300
                    ${
                      selectedPlan?.id === plan.id
                      ? "bg-[#14b8a6] text-white"
                       : "bg-[#f1f5f9] text-slate-700 hover:bg-[#e2e8f0]"
                    }`}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              </div>
            ))}
        </div>

        {/* PAYMENT SUMMARY */}

        <div className="mt-12 flex justify-center">
          <div className="w-full max-w-md bg-white rounded-[20px] border border-slate-200 shadow-[0_20px_60px_rgba(0,0,0,0.06)] p-7">
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
                  Choose a subscription plan above
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-5">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Subscription</span>

                    <span className="font-bold text-slate-800">
                      {selectedPlan.title}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Original Price</span>

                    <span className="font-bold text-slate-800">
                      ₹{selectedPlan.originalPrice.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {selectedPlan.discount && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Discount</span>

                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                        {selectedPlan.discount}
                      </span>
                    </div>
                  )}
                </div>

                <div className="border-t border-dashed border-slate-300 my-7"></div>

                <div className="flex justify-between items-center mb-8">
                  <span className="text-xl font-black text-slate-800">
                    Total Payable
                  </span>

                  <span className="text-3xl font-black text-slate-900">
                    ₹{selectedPlan.price.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* PAYMENT BUTTON */}

                <button
                  onClick={handleContinue}
                  className="w-full py-4 rounded-2xl text-white font-bold text-lg bg-[#1d4843] hover:scale-[1.02] transition-all duration-300 shadow-xl"
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

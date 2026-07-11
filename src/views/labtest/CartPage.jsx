import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, ArrowLeft, ShoppingCart, Tag } from "lucide-react";
import { useCart } from "../../context/CartContext";


export default function CartPage() {
  const { items, removeItem, subtotal, mrpTotal, savings } = useCart();
  const navigate = useNavigate();

  if (items.length === 0)
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-5">
          <ShoppingCart
            size={28}
            className="text-primary-DEFAULT sm:w-8 sm:h-8"
          />
        </div>
        <h1 className="font-display font-bold text-dark text-xl sm:text-2xl mb-2">
          Your cart is empty
        </h1>
        <p className="text-muted text-sm mb-6">
          Browse our tests and add one to get started.
        </p>
        <Link
          to="/client/search"
          className="bg-primary-DEFAULT hover:bg-primary-hover text-white font-semibold rounded-xl px-6 py-3 text-sm transition inline-block"
        >
          Browse Tests
        </Link>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5 sm:py-6 pb-28 lg:pb-12">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-muted mb-4 sm:mb-5 hover:text-dark"
      >
        <ArrowLeft size={16} /> Back
      </button>
      <h1 className="font-display font-bold text-dark text-xl sm:text-2xl mb-5 sm:mb-6">
        My Cart{" "}
        <span className="text-muted font-normal text-base sm:text-lg">
          ({items.length} item{items.length > 1 ? "s" : ""})
        </span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-border rounded-2xl p-3 sm:p-4 flex gap-3 shadow-card"
            >
              <img
                src={
                  item.image?.startsWith("http")
                    ? item.image
                    : `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}${
                        item.image.startsWith("/") ? "" : "/"
                      }${item.image}`
                }
                alt={item.name}
                className="w-16 h-14 sm:w-20 sm:h-16 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <Link
                  to={`/client/test/${item.id}`}
                  className="font-display font-semibold text-dark text-sm hover:text-primary-DEFAULT line-clamp-2"
                >
                  {item.name}
                </Link>
                <p className="text-[11px] sm:text-xs text-muted mt-0.5">
                  {item.parameters} Parameters · {item.reportTime}
                </p>
                <div className="flex items-baseline gap-1.5 mt-1.5">
                  <span className="font-display font-bold text-dark text-sm sm:text-base">
                    ₹{item.price}
                  </span>
                  <span className="text-[11px] sm:text-xs text-placeholder line-through">
                    ₹{item.mrp}
                  </span>
                </div>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="text-placeholder hover:text-error transition p-1.5 shrink-0 self-start"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <Link
            to="/client/search"
            className="flex items-center justify-center gap-2 text-sm font-semibold text-primary-DEFAULT border-2 border-dashed border-primary-DEFAULT rounded-2xl py-3.5 sm:py-4 hover:bg-primary-light transition"
          >
            <Plus size={16} /> Add More Tests
          </Link>
        </div>

        {/* Price summary */}
        <div className="bg-white border border-border rounded-2xl p-4 sm:p-5 shadow-card h-fit">
          <h2 className="font-display font-bold text-dark mb-4 text-sm sm:text-base">
            Price Summary
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-muted">
              <span>Total MRP</span>
              <span>₹{mrpTotal}</span>
            </div>
            <div className="flex justify-between text-[#22C55E] font-semibold">
              <span>You Save</span>
              <span>– ₹{savings}</span>
            </div>
            <div className="flex items-center gap-2 bg-[#F0FDF4] border border-[#22C55E] rounded-xl px-3 py-2 text-xs text-[#16A34A] font-semibold">
              <Tag size={13} className="shrink-0" /> Great deal! You're saving{" "}
              {Math.round((savings / mrpTotal) * 100)}% on this order.
            </div>
            <div className="border-t border-border pt-3 flex justify-between font-display font-bold text-dark text-base sm:text-lg">
              <span>Total Payable</span>
              <span>₹{subtotal}</span>
            </div>
          </div>
          <button
            onClick={() => navigate("/client/booking")}
            className="bg-blue-800 text-white font-bold rounded-xl px-6 py-3 text-sm w-full mt-6 hover:bg-blue-900 transition cursor-pointer"
          >
            Proceed to Book Slot →
          </button>
        </div>
      </div>
    </div>
  );
}

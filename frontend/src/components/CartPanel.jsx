import React, { useState, useEffect } from "react";
import { X, Minus, Plus, Trash2, CreditCard } from "lucide-react";

export default function CartPanel({
  open,
  onClose,
  cart,
  onRemove,
  onUpdateQty,
  onCheckoutSubmit,
}) {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    setShow(open);
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) return alert("Please enter name and email");
    await onCheckoutSubmit(name, email);
    setName("");
    setEmail("");
  };

  return (
    <div className="fixed inset-0 z-40">
      {/* background overlay */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* drawer panel */}
      <aside
        className={`absolute right-0 top-0 h-full w-full sm:max-w-md bg-white shadow-2xl transition-transform duration-300 ${
          show ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* cart items */}
        <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-220px)]">
          {cart.items.length === 0 && (
            <div className="rounded-xl border p-6 text-center text-slate-500">
              Your cart is empty.
            </div>
          )}

          {cart.items.map((item) => (
            <div
              key={item.cartId}
              className="flex items-center justify-between gap-3 border rounded-xl p-3 shadow-sm hover:shadow-md transition"
            >
              <div className="min-w-0">
                <div className="font-semibold text-slate-900">
                  {item.name}
                </div>
                <div className="text-sm text-slate-600">
                  ₹{item.price} × {item.qty}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    onUpdateQty(item.cartId, item.productId, Math.max(0, item.qty - 1))
                  }
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center font-medium">{item.qty}</span>
                <button
                  onClick={() =>
                    onUpdateQty(item.cartId, item.productId, item.qty + 1)
                  }
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                >
                  <Plus className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onRemove(item.cartId)}
                  className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* footer */}
        <div className="absolute bottom-0 w-full border-t bg-white p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-slate-600 text-sm">Total</div>
            <div className="text-xl font-bold text-slate-900">
              ₹{Math.round(cart.total)}
            </div>
          </div>

          {/* checkout form */}
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            <input
              className="rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="submit"
              disabled={cart.items.length === 0}
              className="sm:col-span-2 flex items-center justify-center gap-2 rounded-xl bg-sky-600 text-white px-4 py-2.5 hover:bg-sky-700 disabled:opacity-50 transition"
            >
              <CreditCard className="h-4 w-4" /> Checkout
            </button>
          </form>
        </div>
      </aside>
    </div>
  );
}

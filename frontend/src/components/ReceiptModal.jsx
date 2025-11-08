import React from "react";
import { CheckCircle2, X } from "lucide-react";

export default function ReceiptModal({ receipt, onClose }) {
  const items = receipt.items || receipt.order?.items || [];

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      ></div>

      <div className="absolute left-1/2 top-24 -translate-x-1/2 w-[95%] max-w-xl rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            <h3 className="text-lg font-semibold">Order Confirmed</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="text-sm text-slate-600">
            Order ID:{" "}
            <span className="font-mono">
              {receipt.id || receipt.order?.id}
            </span>
            <br />
            {receipt.customer?.name && (
              <>
                Customer: <strong>{receipt.customer.name}</strong>
                <br />
              </>
            )}
            {receipt.customer?.email && (
              <>
                Email: {receipt.customer.email}
                <br />
              </>
            )}
            <span className="text-slate-500">
              Timestamp:{" "}
              {receipt.timestamp || receipt.order?.timestamp}
            </span>
          </div>

          <div className="rounded-xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="text-left px-4 py-2">Item</th>
                  <th className="text-left px-4 py-2">Qty</th>
                  <th className="text-left px-4 py-2">Price</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="px-4 py-2">{it.name}</td>
                    <td className="px-4 py-2">{it.qty}</td>
                    <td className="px-4 py-2">₹{it.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-slate-600">Total</div>
            <div className="text-xl font-bold">
              ₹{Math.round(receipt.total || receipt.order?.total || 0)}
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full rounded-xl border px-4 py-2 hover:shadow-card transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { Plus } from "lucide-react";

export default function ProductsGrid({ products = [], onAdd }) {
  if (!products?.length) {
    return (
      <div className="rounded-2xl border p-8 text-center text-slate-600 bg-white">
        No products available.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => (
        <article
          key={p.id}
          className="group rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md hover:border-sky-100 transition"
        >
          <h3 className="font-semibold text-slate-900 text-lg">{p.name}</h3>
          <p className="mt-1 text-sm text-slate-600">{p.description}</p>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-lg font-bold text-slate-900">₹{p.price}</div>

            <button
              onClick={() => onAdd(p.id)}
              className="inline-flex items-center gap-2 rounded-xl bg-sky-600 text-white px-4 py-2 hover:bg-sky-700 active:scale-[0.98] transition"
              aria-label={`Add ${p.name} to cart`}
            >
              <Plus className="h-4 w-4" />
              Add to Cart
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

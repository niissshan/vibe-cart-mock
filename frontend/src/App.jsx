import React, { useEffect, useState } from 'react';
import { ShoppingCart, Store, Loader2 } from 'lucide-react';
import { getProducts, addToCart, getCart, removeCartItem, checkout } from './api';
import ProductsGrid from './components/ProductsGrid';
import CartPanel from './components/CartPanel';
import ReceiptModal from './components/ReceiptModal';

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState(null);

  // 👇 total quantity across all cart lines
  const itemCount = (cart.items || []).reduce((sum, it) => sum + (it.qty || 0), 0);

  async function loadProducts() {
    try {
      setLoadingProducts(true);
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingProducts(false);
    }
  }

  async function loadCart() {
    try {
      const data = await getCart();
      setCart(data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadProducts();
    loadCart();
  }, []);

  async function handleAdd(productId) {
    try {
      await addToCart(productId, 1);
      await loadCart();
      setCartOpen(true);
    } catch (err) {
      alert('Add to cart failed: ' + err.message);
    }
  }

  async function handleRemove(cartId) {
    try {
      await removeCartItem(cartId);
      await loadCart();
    } catch (err) {
      alert('Remove failed: ' + err.message);
    }
  }

  async function handleUpdateQty(cartId, productId, newQty) {
    try {
      await removeCartItem(cartId);
      if (newQty > 0) await addToCart(productId, newQty);
      await loadCart();
    } catch (err) {
      alert('Update qty failed: ' + err.message);
    }
  }

  async function handleCheckout(name, email) {
    try {
      const res = await checkout(name, email);
      setReceipt(res.receipt);
      await loadCart();
      setCartOpen(false);
    } catch (err) {
      alert('Checkout failed: ' + err.message);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-800 font-sans antialiased">
      {/* 🧭 Header / Navbar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 font-semibold text-xl text-slate-900 shrink-0">
            <Store className="h-6 w-6 text-sky-600" />
            <span>Vibe Commerce</span>
          </a>

          {/* Navigation links */}
          <nav className="hidden sm:flex flex-1 justify-center items-center gap-10 text-sm font-medium text-slate-600">
            <a className="hover:text-slate-900 transition-colors" href="#new">New</a>
            <a className="hover:text-slate-900 transition-colors" href="#products">Products</a>
            <a className="hover:text-slate-900 transition-colors" href="#about">About</a>
          </nav>

          {/* Cart button with total qty */}
          <button
            onClick={() => setCartOpen(true)}
            className="flex items-center gap-2 rounded-xl border px-4 py-2 hover:shadow-card transition text-slate-700 font-medium shrink-0"
            aria-label="Open cart"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="hidden sm:inline">Cart</span>
            <span className="ml-1 text-xs font-semibold rounded-full bg-sky-600 text-white px-2 py-0.5 leading-none">
              {itemCount}
            </span>
          </button>
        </div>
      </header>

      {/* 🛍 Hero Section */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 py-10 sm:py-14">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Shop simple. Checkout fast.
              </h1>
              <p className="mt-3 text-slate-600">
                A clean mock store to test core e-commerce flows — browse, add to cart, and get a receipt.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#products" className="rounded-xl bg-sky-600 text-white px-5 py-2.5 hover:bg-sky-700 transition">
                  Browse Products
                </a>
                <a href="#about" className="rounded-xl border px-5 py-2.5 hover:shadow-card transition">
                  Learn More
                </a>
              </div>
            </div>
            <div className="rounded-2xl border bg-slate-50 p-6 shadow-sm">
              <div className="text-sm text-slate-600">Cart total</div>
              <div className="mt-2 text-3xl font-bold">₹{Math.round(cart.total)}</div>
              <div className="mt-4 text-xs text-slate-500">Real-time total updates as you add items.</div>
            </div>
          </div>
        </div>
      </section>

      {/* 🧩 Product Section */}
      <main id="products" className="max-w-6xl mx-auto px-4 pb-16">
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-semibold">Products</h2>
          {loadingProducts && (
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading…
            </div>
          )}
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3 mb-6">
            {error}
          </div>
        )}

        <ProductsGrid products={products} onAdd={handleAdd} />
      </main>

      {/* 🛒 Cart Drawer */}
      <CartPanel
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onRemove={handleRemove}
        onUpdateQty={handleUpdateQty}
        onCheckoutSubmit={handleCheckout}
      />

      {/* 🧾 Receipt Modal */}
      {receipt && (
        <ReceiptModal receipt={receipt} onClose={() => setReceipt(null)} />
      )}

      {/* 🦶 Footer */}
      <footer id="about" className="border-t bg-white">
        <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-slate-600">
          <div>© {new Date().getFullYear()} Vibe Commerce — Mock Cart.</div>
          <div className="mt-1">Built with React, Vite, Express & SQLite.</div>
        </div>
      </footer>
    </div>
  );
}

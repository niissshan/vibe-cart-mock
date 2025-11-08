const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export async function getProducts() {
  const res = await fetch(`${BASE}/api/products`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function addToCart(productId, qty = 1) {
  const res = await fetch(`${BASE}/api/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, qty })
  });
  if (!res.ok) {
    const e = await res.json().catch(()=>({error:'unknown'}));
    throw new Error(e.error || 'Add to cart failed');
  }
  return res.json();
}

export async function getCart() {
  const res = await fetch(`${BASE}/api/cart`);
  if (!res.ok) throw new Error('Failed to fetch cart');
  return res.json();
}

export async function removeCartItem(id) {
  const res = await fetch(`${BASE}/api/cart/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const e = await res.json().catch(()=>({error:'unknown'}));
    throw new Error(e.error || 'Delete failed');
  }
  return res.json();
}

export async function checkout(name, email) {
  const res = await fetch(`${BASE}/api/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email })
  });
  if (!res.ok) {
    const e = await res.json().catch(()=>({error:'unknown'}));
    throw new Error(e.error || 'Checkout failed');
  }
  return res.json();
}

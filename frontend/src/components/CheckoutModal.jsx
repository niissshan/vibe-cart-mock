import React, { useState } from 'react';

export default function CheckoutModal({ onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  function submit(e) {
    e.preventDefault();
    if (!name || !email) return alert('Enter name and email');
    onSubmit(name, email);
  }

  return (
    <div className="modal">
      <form className="modal-content" onSubmit={submit}>
        <h3>Checkout</h3>
        <label>Name</label>
        <input value={name} onChange={e => setName(e.target.value)} />
        <label>Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} />
        <div className="modal-actions">
          <button type="submit">Confirm</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

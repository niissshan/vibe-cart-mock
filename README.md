# Vibe Commerce — Mock E-Commerce Cart

This project is my submission for the Vibe Commerce Internship Full-Stack Assignment.

It is a complete mock shopping cart web application built with React, Node.js, Express, and SQLite.  
The goal of the project is to demonstrate the integration of frontend, backend, and database layers while maintaining a simple, clean, and responsive design.

---

## Overview

The application allows a user to browse products, add items to a cart, update quantities, and perform a mock checkout.  
When the checkout is completed, the system stores the order details and order items in a local SQLite database.

This project reflects a real-world e-commerce workflow, focusing on data handling, UI responsiveness, and proper API communication between the frontend and backend.

---

## Features

- Product listing page with an Add to Cart button for each item.
- A cart drawer that shows products, quantities, total price, and options to remove or update items.
- Checkout form where the user provides their name and email.
- Receipt modal shown after checkout.
- Orders and order items are stored in a SQLite database.
- Fully responsive design using Tailwind CSS v4.
- Basic error handling and user alerts for failed API calls or form validation.

---

## Tech Stack

| Component | Technology | Purpose |
|------------|-------------|----------|
| Frontend | React (Vite) + Tailwind CSS v4 | User interface and interactions |
| Backend | Node.js + Express | REST API for products, cart, and checkout |
| Database | SQLite | Local database for products, cart, and orders |

---

## Project Structure


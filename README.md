# 🍽️ Restaurant Management System

A full-stack Restaurant Management System built with **React**, **Django REST Framework**, and **SQLite**. The application streamlines restaurant operations by managing menus, tables, orders, payments, and staff workflows through a role-based access control system.

---

## 📖 Overview

This project was developed to simulate the day-to-day operations of a restaurant. It provides different interfaces and functionalities for managers, kitchen staff, cashiers, and customers, ensuring an efficient order processing workflow from order placement to payment.

The backend exposes RESTful APIs, while the frontend offers an intuitive user interface for managing restaurant activities.

---

## ✨ Features

### 👤 User Management

- User authentication
- Role-based authorization
- Multiple user roles:
  - Manager
  - Cook
  - Cashier
  - Customer

---

### 🍔 Menu Management

- Create, update, and delete menu items
- Organize meals by category
- Display meal images
- Manage pricing and descriptions

---

### 🪑 Table Management

- View table availability
- Manage seating capacity
- Automatically update table status when:
  - A customer places an order
  - Payment is completed

---

### 📝 Order Management

- Create customer orders
- Assign tables
- Update order status
- Track preparation progress
- Store customer notes

Order workflow:

```
Pending
    ↓
Cooking
    ↓
Ready
    ↓
Paid
```

---

### 💳 Payment Processing

- Cashier confirms completed orders
- Automatically release occupied tables
- Update order history

---

## 🏗️ System Architecture

```
                React + Vite
                      │
                  Axios API
                      │
        Django REST Framework
                      │
                  SQLite Database
```

---

## 🔄 System Workflow

```
Customer

    │

    ▼

Browse Menu

    │

    ▼

Select Table

    │

    ▼

Place Order

    │

    ▼

Kitchen Receives Order

    │

    ▼

Cooking

    │

    ▼

Ready to Serve

    │

    ▼

Cashier Processes Payment

    │

    ▼

Table Becomes Available
```

---

## 🛠️ Technology Stack

### Frontend

- React
- Vite
- Bootstrap
- Axios

### Backend

- Django
- Django REST Framework

### Database

- SQLite

### Authentication

- Django Authentication System

---

## 📂 Project Structure

```
Restaurant-Management-System/

├── backend/
│   ├── API
│   ├── Models
│   ├── Views
│   ├── Serializers
│   └── URLs
│
├── frontend/
│   ├── Components
│   ├── Pages
│   ├── Services
│   └── Assets
│
└── README.md
```

---

## 🚀 Installation

### Clone the repository

```bash
git clone https://github.com/trankhoi-03/Restaurant-Management-System.git

cd Restaurant-Management-System
```

---

### Backend Setup

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

python manage.py migrate

python manage.py runserver
```

---

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

## 📡 REST API Highlights

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/menu` | Retrieve menu items |
| GET | `/tables` | Retrieve available tables |
| POST | `/orders` | Create a new order |
| PUT | `/orders/{id}` | Update order status |
| GET | `/cashier/orders` | Retrieve completed orders |
| POST | `/payment` | Process customer payment |
| POST | `/login` | User authentication |

---

## 💡 Technical Highlights

- Full-stack architecture using React and Django REST Framework
- RESTful API design
- Role-Based Access Control (RBAC)
- Automatic table occupancy management
- Modular backend architecture
- Responsive frontend interface
- End-to-end restaurant order workflow
- Separation of frontend and backend services

---

## 🔮 Future Improvements

- Online table reservation
- QR code ordering
- Dashboard with sales analytics
- Receipt printing
- Inventory management
- Online payment integration
- Docker deployment
- JWT Authentication
- PostgreSQL support

---

## 👨‍💻 Author

**Tran Khoi**

GitHub: https://github.com/trankhoi-03

---

## 📄 License

This project is developed for educational and portfolio purposes.

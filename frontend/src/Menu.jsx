import React, { useState, useEffect } from "react";
import axios from 'axios'

function Menu() {
    const [meals, setMeals] = useState([])
    const [tables, setTables] = useState([])

    const [selectedTable, setSelectedTable] = useState('')
    const [customerName, setCustomerName] = useState('')
    const [guestCount, setGuestCount] = useState(1)
    const [specialRequests, setSpecialRequests] = useState('')
    const [quantities, setQuantities] = useState({})
    const [myOrder, setMyOrder] = useState({})

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/menu').then(res => setMeals(res.data))
        axios.get('http://127.0.0.1:8000/api/tables').then(res => setTables(res.data))
    }, [])

    useEffect(() => {
        if (!selectedTable) return

        const fetchStatus = () => {
            axios.get(`http://127.0.0.1:8000/api/orders/table/${selectedTable}/`)
                .then(res => setMyOrder(res.data))
                .catch(error => console.error(error))
        }

        fetchStatus()
        const interval = setInterval(fetchStatus, 3000)
        return () => clearInterval(interval)
    }, [selectedTable])

    const handleQuantityChange = (mealId, value) => {
        if (value < 1) return;
        setQuantities(prev => ({ ...prev, [mealId]: value }));
    };

    const getQuantity = (mealId) => quantities[mealId] || 1

    const getStatusBadge = (status, time) => {
        switch(status) {
            case 'pending':
                return <span className="badge bg-warning text-dark">⏳ Pending (Waiting for Cook)</span>;
            case 'cooking':
                return <span className="badge bg-primary">👨‍🍳 Cooking ({time} mins)</span>;
            case 'ready':
                return <span className="badge bg-success">✅ Ready to Serve!</span>;
            case 'paid':
                return <span className="badge bg-secondary">💰 Paid</span>;
            default:
                return <span className="badge bg-secondary">Unknown</span>;
        }
    };

    const handleOrder = (mealId, mealName) => {
        if (!selectedTable || !customerName) {
            alert("Please select a Table and enter your Name first")
            return
        }

        const quantity = getQuantity(mealId)

        const orderData = {
            customer_name: customerName,
            table: selectedTable,
            meal: mealId,
            special_requests: specialRequests,
            quantity: quantity
        }

        axios.post('http://127.0.0.1:8000/api/order/create/', orderData)
            .then(response => {
                alert(`Success! Ordered ${quantity} x ${mealName} for ${customerName}. Order ID: ${response.data.id}`);
                setSpecialRequests('');
            })
            .catch(error => {
                console.error("Order failed: ", error)
                alert("Something went wrong. Please try again.")
            })
    }

    return (
        <div className="container mt-4 mb-5">
            {/* --- CUSTOMER INFO SECTION --- */}
            <div className="card p-4 mb-5 bg-light border-0 shadow-sm">
                <h4 className="mb-3">👋 Welcome! Let's get you seated.</h4>
                <div className="row g-3">
                    <div className="col-md-3">
                        <label className="form-label">Name</label>
                        <input 
                            type="text" className="form-control" placeholder="Your Name"
                            value={customerName} onChange={(e) => setCustomerName(e.target.value)}
                        />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label">Guests</label>
                        <input 
                            type="number" className="form-control" min="1"
                            value={guestCount} onChange={(e) => setGuestCount(parseInt(e.target.value))}
                        />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Select Table</label>
                        <select 
                            className="form-select"
                            value={selectedTable} onChange={(e) => setSelectedTable(e.target.value)}
                        >
                            <option value="">-- Choose a Table --</option>
                            {tables
                                .filter(table => table.capacity >= guestCount)
                                .map(table => (
                                    <option key={table.id} value={table.id}>
                                        Table {table.table_number} (Fits {table.capacity})
                                    </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label className="form-label">Notes</label>
                        <input 
                            type="text" className="form-control" placeholder="Allergies?"
                            value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* --- MENU SECTION --- */}
            <h2 className="text-center mb-4">🍽️ Our Menu</h2>
            <div className="row">
                {meals.map(meal => (
                    <div key={meal.id} className="col-md-4 mb-4">
                        <div className="card shadow-sm h-100">
                            {meal.image && (
                                <img src={`http://127.0.0.1:8000${meal.image}`} className="card-img-top" alt={meal.name} style={{ height: '200px', objectFit: 'cover' }} />
                            )}
                            <div className="card-body">
                                <h5 className="card-title">{meal.name}</h5>
                                <p className="card-text text-muted">{meal.description}</p>
                                <div className="d-flex justify-content-between align-items-center mt-3">
                                    <span className="h4 text-success mb-0">${meal.price}</span>
                                    <div className="d-flex align-items-center">
                                        <button className="btn btn-sm btn-outline-secondary" onClick={() => handleQuantityChange(meal.id, getQuantity(meal.id) - 1)}>-</button>
                                        <span className="mx-2 fw-bold">{getQuantity(meal.id)}</span>
                                        <button className="btn btn-sm btn-outline-secondary" onClick={() => handleQuantityChange(meal.id, getQuantity(meal.id) + 1)}>+</button>
                                    </div>
                                </div>
                                <button className="btn btn-primary w-100 mt-3" onClick={() => handleOrder(meal.id, meal.name)}>
                                    Order {getQuantity(meal.id)} items 🛒
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- NEW: ORDER TRACKER SECTION --- */}
            {selectedTable && myOrder.length > 0 && (
                <div className="mt-5">
                    <h3 className="text-center mb-4">🧾 Your Order Status (Table {tables.find(t => t.id == selectedTable)?.table_number})</h3>
                    <div className="card shadow-sm">
                        <ul className="list-group list-group-flush">
                            {myOrder.map(order => (
                                <li key={order.id} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>{order.meal_details.name}</strong> (x{order.quantity})
                                        <br/>
                                        <small className="text-muted">For {order.customer_name}</small>
                                    </div>
                                    <div className="text-end">
                                        {getStatusBadge(order.status, order.estimated_time)}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Menu
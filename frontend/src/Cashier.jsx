import { useEffect, useState } from "react"
import axios from "axios"


function Cashier() {
    const [orders, setOrders] = useState([])

    const fetchOrders = () => {
        axios.get('http://127.0.0.1:8000/api/cashier/orders/')
            .then(res => setOrders(res.data))
            .catch(error => console.error(error))
    }

    useEffect(() => {
        fetchOrders()
        const interval = setInterval(fetchOrders, 3000)
        return () => clearInterval(interval)
    }, [])

    const handlePayment = (orderId) => {
        if (!window.confirm("Confirm payment received? This will free the tbale.")) return

        axios.post(`http://127.0.0.1:8000/api/cashier/pay/${orderId}/`)
            .then(() => {
                alert("Payment successful! Table is now free.")
                fetchOrders
            })
            .catch(error => console.error(error))
    }

    const calculateTotal = (price, quantity) => {
        return (parseFloat(price) * quantity).toFixed(2)
    }

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">💸 Cashier Dashboard</h2>

            {orders.length === 0 ? (
                <div className="alert alert-info text-center">No orders waiting for payment.</div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-hover shadow-sm">
                        <thead className="table-dark">
                            <tr>
                                <th>Order ID</th>
                                <th>Table</th>
                                <th>Customer</th>
                                <th>Order Details</th>
                                <th>Total Price</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id}>
                                    <td>#{order.id}</td>
                                    <td>
                                        <span className="badge bg-secondary">
                                            Table {order.table_number}
                                        </span>
                                    </td>
                                    <td>{order.customer_name}</td>
                                    <td>
                                        {order.meal_details.name} <br/>
                                        <small className="text-muted">Qty: {order.quantity}</small>
                                    </td>
                                    <td className="fw-bold text-success">
                                        ${calculateTotal(order.meal_details.price, order.quantity)}
                                    </td>
                                    <td>
                                        <button 
                                            className="btn btn-primary btn-sm"
                                            onClick={() => handlePayment(order.id)}
                                        >
                                            💰 Confirm Payment
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default Cashier
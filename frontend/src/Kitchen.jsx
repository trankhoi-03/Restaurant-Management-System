import axios from "axios"
import { useState } from "react"
import { useEffect } from "react"


function Kitchen() {
    const [orders, setOrders] = useState([])
    const [timeInputs, setTimeInputs] = useState({})

    const fetchOrders = () => {
        axios.get('http://127.0.0.1:8000/api/kitchen/orders/')
            .then(res => setOrders(res.data))
            .catch(error => console.error(error))
    }

    useEffect(() => {
        fetchOrders()
        const interval = setInterval(fetchOrders, 5000)
        return () => clearInterval(interval)
    }, [])

    const handleTimeChange = (orderId, value) => {
        setTimeInputs(prev => ({...prev, [orderId]: value}))
    }

    const startCooking = (orderId) => {
        const time = timeInputs[orderId]
        if (!time) {
            alert("Please enter estimated minutes first!")
            return
        }
        
        axios.post(`http://127.0.0.1:8000/api/kitchen/update/${orderId}/`, {
            status: 'cooking',
            estimated_time: time
        })
        .then(() => {
            fetchOrders()
        })
        .catch(error => console.error(error))
    }

    const markReady = (orderId) => {
        axios.post(`http://127.0.0.1:8000/api/kitchen/update/${orderId}/`, {
            status: 'ready'
        })
        .then(() => {
            fetchOrders()
        })
        .catch(error => console.error(error))
    }

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">👨‍🍳 Kitchen Dashboard</h2>
            
            {orders.length === 0 ? (
                <div className="alert alert-success text-center">No active orders. Good job!</div>
            ) : (
                <div className="row">
                    {orders.map(order => (
                        <div key={order.id} className="col-md-4 mb-4">
                            <div className={`card shadow-sm border-${order.status === 'cooking' ? 'primary' : 'warning'}`}>
                                <div className="card-header d-flex justify-content-between">
                                    <strong>Order #{order.id}</strong>
                                    <span className={`badge bg-${order.status === 'cooking' ? 'primary' : 'warning'}`}>
                                        {order.status.toUpperCase()}
                                    </span>
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title">{order.meal_details.name} (x{order.quantity})</h5>
                                    <p className="card-text">
                                        <strong>Table:</strong> {order.table_number}<br/>
                                        <strong>Guest:</strong> {order.customer_name}<br/>
                                        {order.special_requests && <span className="text-danger">Note: {order.special_requests}</span>}
                                    </p>
                                    
                                    <hr/>

                                    {/* LOGIC: IF PENDING, SHOW TIME INPUT */}
                                    {order.status === 'pending' && (
                                        <div>
                                            <div className="input-group mb-3">
                                                <input 
                                                    type="number" 
                                                    className="form-control" 
                                                    placeholder="Mins"
                                                    value={timeInputs[order.id] || ''}
                                                    onChange={(e) => handleTimeChange(order.id, e.target.value)}
                                                />
                                                <button 
                                                    className="btn btn-warning" 
                                                    onClick={() => startCooking(order.id)}
                                                >Start Cooking</button>
                                            </div>
                                        </div>
                                    )}

                                    {/* LOGIC: IF COOKING, SHOW READY BUTTON */}
                                    {order.status === 'cooking' && (
                                        <div className="text-center">
                                            <h4 className="text-primary mb-3">
                                                Est: {order.estimated_time} mins
                                            </h4>
                                            <button 
                                                className="btn btn-success w-100" 
                                                onClick={() => markReady(order.id)}
                                            >
                                                ✅ Mark as Ready
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Kitchen
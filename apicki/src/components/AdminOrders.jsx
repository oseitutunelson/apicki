import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import classes from "./AdminOrders.module.css";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchOrders();

    // Subscribe to new orders
    const subscription = supabase
      .channel('orders')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => {
          setOrders((prevOrders) => [payload.new, ...prevOrders]);
          setNotification(`New order received from ${payload.new.user_data.name}`);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      alert("Failed to fetch orders: " + error.message);
      setLoading(false);
      return;
    }
    setOrders(data);
    setLoading(false);
  };

  const markAsDelivered = async (orderId) => {
    setUpdatingOrderId(orderId);
    const { error } = await supabase
      .from("orders")
      .update({ status: "delivered" })
      .eq("id", orderId);
    if (error) {
      alert("Failed to update order status: " + error.message);
      setUpdatingOrderId(null);
      return;
    }
    await fetchOrders();
    setUpdatingOrderId(null);
  };

  if (loading) {
    return <p>Loading orders...</p>;
  }

  return (
    <div className={classes.container}>
      <h1 className={classes.aheader}>Admin Orders Dashboard</h1>
      {notification && (
        <div className={classes.notification}>
          {notification}
          <button onClick={() => setNotification(null)}>Dismiss</button>
        </div>
      )}
      <table className={classes.ordersTable}>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User Info</th>
            <th>Order Items</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 && (
            <tr>
              <td colSpan="6">No orders found.</td>
            </tr>
          )}
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>
                <div><strong>Name:</strong> {order.user_data.name}</div>
                <div><strong>Email:</strong> {order.user_data.email}</div>
                <div><strong>Location:</strong> {order.user_data.location}</div>
              </td>
              <td>
                <ul>
                  {order.orderitems.map((item, index) => (
                    <li key={index}>
                      {item.name} x {item.amount} (₵{item.price})
                    </li>
                  ))}
                </ul>
              </td>
              <td>{order.status}</td>
              <td>{new Date(order.created_at).toLocaleString()}</td>
              <td>
                {order.status !== "delivered" && (
                  <button
                    onClick={() => markAsDelivered(order.id)}
                    disabled={updatingOrderId === order.id}
                  >
                    {updatingOrderId === order.id ? "Updating..." : "Mark as Delivered"}
                  </button>
                )}
                {order.status === "delivered" && <span>Delivered</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders;

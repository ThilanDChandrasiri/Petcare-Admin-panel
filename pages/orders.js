import Layout from "@/components/Layout";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";

export default function OrdersPage (){
    const [orders,setOrders] = useState([]);
    useEffect(()=> {
        axios.get('/api/orders').then(response => {
            setOrders(response.data);
        });
    }, []);
    return(
        <Layout>
            <div className="h-screen">
            <h1>Orders</h1>
            <table className="basic">
                <thead>
                    <tr className="text-left">
                        <th className="theadleft">Date</th>
                        <th>Paid</th>
                        <th>Recipient</th>
                        <th className="theadright">Products</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 && orders.map(order => (
                        <tr>
                            <td>{(new Date(order.createdAt)).toLocaleString()}</td>
                            <td className={order.paid? 'text-green-400' : 'text-red-600'}>
                                {order.paid ? 'YES' : 'NO'}
                            </td>
                            <td>{order.name} {order.email} <br/>
                            {order.city} {order.postalCode} {order.country}<br/>
                            {order.streetAddress}
                            </td>
                            <td>
                            {order.line_items.map(l => (
                                <>
                                {l.price_data?.product_data.name} x {l.quantity} <br/>
                                
                                </>
                            ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </Layout>
    );
}
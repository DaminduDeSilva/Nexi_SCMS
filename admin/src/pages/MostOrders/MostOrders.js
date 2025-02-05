import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './MostOrders.css';

function MostOrders() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch data from backend when the component mounts
    useEffect(() => {
        const fetchProductOrders = async () => {
            try {
                const response = await axios.get('/manager/productOrders', {
                    withCredentials: true 
                });
                
                setProducts(response.data); // Assuming API returns data in correct format
                setLoading(false);
            } catch (error) {
                console.error('Error fetching product orders:', error);

                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    // Redirect to login if unauthorized
                    navigate('/');
                } else {
                    setError('Error fetching data. Please try again later.');
                }
                setLoading(false);
            }
        };

        fetchProductOrders();
    }, [navigate]); // Include navigate as a dependency for useEffect

    // Function to download table as PDF
    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text("Products with Most Orders", 20, 10);

        doc.autoTable({
            startY: 20,
            head: [['Product ID', 'Product Name', 'Total Sales']],
            body: products.map(product => [
                product.Product_ID,
                product.Product_Name,
                product.Total_sales
            ]),
        });

        doc.save("most-orders.pdf");
    };

    return (
        <div className="most-orders-container">
            <div className="content">
                <div className="table-container">
                    <h2>Products with Most Orders</h2>
                    
                    <button onClick={downloadPDF} className="download-btn">Download PDF</button>

                    {loading ? (
                        <p>Loading data...</p>
                    ) : error ? (
                        <p>{error}</p>
                    ) : (
                        <table className="modern-table">
                            <thead>
                                <tr>
                                    <th>Product ID</th>
                                    <th>Product Name</th>
                                    <th>Total Sales</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product => (
                                    <tr key={product.Product_ID}>
                                        <td>{product.Product_ID}</td>
                                        <td>{product.Product_Name}</td>
                                        <td>{product.Total_sales}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MostOrders;
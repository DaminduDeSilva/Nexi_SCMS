import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Default styles for the calendar
import './Admindashboard.css';
import { useNavigate } from "react-router-dom";

function Admindashboard() {

  const navigate = useNavigate();

  const [storeID, setStoreID] = useState('');
  const [storeCity, setStoreCity] = useState('');

  const [activeUsers, setActiveUsers] = useState(0);
  const [incompleteOrders, setIncompleteOrders] = useState(0);
  const [date, setDate] = useState(new Date());
  const [incompleteOrdersList, setIncompleteOrdersList] = useState([]);


  useEffect(() => {
    axios.get("/admin/profile",{withCredentials:true})
    .then((response) => {
    })
    .catch((error) => {
      navigate("/"); 
        console.error("Error fetching customer profile:", error);
    });
  }, []); 

  useEffect(() => {
    const fetchData = async () => {
      try { 
        await axios.get('admin/admindetails', { withCredentials: true })
          .then((res) => {
            setStoreID(res.data.Store_ID);
            setStoreCity(res.data.City);
          });
  
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };


    fetchData();
    setActiveUsers(50);
    setIncompleteOrders(20);
    setIncompleteOrdersList([
      { id: 1, customer: 'John Doe', status: 'Pending', routeId: 'R001', orderedDate: '2023-10-01' },
      { id: 2, customer: 'Jane Smith', status: 'In Progress', routeId: 'R002', orderedDate: '2023-10-02' },
      { id: 3, customer: 'Bob Johnson', status: 'Pending', routeId: 'R003', orderedDate: '2023-10-03' },
      { id: 4, customer: 'Alice Brown', status: 'In Progress', routeId: 'R004', orderedDate: '2023-10-04' },
    ]);
  }, []);


  return (
    <div className='ADcontainer'>
      <div className='Acontainer'>

        <div className='store-info'>
          <h2>Store ID: <span>{storeID}</span></h2>
          <h2>Store City: <span>{storeCity}</span> </h2>
        </div>
        <div className='widgets-row'>
          <div className='widget available-drivers'>
            <p>{activeUsers}%</p>
            <div className='progress-bar' style={{ width: '100%'}}>
              <div className='progress' style={{ width: `${(activeUsers / 100) * 100}%` }}></div>
            </div>
            <h3>Available Drivers</h3>
          </div>
          <div className='widget available-assistants'>
            <p>{incompleteOrders}%</p>
            <div className='progress-bar'>
              <div className='progress' style={{ width: `${(incompleteOrders / 100) * 100}%` }}></div>
            </div>
            <h3>Available Assistants</h3>
          </div>
          <div className='widget available-trucks'>
            <p>{incompleteOrders}%</p>
            <div className='progress-bar'>
              <div className='progress' style={{ width: `${(incompleteOrders / 100) * 100}%` }}></div>
            </div>
            <h3>Available Trucks</h3>
          </div>
        </div>
        <div className='calender-order-container'>
          <div className='calendar-container'>
            <Calendar onChange={setDate} value={date} />
          </div>
          <div className='incomplete-order-container'>
              <div className='incomplete-orders'>
                <p>{incompleteOrders}%</p>
                <div className='progress-bar'>
                  <div className='progress' style={{ width: `${(incompleteOrders / 100) * 100}%` }}></div>
                </div>
                <h3>Incomplete Orders</h3>
            </div>
            <div className='incomplete-orders-table'>
              <table className='orders-table'>
                <thead>
                  <tr>
                    <th className='table-header'>Order ID</th>
                    <th className='table-header'>Customer ID</th>
                    <th className='table-header'>Route ID</th>
                    <th className='table-header'>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {incompleteOrdersList.map(order => (
                    <tr key={order.id} className='table-row'>
                      <td className='table-data'>{order.id}</td>
                      <td className='table-data'>{order.customer}</td>
                      <td className='table-data'>{order.routeId}</td>
                      <td className='table-data'>{order.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>


          </div>
          
        </div>     

      </div>
    </div>
  );
}

export default Admindashboard;

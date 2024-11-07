import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../components/Loader/Loader';
import { FaCheck } from 'react-icons/fa';
import { FaUserLarge } from "react-icons/fa6";
import { IoOpenOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import SeeUserData from './SeeUserData';

const AllOrders = () => {
  const [orders, setOrders] = useState(null); // Changed state variable name for clarity
  const [selectedOption, setSelectedOption] = useState(-1);
  const [statusValue, setStatusValue] = useState({ status: "" });
  const [userDiv, setuserDiv] = useState("hidden");
  const [userDivData, setuserDivData] = useState();

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:1000/api/v1/get-all-orders", { headers });
        console.log("Fetched orders:", response.data.data); // Log response data
        setOrders(response.data.data);
      } catch (error) {
        console.error("Error fetching orders:", error.response?.data || error.message);
      }
    };
    fetchOrders();
  }, []); // Avoid re-render loop

  const handleChange = (e) => {
    setStatusValue({ status: e.target.value });
  };

  const submitChanges = async (i) => {
    const orderId = orders[i]._id;
    try {
      const response = await axios.put(`http://localhost:1000/api/v1/update-status/${orderId}`, statusValue, { headers });
      alert(response.data.message);

      // Update the status locally for immediate UI feedback
      setOrders((prevOrders) =>
        prevOrders.map((order, index) =>
          index === i ? { ...order, status: statusValue.status } : order
        )
      );
    } catch (error) {
      console.error("Error updating status:", error.response?.data || error.message);
    }
  };

  // Log orders to verify data is loaded
  console.log("Orders:", orders);

  return (
    <>
      {!orders && (
        <div className="h-[100%] flex items-center justify-center">
          <Loader />
        </div>
      )}
      {orders && orders.length > 0 && (
        <div className="h-[100%] p-0 md:p-4 text-zinc-100">
          <h1 className="text-3xl md:text-5xl font-semibold text-zinc-500 mb-8">All Orders</h1>
          <div className="mt-4 bg-zinc-800 w-full rounded py-2 px-4 flex gap-2">
            <div className="w-[3%]"><h1 className="text-center">Sr.</h1></div>
            <div className="w-[40%] md:w-[22%]"><h1>Books</h1></div>
            <div className="w-0 md:w-[45%] hidden md:block"><h1>Descriptions</h1></div>
            <div className="w-[17%] md:w-[9%]"><h1>Price</h1></div>
            <div className="w-[30%] md:w-[16%]"><h1>Status</h1></div>
            <div className="w-[10%] md:w-[5%]"><h1><FaUserLarge /></h1></div>
          </div>
          {orders.map((order, i) => (
            <div
              key={i}
              className="bg-zinc-800 w-full rounded py-2 px-4 flex gap-2 transition-all duration-300 hover:bg-zinc-700"
            >
              <div className="w-[3%]"><h1 className="text-center">{i + 1}</h1></div>
              <div className="w-[40%] md:w-[22%]">
                <Link to={`/view-book-details/${order.book._id}`} className="hover:text-blue-300 transition-colors duration-200">
                  {order.book.title}
                </Link>
              </div>
              <div className="w-0 md:w-[45%] hidden md:block">
                <h1>{order.book.desc.slice(0, 50)}...</h1>
              </div>
              <div className="w-[17%] md:w-[9%]"><h1>₹ {order.book.price}</h1></div>
              <div className="w-[30%] md:w-[16%]">
                <button
                  className="font-semibold hover:scale-105 transition-transform duration-300"
                  onClick={() => setSelectedOption(i)}
                >
                  {order.status === "Order Placed" ? (
                    <div className="text-yellow-500">{order.status}</div>
                  ) : order.status === "Cancelled" ? (
                    <div className="text-red-500">{order.status}</div>
                  ) : (
                    <div className="text-green-500">{order.status}</div>
                  )}
                </button>
                {selectedOption === i && (
                  <div className="flex mt-4">
                    <select name="status" className="bg-gray-800" onChange={handleChange} value={statusValue.status}>
                      {["Order placed", "Out of delivery", "Delivered", "Cancelled"].map((status, index) => (
                        <option value={status} key={index}>{status}</option>
                      ))}
                    </select>
                    <button className="text-green-500 hover:text-pink-600 mx-2" onClick={() => { setSelectedOption(-1); submitChanges(i); }}>
                      <FaCheck />
                    </button>
                  </div>
                )}
              </div>
              <div className="w-[10%] md:w-[5%]">
                <button
                  className="text-xl hover:text-yellow-500 transition-colors duration-200"
                  onClick={() => {
                    setuserDiv("fixed");
                    setuserDivData(order.user); // Correcting here to use order.user
                  }}
                >
                  <IoOpenOutline />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {userDivData && (
        <SeeUserData
          userDivData={userDivData}
          userDiv={userDiv}
          setuserDiv={setuserDiv}
        />
      )}
    </>
  );
};

export default AllOrders;


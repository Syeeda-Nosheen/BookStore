import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../Loader/Loader';
import { Link } from 'react-router-dom';

const UserOrderHistory = () => {
  const [OrderHistory, setOrderHistory] = useState(null); // Initialize with null to differentiate between loading and empty

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get("http://localhost:1000/api/v1/get-order-history", { headers });
        setOrderHistory(response.data.data); // Set data here to trigger re-render
      } catch (error) {
        console.error("Error fetching order history:", error);
      }
    };
    fetch();
  }, []);

  return (
    <>
      {!OrderHistory && (
        <div className='flex items-center justify-center h-[100%]'>
          <Loader />
        </div>
      )}

      {OrderHistory && OrderHistory.length === 0 && (
        <div className='h-[80vh] p-4 text-zinc-100'>
          <div className='h-[100%] flex flex-col items-center justify-center'>
            <h1 className='text-5xl font-semibold text-zinc-500 mb-8'>No Order History</h1>
            <img src="https://cdn.dribbble.com/users/721524/screenshots/4102371/no_notifisations_1x.png" alt="image" className='h-[20vh] mb-8' />
          </div>
        </div>
      )}

      {OrderHistory && OrderHistory.length > 0 && (
        <div className='h-[100%] p-0 md:p-4 text-zinc-100'>
          <h1 className='text-3xl md:text-5xl font-semibold text-zinc-500 mb-8'>Your Order History</h1>
          <div className='mt-4 bg-zinc-800 w-full rounded py-2 px-4 flex gap-2'>
            <div className='w-[3%]'>
              <h1 className='text-center'>Sr.</h1>
            </div>
            <div className='w-[22%]'>
              <h1>Books</h1>
            </div>
            <div className='w-[45%]'>
              <h1>Descriptions</h1>
            </div>
            <div className='w-[9%]'>
              <h1>Price</h1>
            </div>
            <div className='w-[16%]'>
              <h1>Status</h1>
            </div>
            <div className='w-none md:w-[5%] hidden md:block'>
              <h1>Mode</h1>
            </div>
          </div>
          {OrderHistory.map((items, i) => (
            <div
              key={items._id} // Add a unique key here
              className='bg-zinc-800 w-full rounded py-2 px-4 flex gap-4 hover:bg-zinc-900 hover:cursor.pointer'
            >
              <div className='w-[3%]'>
                <h1 className='text-center'>{i + 1}</h1>
              </div>
              <div className='w-[22%]'>
                <Link to={`/view-book-details/${items.book._id}`} className='hover:text-blue-300'>
                  {items.book.title}
                </Link>
              </div>
              <div className='w-[45%]'>
                <h1>{items.book.desc.slice(0, 50)}...</h1>
              </div>
              <div className='w-[9%]'>
                <h1>₹ {items.book.price}</h1>
              </div>
              <div className='w-[16%]'>
                <h1 className='font-semibold text-green-500'>
                  {items.status === "Order Placed" ? (
                    <div className='text-green-500'>{items.status}</div>
                  ) : items.status === "Cancelled" ? (
                    <div className='text-red-500'>{items.status}</div>
                  ) : (
                    items.status
                  )}
                </h1>
              </div>
              <div className='w-none md:w-[5%] hidden md:block'>
                <h1 className='text-sm text-zinc-400'>COD</h1>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default UserOrderHistory;

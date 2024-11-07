import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../Loader/Loader';
import { useNavigate, useParams } from 'react-router-dom';
import { GrLanguage } from "react-icons/gr";
import { FaHeart } from "react-icons/fa";
import { BsCartCheckFill } from "react-icons/bs";
import { useSelector } from 'react-redux';
import { FaUserEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { Link } from 'react-router-dom';

const ViewBookDetails = () => {
   const {id} = useParams();
   const [Data, setData] = useState([]);
   const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // New state to manage loading
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoQ2xhaW1zIjpbeyJuYW1lIjoiYWRtaW4ifSx7InJvbGUiOiJhZG1pbiJ9XSwiaWF0IjoxNzI5NTI5ODQxLCJleHAiOjE3MzIxMjE4NDF9.vm-uG9bkO8UvbfDVzELPg7uJrdUh5bXemZsGxFthN5I'; // Replace with the actual token
const isLoggedIn = useSelector((state)=> state.auth.isLoggedIn);
const role = useSelector((state)=> state.auth.role);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:1000/api/v1/get-book-by-id/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add Authorization header with token
          },
        });
        console.log(response);
        setData(response.data.data); // Set the received data
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        setLoading(false); // Set loading to false even if there is an error
        if (error.response && error.response.status === 401) {
          console.error("Unauthorized: Invalid or missing token");
        } else {
          console.error("Error fetching the data", error);
        }
      }
    };
    fetchData();
  }, [token]); // Add token as a dependency to refetch if token changes
   const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
    bookid: id,
  };
  const handleFavourite = async () => {
      const response = await axios.put(
        "http://localhost:1000/api/v1/add-book-to-favourite",
        {},
        {headers}
      );
      alert(response.data.message);
  };
  const handleCart = async ()=>{
    const response = await axios.put("http://localhost:1000/api/v1/add-to-cart",{},{headers});
    alert(response.data.message);
  };
  const deleteBook = async()=>{
   const response = await axios.delete("http://localhost:1000/api/v1/delete-book",{headers});
   alert(response.data.message);
   navigate("/All Books");
  };
  return (
    <>
      {loading ? ( // Check if loading
        <div className='h-screen bg-zinc-900 flex items-center justify-center'>
          <Loader />
        </div>
      ) : Data ? ( // Check if Data is available
        <div className='px-4 md:px-12 py-8 bg-zinc-900 flex flex-col lg:flex-row gap-8'>
          <div className='p-4 w-full lg:w-3/6 '>
          {" "}
          <div className='flex flex-col lg:flex-row justify-around bg-zinc-800 py-12 rounded '>
          <img src={Data.url} alt="/" className='h-[50vh] md:h-[60vh] lg:h-[70vh] rounded' />
           {isLoggedIn === true && role === "user" && (
            <div className='flex flex-col md:flex-row lg:flex-col item-center justify-between lg:justify-start mt-4 lg:mt-0'>
            <button className='bg-white rounded lg:rounded-full text-4xl lg:text-3xl p-3 text-red-500 flex items-center justify-center' 
            onClick={handleFavourite}>
            <FaHeart />{" "}
            <span className='ms-4 block lg:hidden'>Favourites</span>
            </button>
            <button className='text-white rounded mt-8 md:mt-0 lg:rounded-full text-4xl lg:text-3xl p-3 lg:mt-8 bg-blue-500 flex items-center justify-center'
            onClick={handleCart}
            >
            <BsCartCheckFill /><span className='ms-4 block lg:hidden'> Add to cart</span>
            </button>
          </div>
           )}
           {isLoggedIn === true && role === "admin" && (
            <div className='flex flex-col md:flex-row lg:flex-col item-center justify-between lg:justify-start mt-4 lg:mt-0'>
            <Link to={`/UpdateBook/${id}`} className='bg-white rounded mt-8 md:mt-0 lg:rounded-full text-4xl lg:text-3xl p-3 flex items-center justify-center'>
            <FaUserEdit /><span className='ms-4 block lg:hidden'>Edite</span>
            </Link>
            <button className='text-red-500 rounded lg:rounded-full text-4xl lg:text-3xl p-3 lg:mt-8 bg-white flex items-center justify-center'
            onClick={deleteBook}
            >
            <RiDeleteBin5Line /><span className='ms-4 block lg:hidden'>Delete Book</span>
            </button>
          </div>
           )}
          </div>
           </div>
          <div className='p-4 w-full lg:w-3/6'>
            <h1 className='text-4xl text-zinc-300 font-semibold'>{Data.title}</h1>
            <p className='mt-1 text-zinc-400'>by {Data.author}</p>
            <p className='mt-4 text-zinc-500 text-xl'>{Data.desc}</p>
            <p className='flex mt-4 items-center justify-start text-zinc-400'>
              <GrLanguage className="me-3" /> {Data.language}
            </p>
            <p className='mt-4 text-zinc-100 text-3xl font-semibold'>Price: ₹ {Data.price}</p>
          </div>
        </div>
      ) : (
        <div className='h-screen bg-zinc-900 flex items-center justify-center'>
          <p className='text-white'>No book details found.</p>
        </div>
      )}
    </>
  );
};
  export default ViewBookDetails;  
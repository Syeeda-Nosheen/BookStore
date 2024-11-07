import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../components/Loader/Loader';
import BookCard from '../components/BookCard/BookCard';
const AllBooks = () => {
  const [Data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // New state to manage loading
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoQ2xhaW1zIjpbeyJuYW1lIjoiYWRtaW4ifSx7InJvbGUiOiJhZG1pbiJ9XSwiaWF0IjoxNzI5NTI5ODQxLCJleHAiOjE3MzIxMjE4NDF9.vm-uG9bkO8UvbfDVzELPg7uJrdUh5bXemZsGxFthN5I'; // Replace with the actual token

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:1000/api/v1/get-all-books", {
          headers: {
            Authorization: `Bearer ${token}`, // Add Authorization header with token
          },
        });
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

  return (
    <div className='bg-zinc-900 h-auto px-12 py-8'>
      <h4 className='text-3xl text-yellow-100'>All Books</h4>

{loading ? ( // Show loader while loading is true
  <div className='flex items-center justify-center my-8'>
    <Loader />
  </div>
) : (
  <div className='my-8 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-8'>
    {Data && Data.length > 0 ? (
      Data.map((item, i) => (
        <div key={i}> 
          <BookCard data={item} />
        </div>
      ))
    ) : (
      <p className="text-yellow-100">No books found.</p> // Display message if no data is found
    )}
  </div>
)}
    </div>
  );
}

export default AllBooks;

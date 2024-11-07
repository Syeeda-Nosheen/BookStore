import axios from 'axios';
import React, { useState, useEffect } from 'react';
import BookCard from "../BookCard/BookCard";

const Favourites = () => {
  const [FavouriteBooks, setFavouriteBooks] = useState(null);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() =>  {
    const fetch = async () => {
      const response = await axios.get("http://localhost:1000/api/v1/get-favourite-books", { headers });
      setFavouriteBooks(response.data.data);
    };
    fetch();
  }, []);

  return (
    <>
      {/* No Favourites Section */}
      {FavouriteBooks && FavouriteBooks.length === 0 && (
        <div className='text-3xl md:text-5xl font-semibold h-full text-zinc-500 flex items-center justify-center flex-col w-full'>
          No Book In Favourites
          <img src="./star.png" alt="star" className='h-[15vh] md:h-[20vh] my-8'/>
        </div>
      )}

      {/* Favourite Books Section */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 p-4'>
        {FavouriteBooks && FavouriteBooks.map((item, i) => (
          <div key={i}>
            <BookCard data={item} Favourite={true}/>
          </div>
        ))}
      </div>
    </>
  );
}

export default Favourites;

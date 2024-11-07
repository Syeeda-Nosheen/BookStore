import React, { useEffect } from 'react';
import Home from './pages/Home';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/footer/footer';
import {  Routes, Route } from "react-router-dom";
import AllBooks from './pages/AllBooks';
import LogIn from './pages/LogIn';
import SignUp from './pages/SignUp';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import ViewBookDetails from './components/ViewBookDetails/ViewBookDetails';
import { useSelector } from 'react-redux';
import { authActions } from './store/auth';
import { useDispatch } from 'react-redux';
import Favourites from './components/Profile/Favourites';
import UserOrderHistory from './components/Profile/UserOrderHistory';
import Settings from './components/Profile/Settings';
import AllOrders from './pages/AllOrders';
import AddBook from './pages/AddBook';
import UpdateBook from './pages/UpdateBook';

const App = () => {
  const dispatch = useDispatch();
  const role = useSelector((state)=> state.auth.role);
  useEffect(()=> {
    if (
      localStorage.getItem("id") &&
      localStorage.getItem("token") &&
      localStorage.getItem("role")
    ) {
      dispatch(authActions.login());
      dispatch(authActions.changeRole(localStorage.getItem("role")));
    }
  },[]);
 
           
            
  return (
  <div>
    <Navbar/>
    <Routes>
      <Route exact path="/" element={<Home/>} />
      <Route  path="/All Books" element={<AllBooks/>} />
      <Route  path="/Cart" element={<Cart/>} />
      <Route  path="/Profile" element={<Profile/>} >
      {role === "user" ? (
        <Route index element={<Favourites/>}/> 
      ): (
      <Route index element={<AllOrders/>}/>
    )}
    {role === "admin" && (
      
      <Route path="/Profile/add-book" element={<AddBook/>} />
     )}
      <Route path="/Profile/orderHistory" element={<UserOrderHistory/>} />
      <Route path="/Profile/settings" element={<Settings/>}/>
      </Route>
      <Route  path="/LogIn" element={<LogIn/>} />
      <Route  path="/SignUp" element={<SignUp/>} />
      <Route  path="/UpdateBook/:id" element={<UpdateBook/>} />
      <Route  path="view-book-details/:id" element={<ViewBookDetails/>} />
    </Routes>
    <Footer/>
</div>
  )
};

export default App;


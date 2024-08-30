import './App.css';
import React, { useState, useEffect } from 'react';
import {Route, Routes, Link, Navigate} from "react-router-dom"
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
import {Navigation} from './components/navigationComponent';
import RuokaKategoria from './pages/UusiResepti';
import { HomePage } from './pages/homepage';
import SearchPage from './pages/SearchPage';
import {ProfilePage} from './pages/ProfilePage';
import { useAuthContext } from "./hooks/useAuthContext";
import ShowRecipe from './pages/ShowRecipe';
import { AdminPage } from './pages/AdminPage';
import { EditRecipePage } from './pages/EditRecipePage';
import LostPassword from './pages/LostPasswordPage';
import {PasswordChangePage} from './pages/PasswordChangePage'
function App() {
  const {user} = useAuthContext()
  //Navigatio komponentti on vaan testausta varten, voi poistaa
  //localStorage.clear()
  return (
    <div>
      <Navigation/>
      <Routes>
        <Route path="*" element={<HomePage/>} />
        <Route path='/' element={<HomePage></HomePage>}></Route>
        <Route path="/SearchPage" element={<SearchPage></SearchPage>}></Route>

        <Route path='/Recipe/:recipeId' element={<ShowRecipe></ShowRecipe>}></Route>
        {!user && (<>
        <Route path="/RegisterPage" element={<RegisterPage></RegisterPage>}></Route>
        <Route path="/LoginPage" element={<LoginPage></LoginPage>}></Route>
        <Route path='/Password' element={<LostPassword></LostPassword>}></Route>
        </>)}      
        {user && (<>
        <Route path='/changepassword/:userId' element={<PasswordChangePage></PasswordChangePage>}></Route>
        <Route path='/NewRecipe' element={<RuokaKategoria></RuokaKategoria>}></Route>
        <Route path="/userrecipe/:id" element={<EditRecipePage></EditRecipePage>} />
        <Route path='/ProfilePage' element={<ProfilePage></ProfilePage>}></Route>
        {user.role === 1  && (<Route path='/AdminPage' element={<AdminPage></AdminPage>}></Route>)}</>)}
      </Routes>
    </div>
  );
}

export default App;

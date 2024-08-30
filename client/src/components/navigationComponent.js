import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Link ,NavLink} from 'react-router-dom';
import '../styles/styles.css'
import { useAuthContext } from "../hooks/useAuthContext";
const Navigation = (props) => {
  const {dispatch, user} = useAuthContext()
  const [isOpen, setIsOpen] = useState(false);
  const logout = () => {
    // remove user from storage
    localStorage.removeItem('user');

    dispatch({type: 'LOGOUT'})
  }

  const handleClick = () => {
    logout();
  }

  const toggleMenu = () => {
    setIsOpen((open) => !open);
  }


  return(
    <nav className={`navigation ${isOpen ? 'is-open' : ""}`}>
        <NavLink exact to="/" className="home" activeClassName="active"></NavLink>
    <button className='trigger' onClick={toggleMenu}></button>
      <ul className={`navigation-list ${isOpen ? 'is-open' : ""}`}>
        <li className="navigation-item">
        <NavLink exact to="/" className="navigation-link" activeClassName="active" id="home"></NavLink>
        </li>
        <li>
          
        </li>
        {user && (<li className="navigation-item">
        <NavLink to="/ProfilePage" className="navigation-link" activeClassName="active">Oma profiili</NavLink>
        </li>)}
        <li className="navigation-item navright">
        <NavLink to="/SearchPage" className="navigation-link" activeClassName="active">Haku</NavLink>
        </li>
        {!user && (<><li className="navigation-item ">
        <NavLink to="/RegisterPage" className="navigation-link" activeClassName="active">Rekisteröidy</NavLink>
        </li>
        <li className="navigation-item">
        <NavLink to="/LoginPage" className="navigation-link" activeClassName="active">Kirjaudu</NavLink>
        </li>
        </>)}
          {user && (<>
        <li className="navigation-item">
        <NavLink to="/NewRecipe" className="navigation-link" activeClassName="active">Uusi resepti</NavLink>
          </li>
          <div className='navigation-item-1'>{user.role === 1  && (<NavLink to="/AdminPage" className="navigation-link" activeClassName="active">Ylläpito</NavLink>)}<button className='logout' onClick={handleClick}>Kirjaudu ulos</button></div></>)}
      </ul>
      <div className='logo'></div>
    </nav>
  )
};
  

export  {Navigation};
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import SoundCloudIcon from "../../../src/Images/SoundCloudTitlePage.png"

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <ProfileButton user={sessionUser} />
    );
  } else {
    sessionLinks = (
      <>
        <NavLink to="/login">Log In</NavLink>
        <NavLink to="/signup">Sign Up</NavLink>
      </>
    );
  }

  return (
      <ul className='header'>
      <li className='nav-menu'>
      <NavLink exact to="/"><a href="" className="icon"><img className="icon" src="https://a-v2.sndcdn.com/assets/images/peace-cloud-28ad0963.svg" alt=""/></a></NavLink>
        {isLoaded && sessionLinks}
      </li>
      <li className="nav-menu">
        <NavLink exact to="/">Home</NavLink>
        {isLoaded && sessionLinks}
      </li>
    </ul>
  );
}

export default Navigation;
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = () => {
      setShowMenu(false);
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  return (
    <>
      <div className="user-info">
        <div className='btn-username'>
          <button className="profile-btn" onClick={openMenu}>
          {/* <span style={{fontSize: 25px;}}> */}
            <i className="fas fa-user-circle fa-2xl" style={{color: "rgb(255, 255, 255)"}} />
            {/* </span> */}
          </button>
          {user.username}
        </div>
        {showMenu && (
          <ul className="profile-dropdown">
            {/* <li id='drp-dn-info'>{user.email}</li> */}
            <li id='sign-out'>
              <button className='sign-out-btn' onClick={logout}>Sign Out</button>
            </li>
          </ul>
        )}
      </div>
    </>
  );
}

export default ProfileButton;

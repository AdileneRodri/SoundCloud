import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <ProfileButton user={sessionUser} />
    );
  } else {
    sessionLinks = (
      <>
        <LoginFormModal />
        <SignupFormModal />
      </>
    );
  }

  return (
    <ul role='banner' className="header">
      {/* <li className="nav-menu">
        <NavLink exact to="/">
          <a href="" className="icon">
            <img
              className="icon"
              src="https://a-v2.sndcdn.com/assets/images/peace-cloud-28ad0963.svg"
              alt=""
            />
          </a>
        </NavLink>
        {isLoaded && sessionLinks}
      </li> */}
      <li>
        <NavLink exact to="/">
          <div id='home-btn'>
            <img
              className="icon"
              src="https://a-v2.sndcdn.com/assets/images/peace-cloud-28ad0963.svg"
              alt=""
            />
            <img
              className="icon"
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHMAAAAWCAQAAABZc2uEAAADSUlEQVR4Ae3VbWiVZRgH8Gtrp6aZ017UiSMy06zQLyORYpCEiSl+yMSgIEpdGgjZgl5MLDItkSIbRZwEZfQCRSUppKhpINGw0vyS+Uk0tZSM4+pMt/2CeLihneOOFPRBzvX/sHNf983N9XueBxb/X1WrWtWqVrVc7XmbfeI5N4uU2dpts9701LlDXltarZN3gxAelfdQ1r1WXrsQJsv/nbUWu1FI0WSFzd5xv6tEumGW6JfxVtmiw+NyFSZ4S15euzbThJCSfhjtGIA/LBRCrQ0AeC07+TB2iizHMUUIm1B0qxDGoit7TACcs05kudspAF+rTzcs74ec5yyATqMGnKAIgN3GlGOuw2GtFtmh25x0XZ92j/gA3FuRSafLSpg/e9Jqe0CrEIY6iW8sttIZvVqVZ45UwB6LvKgLGysy11iuQze2l2N+ig4h1JiY9Q7jBZFG2Ksyk2dLmPuzs6/glBCewYnsHTYbL5RnrsZ+demmPk0VmBOEcLteTCtlLgedVhqXdYZAevVTUajI/BzdblOe2QAahY/TQ00py9yKZWl1FDMuihm+wNJSZn32qmG3ccIk9KjJ9keB6yowl9mEfcaVZYbTaBH2Y6HKzB9xX1p9hSUXyXwb6/sxs4zQZqdefCeMAQ3Z3gSclxPmZ/sh1ClgUhqyzXDH8GZZZk4Pxgo78arKzL1YkFYHMK/8BCXMj/B0OWZd9ncOGK5GF+Zm3cdwSAjN6DNCCC1giMQUZqK3LPNBnFGTPev0KRtyQeZGfJj+F3Rj8gATJKYRfsf0UuZ8x8w1SE4relwhvIsjpqjV4iRWCOFKv+F1l5tsBw6IfzDDBpCYDhrmFk8o4GUh3AmeMtj1djlqRrphjZFZrhHuQa8l6o22Dd+rHWCCIpo1me0gflDfn5nzJehRBO8LodEpcB78ZHB2einoBswsYTY4gsQEwPb0zbwHesBpN6UbAPhWCJ+Rzp1z14ATFAHwq4lCYiaotQ7pQ5c3DM26Y2zxJwo6DBMpCxwHh80SJcwwvYR53C4PqEmna61wAmdtNVVckFnnJb+gR6fmChMUQcE+qzSIEmbKcI3SKFnqNKkVJRmZ4P8+jXJC5Yw26L9MEC6lVJmXTqrMvwBTThqYRlj40wAAAABJRU5ErkJggg=="
              alt=""
            />
            {/* <div className="icon">SOUNDCLOUD</div> */}
          </div>
        </NavLink>
        {isLoaded && sessionLinks}
      </li>
    </ul>
  );
}

export default Navigation;

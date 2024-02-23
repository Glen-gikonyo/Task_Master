import { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";
import LogoImage from "../Images/Task_Master_Logo-removebg-preview.png";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

/**
 * Renders a login form.
 *
 * @param {Object} props - The component properties.
 * @param {boolean} props.loggedIn - Flag indicating if the user is logged in.
 * @param {function} props.loginPressed - Callback function for when the user logs in.
 * @returns {JSX.Element|null} The login form JSX element or `null` if the user is already logged in.
 */
const Login = (props) => {
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  /**
   * Event handler for email input change.
   *
   * @param {Object} event - The event object.
   */
  const handleEmailChange = (event) => {
    setEmailValue(event.target.value);
  };

  /**
   * Event handler for password input change.
   *
   * @param {Object} event - The event object.
   */
  const handlePasswordChange = (event) => {
    setPasswordValue(event.target.value);
  };

  /**
   * Event handler for form submission.
   *
   * @param {Object} event - The event object.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    const res = await fetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userEmail: emailValue,
        userPassword: passwordValue,
      }),
    });

    const parsedRes = await res.json();

    if (parsedRes.loginState) {
      toast.dark("Successful Login.");
      props.loginPressed();
    } else {
      toast.error("Incorrect email or password. Please try again.");
    }
  };

  if (!props.loggedIn) {
    return (
      <main className="form-signin text-center">
        <Link to="/">
          <img src={LogoImage} alt="OpTask Logo" width="200" height="200" />
          <div className="row justify-content-center mb-4">
            About Task Master
          </div>
        </Link>
        <h1 className="h3 mb-3 fw-normal">Please sign in</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-floating">
            <input
              type="email"
              className="form-control"
              placeholder="Email Address"
              name="userEmail"
              id="userEmail"
              value={emailValue}
              onChange={handleEmailChange}
              required
            />
            <label htmlFor="userEmail">Email address</label>
          </div>
          <div className="form-floating">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              id="userPassword"
              name="userPassword"
              value={passwordValue}
              onChange={handlePasswordChange}
              required
            />
            <label htmlFor="userPassword">Password</label>
          </div>

          <button type="submit" className="w-100 btn btn-lg submitBtn">
            Log In
          </button>
          <Link className="signup-link" to="/register">
            Don't have an account? Sign up for OpTask!
          </Link>
        </form>
      </main>
    );
  } else {
    return null;
  }
};

Login.propTypes = {
  loginPressed: PropTypes.func.isRequired,
  loggedIn: PropTypes.bool.isRequired,
};

export default Login;

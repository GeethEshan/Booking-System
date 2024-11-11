import React, { useState, useEffect } from "react";
import "./Signup.css";
import Axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const role = location.state?.role || "student";

  const handleSubmit = (e) => {
    e.preventDefault();

    const url =
      role === "admin"
        ? "https://booking-441416.de.r.appspot.com/auth/admin/signup"
        : "https://booking-441416.de.r.appspot.com/auth/signup";

    Axios.post(url, {
      username: username,
      email: email,
      password: password,
      contactNumber: contactNumber,
    })
      .then((response) => {
        if (response.data.status) {
          navigate("/login", { state: { role: role } });
        }
      })
      .catch((error) => {
        setError("Something went wrong. Please try again.");
        console.log(error);
      });
  };

  const handleGoogleLoginSuccess = async (credential) => {
    try {
      const res = await Axios.post("https://booking-441416.de.r.appspot.com/auth/google-signin", {
        idToken: credential,
        role: role,
      });
      const username = res.data.user.username;

      setSuccessMessage("User signed in successfully!");
      navigate("/home", { state: { role: role, username: username } });
    } catch (err) {
      setError(err.response?.data?.error || "Google Sign-In failed");
    }
  };

  const loadGoogleSDK = () => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => {
      if (window.google?.accounts) {
        window.google.accounts.id.initialize({
          client_id:
            "898926845547-r7h9jlmgom538bnjuh2kigivmuh90qpk.apps.googleusercontent.com",
          callback: (response) => handleGoogleLoginSuccess(response.credential),
        });

        window.google.accounts.id.renderButton(
          document.getElementById("google-signin-button"),
          { theme: "outline", size: "large" }
        );
      } else {
        setError("Google SDK failed to load.");
      }
    };
    script.onerror = () => {
      setError("Google SDK could not be loaded.");
    };
    document.body.appendChild(script);
  };

  useEffect(() => {
    loadGoogleSDK();

    window.fbAsyncInit = function () {
      window.FB.init({
        appId: "1632017504386559",
        cookie: true,
        xfbml: true,
        version: "v16.0",
      });
    };

    (function (d, s, id) {
      const fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      const js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }, []);

  const handleFacebookLogin = () => {
    window.FB.login((response) => {
      if (response.authResponse) {
        console.log("Facebook login success:", response);

        window.FB.api("/me", { fields: "name,email" }, async (userInfo) => {
          console.log("Facebook user info:", userInfo);

          try {
            const res = await Axios.post(
              "https://booking-441416.de.r.appspot.com/auth/facebook-signin",
              {
                accessToken: response.authResponse.accessToken,
                userInfo,
                role: role,
              }
            );
            setSuccessMessage("User signed in successfully!");
            navigate("/home", {
              state: { role: role, username: res.data.user.username },
            });
          } catch (err) {
            setError("Facebook Sign-In failed");
          }
        });
      } else {
        console.log("User cancelled login or did not fully authorize.");
      }
    });
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-logo">
          <div className="logo">
            <img src="/images/sltlogo.png" alt="Logo" />
          </div>
        </div>
        <div className="form-container">
          <h2>
            <b>Create {role === "admin" ? "Admin" : "Student"} Account</b>
          </h2>
          {error && <p className="error-message">{error}</p>}
          {successMessage && (
            <p className="success-message">{successMessage}</p>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Contact Number"
                onChange={(e) => setContactNumber(e.target.value)}
              />
            </div>
            <div className="form-group">
              <p>
                <b>
                  Already have an account?{" "}
                  <Link to="/login" state={{ role: role }}>
                    Login
                  </Link>
                </b>
              </p>
            </div>

            <button type="submit" className="create-account-button">
              Create Account
            </button>
          </form>
          <div className="oauth-buttons">
            <div id="google-signin-button" className="google-signin"></div>
            <button
              onClick={handleFacebookLogin}
              className="facebook-login"
              style={{ backgroundColor: "white", color: "black" }}
            >
              Continue with Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;

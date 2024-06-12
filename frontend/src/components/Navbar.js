import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import { DarkModeContext } from "../utils/ThemeContext";

function Navbar() {
  const userData = Cookies.get("username");
  const router = useNavigate();

  function logout() {
    Cookies.remove("token");
    Cookies.remove("username");
    router(`/login`);
  }
  const { darkMode, toggle } = useContext(DarkModeContext);
  return (
    <>
      <nav
        className={`navbar navbar-expand-lg  ${
          darkMode ? "bg-dark text-white border-bottom" : "bg-white text-dark"
        } px-4`}
        style={{ height: "10vh" }}
      >
        Admin Panel
        <button
          className="navbar-toggler text-white"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNav"
        >
          <ul className="navbar-nav">
          <li className="nav-item active">
              <Link className={`nav-link   ${
          darkMode ? " text-white " : " text-dark"
        }`} to="/Home">
                Home
              </Link>
            </li>

          <li className="nav-item active">
              <Link className={`nav-link   ${
          darkMode ? " text-white " : " text-dark"
        }`} to="/order-listing">
                Orders
              </Link>
            </li>
            <li className="nav-item active">
              <Link className={`nav-link  ${
          darkMode ? " text-white " : " text-dark"
        }`} to="/addBook">
                Add Book
              </Link>
            </li>
            <li className="nav-item active">
              {darkMode ? (
                <WbSunnyOutlinedIcon onClick={() => toggle()} />
              ) : (
                <DarkModeOutlinedIcon onClick={() => toggle()} />
              )}
            </li>
            {userData !== undefined && userData !== null ? (
              <li className="nav-item active">
                <b
                  className="p-0 m-0 rounded p-2 text-white button"
                  onMouseOver={(e) => (e.currentTarget.innerHTML = "Logout")}
                  onMouseOut={(e) => (e.currentTarget.innerHTML = userData)}
                  onClick={logout}
                >
                  {userData}
                </b>
              </li>
            ) : (
              <ul className="navbar-nav">
                <li className="nav-item active">
                  <Link className="nav-link text-white" to="/">
                    Login
                  </Link>
                </li>
                <li className="nav-item active">
                  <Link className="nav-link text-white" to="/signup">
                    Signup
                  </Link>
                </li>
              </ul>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Navbar;

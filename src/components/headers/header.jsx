import Nav from "../headers/nav/nav";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

function Header() {

  const [user, setUser] = useState(null);
  const [jwt, setJwt] = useState(null);

  // If the user isn't connected, redirect him to the login page
  useEffect(() => {
    if (!Cookies.get('adminJWT') || !Cookies.get('adminData')) {
      window.location.href = '/admin-connection';
      return null;
    }

    if (Cookies.get('adminJWT') && Cookies.get('adminData')) {
      setJwt(Cookies.get('adminJWT'));
      setUser(JSON.parse(Cookies.get('adminData')));
    }

  }, []);

  async function logout() {
    Cookies.remove('adminJWT');
    Cookies.remove('adminData');
    window.location.href = '/admin-connection';
  }

  return (
    <header>
      <div className="d-flex justify-content-around">
        <div style={{ maxWidth: "150px" }} >
          <img className="img-fluid" src="/projector_logo.png" alt="Logo" />
        </div>
        <div className="d-flex justify-content-end align-items-center">
          <p className="mb-0 me-2 fw-semibold">Bienvenue: <span className="fw-bold text-success">{user ? user.username : null}</span></p>
          <button className="btn btn-danger me-4" onClick={(e) => logout()}>Deconnecter</button>
        </div>
      </div>
      <Nav />
    </header>
  )
}

export default Header
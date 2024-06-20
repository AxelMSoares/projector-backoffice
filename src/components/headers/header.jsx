import Nav from "../headers/nav/nav";
import { useState, useEffect } from "react";

function Header() {

  const [user, setUser] = useState(null);
  const [jwt, setJwt] = useState(null);

  // If the user isn't connected, redirect him to the login page
  useEffect(() => {
    if (!Cookies.get('jwt') || !Cookies.get('userData')) {
      window.location.href = '/admin-connection';
      return null;
    }

    if (Cookies.get('jwt') && Cookies.get('userData')) {
      setJwt(Cookies.get('jwt'));
      setUser(JSON.parse(Cookies.get('userData')));
    }

  }, []);

  async function logout() {
    Cookies.remove('jwt');
    Cookies.remove('userData');
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
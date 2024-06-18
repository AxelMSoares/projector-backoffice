import Nav from "../headers/nav/nav";
import { useState, useEffect } from "react";

function Header() {

  const [user, setUser] = useState(null);
  const [jwt, setJwt] = useState(null);

  // If the user isn't connected, redirect him to the login page
  useEffect(() => {
    if (!localStorage.getItem('jwt') || !localStorage.getItem('userData')) {
      window.location.href = '/admin-connection';
      return null;
    }

    if (localStorage.getItem('jwt') && localStorage.getItem('userData')) {
      setJwt(localStorage.getItem('jwt'));
      setUser(JSON.parse(localStorage.getItem('userData')));
    }

  }, []);

  async function logout() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('userData');
    window.location.href = '/admin-connection';
  }

  return (
    <header>
      <div className="d-flex justify-content-around">
        <div style={{ maxWidth: "150px" }} >
          <img className="img-fluid" src="/projector_logo.png" alt="Logo" />
        </div>
        <div className="d-flex justify-content-end align-items-center">
          <p className="mb-0 me-2">Bienvenue: {user ? user.username : null}</p>
          <button className="btn btn-danger me-4" onClick={(e) => logout()}>Deconnecter</button>
        </div>
      </div>
      <Nav />
    </header>
  )
}

export default Header
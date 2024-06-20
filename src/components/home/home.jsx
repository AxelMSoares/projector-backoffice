import { useState, useEffect } from "react";
import Cookies from "js-cookie";

function Home() {

    const [user, setUser] = useState(null);
    const [jwt, setJwt] = useState(null);

    // If the user isn't connected, redirect him to the login page
    useEffect(() => {
        if (!Cookies.get('adminJWT') || !Cookies.get('adminData')) {
            window.location.href = '/admin-connection';
            return null;
        }

        if (Cookies.get('jwt') && Cookies.get('adminData')) {
            setJwt(Cookies.get('adminJWT'));
            setUser(JSON.parse(Cookies.get('adminData')));
        }

    }, []);

    return (
        <>
            <h2 className="text-center mt-5">Bienvenue à l'espace de gestion de Projector.</h2>
        </>
    )
}

export default Home;
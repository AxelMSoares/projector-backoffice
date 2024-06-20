import { useState, useEffect } from "react";

function Home() {

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

    return (
        <>
            <h2 className="text-center mt-5">Bienvenue à l'espace de gestion de Projector.</h2>
        </>
    )
}

export default Home;
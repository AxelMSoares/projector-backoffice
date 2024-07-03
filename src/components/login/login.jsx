import { useState, useEffect } from 'react';
import { login } from '../../api/login';
import Cookies from 'js-cookie';

function Login({ onConnect }) {

    const [errorMsg, setErrorMsg] = useState('');

    // Display the error message for 5 seconds
    useEffect(() => {
        if (errorMsg) {
            setTimeout(() => {
                setErrorMsg('');
            }, 5000);
        }
    }), [errorMsg];

    if(Cookies.get('adminJWT') && Cookies.get('adminData')) {
        window.location.href = '/';
    }

    async function handleConnect(e) {

        e.preventDefault();

        const data = {
            email: document.getElementById('email').value,
            pwd: document.getElementById('pwd').value
        };

        // Check if the fields are not empty
        if (!data.email || !data.pwd) {
            setErrorMsg('Veuillez remplir tous les champs');
            return;
        }


        // Send the login request
        const response = await login(data);

        // Get the csrfToken
        const csrfToken = response.csrfToken;

        // Check if the user is an administrator
        if (response.statut !== "administrateur") {
            setErrorMsg('Vous n\'avez pas les droits pour accéder à cette page');
            return;
        }

        // Set the connected state to true
        onConnect(true);


        // Save the token and user data in the cookies
        Cookies.set('adminJWT', response.jwtoken);
        Cookies.set('adminData', JSON.stringify(response));
        Cookies.set('AdminCSRFToken', csrfToken);
        

        // Redirect the user to the home page
        window.location.href = '/';

    }

    return (
        <div className='d-flex align-items-center py-4 bg-body-tertiary'>
            <main className='form-signin w-50 m-auto'>
                <form>
                    <img src="/projector_logo.png" alt="projector logo" />
                    <h1 className='h3 mb-3 fw-normal'>Connexion</h1>
                    <div className='form-floating mb-2'>
                        <input className='form-control' type="email" name="email" id="email" placeholder='Email' />
                        <label htmlFor="email">Email:</label>
                    </div>
                    <div className='form-floating mb-4'>
                        <input className='form-control' type="password" name="pwd" id="pwd" placeholder='Mot de passe' />
                        <label htmlFor="pwd">Mot de passe:</label>
                    </div>
                    <button className='btn btn-primary w-100 py-2' onClick={handleConnect}>Se connecter</button>
                    {errorMsg ? <div className='alert alert-danger mt-3'>{errorMsg}</div> : null}
                </form>
            </main>
        </div>
    )
}

export default Login;
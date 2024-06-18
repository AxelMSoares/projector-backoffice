import { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, NavLink, Outlet, useRouteError, defer, Link } from 'react-router-dom';
import Header from './components/headers/header';
import Login from './components/login/login';
import Home from './components/home/home';
import Projects from './components/projects/projects';
import Users from './components/users/users';
import Categories from './components/categories/categories';
import ProjectStatus from './components/status/projectStatus';
import { jwtDecode } from 'jwt-decode';


function App() {
  const [connected, setConnected] = useState(false);
  const onConnectChangeHandler = (value) => setConnected(value); // Update the state hook

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp < Date.now() / 1000) {
        localStorage.removeItem('jwt');
        setConnected(false);
      } else {
        setConnected(true);
      }
    } catch (err) {
      localStorage.removeItem('jwt');
      setConnected(false);
    }
  }, []);


  const router = createBrowserRouter([
    {
      path: '/',
      element: <Root />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: '/',
          element: <Home />
        },
        {
          path: '/admin-connection',
          element: <Login onConnect={onConnectChangeHandler} />
        },
        {
          path: '/projets',
          element: <Projects />
        },
        {
          path: '/utilisateurs',
          element: <Users />
        },
        {
          path: '/categories',
          element: <Categories />
        },
        {
          path: '/status-projets',
          element: <ProjectStatus />
        }
      ]
    }
  ]);

  function ErrorPage() {
    const error = useRouteError();
    if (error?.status === 404) {
      return (
        <div className='error-page'>
          <h2>404 - Page non trouvée!</h2>
          <p>La page que vous cherchez n'existe pas.</p>
          <Link to='/' className='return-home'>Retour à l'accueil</Link>
        </div>
      );
    }
    return (
      <div className='error-page'>
        <h2>Une erreur est survenue!</h2>
        <p>{error?.error?.toString() ?? error?.toString()}</p>
      </div>
    );
  }

  function Root() {
    return (
      <>
        {connected ? <Header /> : null}
        <Outlet />
      </>
    )
  }

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}


export default App

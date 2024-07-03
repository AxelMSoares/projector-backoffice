// src/context/CSRFTokenContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';

const CSRFTokenContext = createContext();

export const CSRFTokenProvider = ({ children }) => {
    const [csrfToken, setCsrfToken] = useState(null);

    useEffect(() => {
        const fetchToken = async () => {
            const token = Cookies.get('AdminCSRFToken');
            if(token){
                setCsrfToken(token);
            }
        };
        fetchToken();
    }, []);

    return (
        <CSRFTokenContext.Provider value={csrfToken}>
            {children}
        </CSRFTokenContext.Provider>
    );
};

export const useCSRFToken = () => useContext(CSRFTokenContext);
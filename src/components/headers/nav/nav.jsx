import { useState } from "react"
import { Link } from "react-router-dom"

function Nav() {

    const [home, setHome] = useState(false);
    const [projects, setProjects] = useState(false);
    const [users, setUsers] = useState(false);
    const [categories, setCategories] = useState(false);
    const [status, setStatus] = useState(false);
    
    function resetBtns() {
        setHome(false);
        setProjects(false);
        setUsers(false);
        setCategories(false);
        setStatus(false);
    }

    return (
        <ul className="nav nav-tabs">
            <li className="nav-item">
                <Link to="/" className={home ? "nav-link active" : "nav-link"} onClick={(e) => {
                    resetBtns();
                    setHome(true);
                }}>Accueil</Link>
            </li>
            <li className="nav-item">
                <Link to="/projets"className={projects ? "nav-link active" : "nav-link"} onClick={(e) => {
                    resetBtns();
                    setProjects(true);
                }}>Projets</Link>
            </li>
            <li className="nav-item">
                <Link to="/utilisateurs" className={users ? "nav-link active" : "nav-link"} onClick={(e) => {
                    resetBtns();
                    setUsers(true);
                }}>Utilisateurs</Link>
            </li>
            <li className="nav-item">
                <Link to="/categories" className={categories ? "nav-link active" : "nav-link"} onClick={(e) => {
                    resetBtns();
                    setCategories(true);
                }}>Categories</Link>
            </li>
            <li className="nav-item">
                <Link to="/status-projets" className={status ? "nav-link active" : "nav-link"} onClick={(e) => {
                    resetBtns();
                    setStatus(true);
                }}>Status Projets</Link>
            </li>
        </ul>
    )
}

export default Nav
import { useState, useEffect } from "react";
import { getAllProjects } from "../../api/project/getAllProjects";
import { deleteProject } from "../../api/project/deleteProject";
import { useCSRFToken } from "../../context/CSRFTokenContext";
import { dateToFrench } from "../../helpers/functions";

function Projects() {
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [jwt, setJwt] = useState(Cookies.get('jwt') ? Cookies.get('jwt') : null);
    const [search, setSearch] = useState('');
    const csrfToken = useCSRFToken();
    const [showModal, setShowModal] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        if (jwt) {
            fetchProjectsData();
        }
    }, []);

    useEffect(() => {
        if(msg && msg.length > 0) {
            setTimeout(() => {
                setMsg('');
            }, 5000);
        }
    }, [msg]);

    useEffect(() => {
        searchProjects();
    }, [search]);

    function searchProjects() {
        const result = projects.filter((project) => {
            return project.project_name.toLowerCase().includes(search.toLowerCase());
        });
        setFilteredProjects([...result]);
    }

    async function fetchProjectsData() {
        const data = await getAllProjects(jwt, csrfToken);
        setProjects(data);
        setFilteredProjects(data);
    }

    function deleteProjectHandler(uuid) {
        setProjectToDelete(uuid);
        setShowModal(true);
    }

    async function confirmDeleteProject() {
        await deleteProject(jwt, csrfToken, projectToDelete);
        fetchProjectsData();
        setShowModal(false);
    }

    return (
        <>
            <div style={{ maxWidth: "1000px", margin: "40px auto" }}>
                <h1 className="mb-5">Projets</h1>
                {msg && msg.length > 0 ? <div className="alert alert-success" role="alert">{msg}</div> : null}
                <input type="text" className="form-control mb-3" placeholder="Rechercher un projet..." onChange={(e) => setSearch(e.target.value)} />
                {search && search.length > 0 ? <><p>Resultats:</p>{filteredProjects.length > 0 ? <p>{filteredProjects.length} projet(s) trouvé(s).</p> : null}</> : null}
                {filteredProjects && filteredProjects.length > 0 ?
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Nom</th>
                                <th scope="col">Auteur</th>
                                <th scope="col">Categorie</th>
                                <th scope="col">Crée le:</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProjects.map((project) => (
                                <tr key={project.uuid}>
                                    <td>{project.project_name}</td>
                                    <td>{project.username}</td>
                                    <td>{project.category_name}</td>
                                    <td>{dateToFrench(project.project_created)}</td>
                                    <td className="d-flex">
                                        <button className="btn btn-danger" onClick={(e) => deleteProjectHandler(project.uuid)}>Supprimer</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    :
                    <p>Aucun projet n'a été trouvé.</p>
                }
            </div>
            <div className={`modal ${showModal ? 'show' : ''}`} tabIndex="-1" style={{ display: showModal ? 'block' : 'none' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Supprimer le projet</h5>
                        </div>
                        <div className="modal-body">
                            <p>Êtes-vous sûr de vouloir supprimer ce projet ?</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => setShowModal(false)}>Annuler</button>
                            <button type="button" className="btn btn-danger" onClick={confirmDeleteProject}>Supprimer</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Projects;

import { useState, useEffect } from "react";
import { getProjectStatus } from "../../api/project_status/getProjectStatus";
import { deleteProjectStatus } from "../../api/project_status/deleteProjectStatus";
import { createProjectStatus } from "../../api/project_status/createProjectStatus";
import { updateProjectStatus } from "../../api/project_status/updateProjectStatus";
import { useCSRFToken } from "../../context/CSRFTokenContext";
import Cookies from "js-cookie";

function ProjectStatus() {
    const [projectStatus, setProjectStatus] = useState([]);
    const [jwt, setJwt] = useState(Cookies.get('adminJWT') ? Cookies.get('adminJWT') : null);
    const [showModal, setShowModal] = useState(false);
    const [statusToDelete, setStatusToDelete] = useState(null);
    const [statusToEdit, setStatusToEdit] = useState(null);
    const [msg, setMsg] = useState('');
    const csrfToken = useCSRFToken();
    const [addingNewStatus, setAddingNewStatus] = useState(false);

    useEffect(() => {
        fetchProjectStatus();
    }, []);

    useEffect(() => {
        if (msg && msg.length > 0) {
            const timer = setTimeout(() => {
                setMsg('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [msg]);

    async function fetchProjectStatus() {
        const response = await getProjectStatus(jwt, csrfToken);
        setProjectStatus(response);
    }

    function deleteStatusHandler(id) {
        setStatusToDelete(id);
        setShowModal(true);
    }

    async function confirmDeleteProjectStatus() {
        await deleteProjectStatus(jwt, csrfToken, statusToDelete);
        fetchProjectStatus();
        setShowModal(false);
        setMsg('Statut supprimé avec succès');
    }

    function editStatusHandler(status) {
        setStatusToEdit(status);
    }

    async function confirmEditProjectStatus(id, status_name) {
        await updateProjectStatus(jwt, csrfToken, id, status_name);
        fetchProjectStatus();
        setStatusToEdit(null);
        setMsg('Statut mis à jour avec succès');
    }

    async function addNewStatus(e) {
        e.preventDefault();
        const status_name = document.getElementById('status_name').value;
        await createProjectStatus(jwt, csrfToken, status_name);
        fetchProjectStatus();
        setAddingNewStatus(false);
        setMsg('Statut ajouté avec succès');
    }

    return (
        <>
            <div style={{ maxWidth: "1000px", margin: "auto" }}>
                <h1 className='mb-4 mt-4 ms-5'>Statuts:</h1>
                <button className='btn btn-primary ms-5 mb-4' onClick={() => setAddingNewStatus(!addingNewStatus)}>{addingNewStatus ? 'Annuler' : 'Ajouter un nouveau statuts'}</button>
                {addingNewStatus && <div className='mb-4'>
                    <form>
                        <div className='mb-3'>
                            <label htmlFor='status_name' className='form-label'>Nom du statuts:</label>
                            <input type='text' className='form-control' id='status_name' />
                        </div>
                        <button className='btn btn-primary' onClick={(e) => addNewStatus(e)}>Ajouter</button>
                    </form>
                </div>}
                {msg && <div className='alert alert-success'>{msg}</div>}
                <ul className='list-group mb-5'>
                    <li className='list-group-item d-flex justify-content-around'>
                        <div>Id:</div>
                        <div>Nom:</div>
                        <div>Actions:</div>
                    </li>
                    {projectStatus.map((status, index) => (
                        <li className='list-group-item d-flex justify-content-around' key={index}>
                            <div className='w-100 d-flex justify-content-center'><p>{status.id}</p></div>
                            <div className='w-100 d-flex justify-content-center'>
                                {statusToEdit && statusToEdit.id === status.id ? (
                                    <input type="text" defaultValue={status.status_name} />
                                ) : (
                                    <p>{status.status_name}</p>
                                )}
                            </div>
                            <div className='w-100 d-flex justify-content-center'>
                                {statusToEdit && statusToEdit.id === status.id ? (
                                    <>
                                        <button className='btn btn-success me-2' onClick={() => confirmEditProjectStatus(status.id, document.querySelector(`input[value="${status.status_name}"]`).value)}>Confirmer</button>
                                        <button className='btn btn-secondary' onClick={() => setStatusToEdit(null)}>Annuler</button>
                                    </>
                                ) : (
                                    <>
                                        <button className='btn btn-primary me-2' onClick={() => editStatusHandler(status)}>Editer</button>
                                        <button className='btn btn-danger' onClick={(e) => deleteStatusHandler(status.id)}>Supprimer</button>
                                    </>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className={`modal ${showModal ? 'show' : ''}`} tabIndex="-1" style={{ display: showModal ? 'block' : 'none' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Supprimer le status</h5>
                        </div>
                        <div className="modal-body">
                            <p>Êtes-vous sûr de vouloir supprimer ce status de projet?</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => setShowModal(false)}>Annuler</button>
                            <button type="button" className="btn btn-danger" onClick={confirmDeleteProjectStatus}>Supprimer</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProjectStatus;

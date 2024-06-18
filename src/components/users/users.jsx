import { useState, useEffect } from "react";
import { getAllUsers } from "../../api/users/getAllUsers";
import { deleteUser } from "../../api/users/deleteUser";
import { updateUser } from "../../api/users/updateUser";
import { useCSRFToken } from "../../context/CSRFTokenContext";
import { dateToFrench } from "../../helpers/functions";

function Users() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [msg, setMsg] = useState('');
    const [jwt, setJwt] = useState(localStorage.getItem('jwt') ? localStorage.getItem('jwt') : null);
    const [userToDelete, setUserToDelete] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const csrfToken = useCSRFToken();
    const statut = ['normal', 'moderateur', 'administrateur'];

    useEffect(() => {
        fetchAllUsers();
    }, []);

    useEffect(() => {
        searchUser(search);
    }, [search]);

    useEffect(() => {
        if (msg && msg.length > 0) {
            const timer = setTimeout(() => {
                setMsg('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [msg]);

    async function fetchAllUsers() {
        const data = await getAllUsers(jwt, csrfToken);
        setUsers(data);
        setFilteredUsers(data);
    }

    function searchUser(search) {
        const filteredUsers = users.filter(user => user.username.toLowerCase().includes(search.toLowerCase()));
        setFilteredUsers(filteredUsers);
    }

    function deleteUserHandler(uuid) {
        setUserToDelete(uuid);
        setShowModal(true);
    }

    async function confirmDeleteUser() {
        await deleteUser(jwt, csrfToken, userToDelete);
        fetchAllUsers();
        setShowModal(false);
        setMsg('Utilisateur supprimé avec succès');
    }

    function editUserHandler(user) {
        setEditingUser(user);
    }

    async function confirmEditUser(uuid) {
        const username = document.querySelector(`input[value="${editingUser.username}"]`).value;
        const email = document.querySelector(`input[value="${editingUser.email}"]`).value;
        const statut = document.querySelector('select').value;

        const data = {
            username: username,
            email: email,
            statut: statut
        }

        await updateUser(jwt, csrfToken, uuid, data);
        fetchAllUsers();
        setEditingUser(null);
        setMsg('Utilisateur mis à jour avec succès');
    }

    return (
        <>
            <div style={{ maxWidth: "1000px", margin: "40px auto" }}>
                <h1 className="mb-5">Utilisateurs</h1>
                {msg && msg.length > 0 ? <div className="alert alert-success" role="alert">{msg}</div> : null}
                <input type="text" className="form-control mb-3" placeholder="Rechercher un utilisateur..." onChange={(e) => setSearch(e.target.value)} />
                {search && search.length > 0 ? <><p>Resultats:</p>{filteredUsers.length > 0 ? <p>{filteredUsers.length} utilisateur(s) trouvé(s).</p> : null}</> : null}
                {filteredUsers && filteredUsers.length > 0 ?
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Nom:</th>
                                <th scope="col">Statut:</th>
                                <th scope="col">Crée le:</th>
                                <th scope="col">Email:</th>
                                <th scope="col">Dernière connexion:</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user.uuid}>
                                    <td>
                                        {editingUser && editingUser.uuid === user.uuid ? (
                                            <input type="text" defaultValue={user.username} />
                                        ) : (
                                            user.username
                                        )}
                                    </td>
                                    <td>
                                        {editingUser && editingUser.uuid === user.uuid ? (
                                            <select defaultValue={user.statut}>
                                                {statut.map((s, index) => (
                                                    <option key={index} value={s}>{s}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <span className={user.statut === "administrateur" || user.statut === "moderateur" ? "text-success fw-bold" : ""}>{user.statut}</span>
                                        )}
                                    </td>
                                    <td>{dateToFrench(user.CREATED)}</td>
                                    <td>
                                        {editingUser && editingUser.uuid === user.uuid ? (
                                            <input type="text" defaultValue={user.email} />
                                        ) : (
                                            user.email
                                        )}
                                    </td>
                                    <td>{user.lastLogin ? dateToFrench(user.lastLogin) : "L'utilisateur ne s'est jamais connecté."}</td>
                                    <td className="d-flex">
                                        {editingUser && editingUser.uuid === user.uuid ? (
                                            <>
                                                <button className="btn btn-success me-2" onClick={() => confirmEditUser(user.uuid)}>Confirmer</button>
                                                <button className="btn btn-secondary" onClick={() => setEditingUser(null)}>Annuler</button>
                                            </>
                                        ) : (
                                            <>
                                                <button className="btn btn-primary me-2" onClick={() => editUserHandler(user)}>Editer</button>
                                                <button className="btn btn-danger" onClick={(e) => deleteUserHandler(user.uuid)}>Supprimer</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table> : <p> Aucun utilisateur trouvé</p>}
            </div>
            <div className={`modal ${showModal ? 'show' : ''}`} tabIndex="-1" style={{ display: showModal ? 'block' : 'none' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Supprimer l'utilisateur</h5>
                        </div>
                        <div className="modal-body">
                            <p>Êtes-vous sûr de vouloir supprimer ce utilisateur ?</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => setShowModal(false)}>Annuler</button>
                            <button type="button" className="btn btn-danger" onClick={confirmDeleteUser}>Supprimer</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Users;

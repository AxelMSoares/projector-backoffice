import { useState, useEffect } from 'react';
import { getAllCategories } from '../../api/categories/getAllCategories';
import { createCategories } from '../../api/categories/createCategorie';
import { updateCategories } from '../../api/categories/updateCategories';
import { deleteCategorie } from '../../api/categories/deleteCategorie';
import { useCSRFToken } from '../../context/CSRFTokenContext';
import Cookies from 'js-cookie';
import DOMPurify from 'dompurify';

function Categories() {
    const [categories, setCategories] = useState([]);
    const [jwt, setJwt] = useState(Cookies.get('adminJWT') ? Cookies.get('adminJWT') : null);
    const csrfToken = useCSRFToken();
    const [search, setSearch] = useState('');
    const [addingNewCategory, setAddingNewCategory] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        if (csrfToken && jwt) {
            fetchAllCategories();
        }
    }, []);

    useEffect(() => {
        if (msg && msg.length > 0) {
            const timer = setTimeout(() => {
                setMsg('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [msg]);

    async function fetchAllCategories() {
        const data = await getAllCategories(jwt, csrfToken);
        setCategories(data);
    }

    const filteredCategories = categories.filter((category) => {
        return category.category_name.toLowerCase().includes(search.toLowerCase());
    });

    async function addNewCategory(e) {
        e.preventDefault();
        const category_name = document.getElementById('category_name').value;
        await createCategories(jwt, csrfToken, category_name);
        fetchAllCategories();
        setAddingNewCategory(false);
        setMsg('Catégorie ajoutée avec succès');
    }

    function editCategoryHandler(category) {
        setEditingCategory(category);
    }

    async function confirmEditCategory(id, category_name) {
        await updateCategories(jwt, csrfToken, id, category_name);
        setEditingCategory(null);
        fetchAllCategories();
        setMsg('Catégorie mise à jour avec succès');
    }

    function deleteCategoryHandler(id) {
        setCategoryToDelete(id);
        setShowModal(true);
    }

    async function confirmDeleteCategory() {
        await deleteCategorie(jwt, csrfToken, categoryToDelete);
        fetchAllCategories();
        setShowModal(false);
        setMsg('Catégorie supprimée avec succès');
    }

    return (
        <>
            <div style={{ maxWidth: "1000px", margin: "auto" }}>
                <h1 className='mb-4 mt-4 ms-5'>Categories:</h1>
                <button className='btn btn-primary ms-5 mb-4' onClick={() => setAddingNewCategory(!addingNewCategory)}>{addingNewCategory ? 'Annuler' : 'Ajouter une nouvelle catégorie'}</button>
                {addingNewCategory && <div className='mb-4'>
                    <form>
                        <div className='mb-3'>
                            <label htmlFor='category_name' className='form-label'>Nom de la catégorie:</label>
                            <input type='text' className='form-control' id='category_name' />
                        </div>
                        <button className='btn btn-primary' onClick={(e) => addNewCategory(e)}>Ajouter</button>
                    </form>
                </div>}
                {msg && <div className='alert alert-success'>{msg}</div>}
                <input type="text" className="form-control mb-3" placeholder="Rechercher une catégorie..." onChange={(e) => setSearch(e.target.value)} />
                <ul className='list-group mb-5'>
                    <li className='list-group-item d-flex justify-content-around'>
                        <div>Nom:</div>
                        <div>Actions:</div>
                    </li>
                    {filteredCategories.length > 0 ? filteredCategories.map((category, index) => (
                        <li className='list-group-item d-flex justify-content-around' key={index}>
                            <div className='w-100 d-flex justify-content-center'>
                                {editingCategory && editingCategory.id === category.id ? (
                                    <input type="text" defaultValue={DOMPurify.sanitize(category.category_name)} />
                                ) : (
                                    <p>{DOMPurify.sanitize(category.category_name)}</p>
                                )}
                            </div>
                            <div className='w-100 d-flex justify-content-center'>
                                {editingCategory && editingCategory.id === category.id ? (
                                    <>
                                        <button className='btn btn-success me-2' onClick={() => confirmEditCategory(category.id, document.querySelector(`input[value="${category.category_name}"]`).value)}>Confirmer</button>
                                        <button className='btn btn-secondary' onClick={() => setEditingCategory(null)}>Annuler</button>
                                    </>
                                ) : (
                                    <>
                                        <button className='btn btn-primary me-2' onClick={() => editCategoryHandler(category)}>Editer</button>
                                        <button className='btn btn-danger' onClick={() => deleteCategoryHandler(category.id)}>Supprimer</button>
                                    </>
                                )}
                            </div>
                        </li>
                    )) : <li className='list-group-item d-flex justify-content-around'>Aucune catégorie trouvée</li>}
                </ul>
            </div>
            <div className={`modal ${showModal ? 'show' : ''}`} tabIndex="-1" style={{ display: showModal ? 'block' : 'none' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Supprimer la catégorie</h5>
                        </div>
                        <div className="modal-body">
                            <p>Êtes-vous sûr de vouloir supprimer cette catégorie ?</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => setShowModal(false)}>Annuler</button>
                            <button type="button" className="btn btn-danger" onClick={confirmDeleteCategory}>Supprimer</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Categories;

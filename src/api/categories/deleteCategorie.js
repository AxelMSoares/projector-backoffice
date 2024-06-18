export async function deleteCategorie(jwt, csrfToken, id){
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/categories/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwt,
                'CSRF-Token': csrfToken
            },
            credentials: 'include'
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la suppression de la categorie', error);
    }
}
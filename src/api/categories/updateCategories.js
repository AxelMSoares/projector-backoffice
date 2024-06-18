export async function updateCategories(jwt, csrfToken, id, category_name){

    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/categories/update/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwt,
                'CSRF-Token': csrfToken
            },
            credentials: 'include',
            body: JSON.stringify({category_name})
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la mise a jour des categories', error);
    }
}

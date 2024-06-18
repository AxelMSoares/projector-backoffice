export async function createCategories(jwt, csrfToken, category_name){
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/categories/create`, {
            method: 'POST',
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
        console.error('Erreur lors de la création des categories', error);
    }
}
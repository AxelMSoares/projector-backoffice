export async function deleteProjectStatus(jwt, csrfToken, id) {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/project_status/delete/${id}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "Authorization": jwt,
                "CSRF-Token": csrfToken
            },
            credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
            console.log("Une erreur est survenue lors de la suppression du statut", data.error);
        } else {
            return data;
        }

    } catch (error) {
        console.log("Une erreur est survenue lors de la suppression du statut", error);
    }
}
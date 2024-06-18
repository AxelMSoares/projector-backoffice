export async function updateProjectStatus(jwt, csrfToken, id, status_name) {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/project_status/update/${id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": jwt,
                "CSRF-Token": csrfToken
            },
            credentials: 'include',
            body: JSON.stringify({ status_name })
        });

        const data = await response.json();

        if (!response.ok) {
            console.log("Une erreur est survenue lors de la mise à jour du statut", data.error);
        } else {
            return data;
        }

    } catch (error) {
        console.log("Une erreur est survenue lors de la mise à jour du statut", error);
    }
}
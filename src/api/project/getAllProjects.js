export async function getAllProjects(jwt, csrfToken) {

    try {
        const response = await fetch(`http://localhost:3000/projects/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwt,
                'CSRF-Token': csrfToken
            },
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error('Erreur lors de la récupération des projets:', response.statusText);
        }
        
    } catch (error) {
        console.error('Erreur lors de la récupération des projets:', error.message);
    }
}

export const getAllTeams = async() => {
    try {
        const response = await fetch('https://kings-league-api.garcia-mauricio-ariel.workers.dev/teams')
        const teams = await response.json()
        return teams
    } catch (e) {
        // console.log(e)
        // Enviar el error a un servicio de reporte de errores
        return []
    }
}
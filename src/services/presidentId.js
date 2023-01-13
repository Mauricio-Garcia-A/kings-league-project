export const getPresidentId = async({id=''}) => {
    try {
        const response = await fetch(`https://kings-league-api.garcia-mauricio-ariel.workers.dev/presidents/${id}`)
        const president = await response.json()
        return president
    } catch (e) {
        // console.log(e)
        // Enviar el error a un servicio de reporte de errores
        return []
    }
}
// ARMA EL JSON TEAMS CON LOS PARAMTROS DESEADOS (para que funcione hay que sacr el archivo de auxiliar, junto con los archivos de auxiliar en la carpeta DB)

import {TEAMS, TEAMS_AUX, PLAYERS_12, writeDBFile} from '../utils.js'

let teams = TEAMS.map(({id, name,image,presidentId,channel,socialNetworks})=> {
    
    let team_aux = TEAMS_AUX.filter(team_aux => id === team_aux.id)

    let players12 = PLAYERS_12.filter(player => id === player.idTeam)
    console.log(players12)

    let {color, imageWhite, url, players, shortName, coachInfo} = team_aux[0]
    //console.log(imageWhite.split('/').at(-1))

    return {
            id, 
            name,
            image,
            presidentId,
            channel,
            socialNetworks,
            color,
            imageWhite:imageWhite.split('/').at(-1),
            url,
            players,
            shortName,
            coachInfo,
            players12
        }

})

console.log(teams)

await writeDBFile(`teams2`,teams)
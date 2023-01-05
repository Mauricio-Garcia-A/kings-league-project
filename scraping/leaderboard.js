// SCRAPING DE LA WEB

import * as cheerio from 'cheerio'
import fetch from 'node-fetch'
import { writeFile, readFile} from 'node:fs/promises'
import path from 'node:path'

const DB_PATH = path.join(process.cwd(),'db')
const TEAMS = await readFile(`${DB_PATH}/teams.json`, 'utf-8').then(JSON.parse)
//import TEAMS  from '../db/teams.json' assert {type:'json'}       //Esta tendria que ser la manera correcta de hacerlo, pero da error

const getTeamFrom = ({name}) => TEAMS.find(team => team.name === name)


const URLS = {
    leaderboard: 'https://kingsleague.pro/estadisticas/clasificacion/'
}
const LEADERBOARD_SELECTOR= {
    team: { selector: '.fs-table-text_3', typeOf: 'string' },           // Equipo
    wins: { selector: '.fs-table-text_4', typeOf: 'number' },           // Partidos Ganados
    loses: { selector: '.fs-table-text_5', typeOf: 'number' },          // Partidos Perdidos
    scoredGoals: { selector: '.fs-table-text_6', typeOf: 'number' },    // Goles A Favor
    concededGoals: { selector: '.fs-table-text_7', typeOf: 'number' },  // Goles Enconta
    yellowCards: { selector: '.fs-table-text_8', typeOf: 'number' },    // Tarjetas Amarillas
    redCards: { selector: '.fs-table-text_9', typeOf: 'number' }        // Tarjetas Rojas
}

async function scrape(url) {                    // Scripea la URL
    const res = await fetch(url)  
    const html = await res.text()

    return cheerio.load(html)                   // Devuelve el html en (cheerio)
}

async function getLeaderBoard(){                // Formatea el html con los valores que se nesesitan
    const $ = await scrape(URLS.leaderboard)
    const $rows =  $('table tbody tr')          // Extraigo las de la tabla las filas con los datos de los quipos
    
    const clearText = text => text.replace(/\t|\n|\s:/g,'').replace(/.*:/g,'').trim()
    
    const leaderboard =[]
    
    $rows.each((i,el)=>{
        const $el = $(el)
        /*
        const rowTeam = $el.find('.fs-table-text_3').text()
        const rowVictories= $el.find('.fs-table-text_4').text()
        const rowLoses = $el.find('.fs-table-text_5').text()
        const rowScoredGoals =  $el.find('.fs-table-text_6').text()
        const rowConcededGoals = $el.find('.fs-table-text_7').text()
        const rowCardsYellow = $el.find('.fs-table-text_8').text()
        const rowCardsRed = $el.find('.fs-table-text_9').text()
        */

        const leaderBoardEntries = Object.entries(LEADERBOARD_SELECTOR).map(([key, { selector, typeOf }])=>{     // traforma {} en [] para recorrerlo con map
            const rowValue = $el.find(selector).text()                                                           // selecciona el valor segun el selector
            const clearValue = clearText(rowValue)                                                              // Limpia el resultado
            const value = (typeOf ==='number')                                                                  // Tipea el valor. traforma el valor segun el tipo (numero o string)
                ? Number(clearValue) 
                : clearValue;
            return [key,value]
        })

        const {team:teamName, ...leaderboardForTeam} = Object.fromEntries(leaderBoardEntries)
        const team = getTeamFrom({name:teamName})
        
        //leaderboard.push(Object.fromEntries(leaderBoardEntries))
        leaderboard.push({...leaderboardForTeam, team})
    })

    return leaderboard
}

const leaderboard = await getLeaderBoard()                          // objeto con la informacion de los equipos
//const filePath = path.join(process.cwd(),'db/leaderboard.json')             // Se crea la ruta relativa donde guardar JSON con los equipos

await writeFile(`${DB_PATH}/leaderboard.json`, JSON.stringify(leaderboard, null, 2), 'utf-8')       // Creo/modifico/actualizo el arcrivo leaderboard.json con la info de los equipos
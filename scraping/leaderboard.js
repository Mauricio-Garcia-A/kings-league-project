// SCRAPING DE LA WEB

import * as cheerio from 'cheerio'
import fetch from 'node-fetch'
import {TEAMS, PRESIDENTS, writeDBFile } from './utils.js'


const getTeamFrom = ({name}) => {
    const {presidentId, ...restOfTeam}=TEAMS.find(team => team.name === name)
    const president = PRESIDENTS.find(president => president.id === presidentId)

    return { ... restOfTeam, president}
}

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

await writeDBFile(`leaderboard`,leaderboard)

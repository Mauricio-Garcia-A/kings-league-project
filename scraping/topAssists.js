import * as cheerio from 'cheerio'
import fetch from 'node-fetch'
import {TEAMS, writeDBFile } from './utils.js'

const getImageFromTeam = (name) => {
   const {image, ...restOfTeam}=TEAMS.find(team => team.name === name)
    
    return image
}


const URLS = {
    leaderboard: 'https://kingsleague.pro/estadisticas/clasificacion/',
    mvp: 'https://kingsleague.pro/estadisticas/mvp/',
    assists: 'https://kingsleague.pro/estadisticas/asistencias/'
}

const ASSISTS_SELECTORS = {
	team: { selector: '.fs-table-text_3', typeOf: 'string' },
	playerName: { selector: '.fs-table-text_4', typeOf: 'string' },
	gamesPlayed: { selector: '.fs-table-text_5', typeOf: 'number' },
	assists: { selector: '.fs-table-text_6', typeOf: 'number' }
}

async function scrape(url) {                    // Scripea la URL
    const res = await fetch(url)  
    const html = await res.text()

    return cheerio.load(html)                   // Devuelve el html en (cheerio)
}

async function getAssistsList(){                // Formatea el html con los valores que se nesesitan
    const $ = await scrape(URLS.assists)
    const $rows =  $('table tbody tr')          // Extraigo las de la tabla las filas con los datos de los quipos
    
    const clearText = text => text.replace(/\t|\n|\s:/g,'').replace(/.*:/g,'').trim()
    
    const assistsList =[]
    
    $rows.each((i,el)=>{
        const $el = $(el)
        const assistsSelectorEntries = Object.entries(ASSISTS_SELECTORS).map(([key, { selector, typeOf }])=>{     // traforma {} en [] para recorrerlo con map
            const rowValue = $el.find(selector).text()                                                           // selecciona el valor segun el selector
            const clearValue = clearText(rowValue)                                                              // Limpia el resultado
            const value = (typeOf ==='number')                                                                  // Tipea el valor. traforma el valor segun el tipo (numero o string)
                ? Number(clearValue) 
                : clearValue;
            return [key,value]
        })

        const {team:teamName, ...mvpData} = Object.fromEntries(assistsSelectorEntries)
        const imageTeam = getImageFromTeam(teamName)
       
        assistsList.push({rank:i+1, team:teamName, image:imageTeam, ...mvpData})
    })

    return  assistsList
}

const assists = await getAssistsList()                          // objeto con la informacion de los equipos

await writeDBFile(`top_assists`,assists)
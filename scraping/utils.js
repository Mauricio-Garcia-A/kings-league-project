import { writeFile, readFile} from 'node:fs/promises'                 
import path from 'node:path'  
                      
const DB_PATH = path.join(process.cwd(),'db')
function readDBFile (fileName) {
    return readFile(`${DB_PATH}/${fileName}.json`, 'utf-8').then(JSON.parse)
}
export const TEAMS = await readDBFile(`teams`)
export const PRESIDENTS = await readDBFile(`presidents`)

export function writeDBFile (fileName, data) {
    return writeFile(`${DB_PATH}/${fileName}.json`, JSON.stringify(data, null, 2), 'utf-8')       // Creo/modifico/actualizo el arcrivo leaderboard.json con la info de los equipos
}
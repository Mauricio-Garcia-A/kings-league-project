// SCRAPING DE LA API

import { writeFile, readFile} from 'node:fs/promises'
import path from 'node:path'
import fetch from 'node-fetch'

const DB_PATH = path.join(process.cwd(), './db/')
const RAW_PRESIDENTS = await readFile(`${DB_PATH}/raw-presidents.json`,'utf-8').then(JSON.parse)            // Del archivo JSON traigo la info de los presidentes

const STATICS_PATH = path.join(process.cwd(), './assets/static/presidents')

const presidents = await Promise.all(
    RAW_PRESIDENTS.map(async presidentInfo =>{
        const {slug:id, title, _links:links} = presidentInfo        // de los datos JSON extraigo el ID
        const {rendered:name} = title                               // de los datos JSON extraigo el NOMBRE
        
        const {'wp:attachment':attachment}=links
        const {href: imageApiEndpint} =attachment[0]                // se extrae el endpoin conseguir la IMAGEN
        
        const response = await fetch(imageApiEndpint)               // Llamada a la API para otener la imagen
        const data = await response.json()
        const [imageInfo]=data
        const {guid: {rendered: imageUrl}} = imageInfo              // Obtengo la la URL de la imagen


        const fileExtension = imageUrl.split('.').at(-1)            //Extraigo la extencion de la imagen. ('JPG','IMG','PNG', ...)

        const responseImage = await fetch(imageUrl)                 // llamada a la API para otener la imagen
        const arrayBuffer = await responseImage.arrayBuffer()       // trasformamos la respuesta en un ArrayBuffer (devuelve el contenido de la imagen en binario)
        const buffer = Buffer.from(arrayBuffer)                     // creamos y guardamos la imagen en un Buffer

        const imageFileName = `${id}.${fileExtension}`                  // Nombre de archibo a a guadar ('nombre-id.jpg')
        await writeFile(`${STATICS_PATH}/${imageFileName}`, buffer)     // Guardo el buffer con la imagen en el directorio establecido


        return {id, name, image:imageFileName, teamId: 0}

        /* OTRA FORMA DE HACER LA LLAMADA A LA API
        const image = fetch(imageApiEndpint)
            .then(res => res.json())
            .then(data => {
                const [imageInfo] = data
                const {guid: {rendered: imageUrl}} = imageInfo
                
                return {id, name, imageUrl}
        })*/
    })
)

await writeFile(`${DB_PATH}/presidents.json`, JSON.stringify(presidents, null, 2))
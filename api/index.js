import { Hono } from 'hono'
import leaderboard from '../db/leaderboard.json'
import teams from '../db/teams.json'
import presidents from '../db/presidents.json'


import { serveStatic } from 'hono/serve-static.module'


const app = new Hono()

app.get('/', (ctx) =>
  ctx.json([
    {
      endpoint: '/leaderboard',
      description: 'Desvuelve la tabla de clasificacion de la KingsLeague'
    },
	{
		endpoint: '/teams',
		description: 'Desvuelve informacion de los equipos de la KingsLeague'
	},
	{
		endpoint: '/teams/:id',
		description: 'Desbuelve informacion del equipo solicitado'
	},
    {
		endpoint: '/presidents',
		description: 'Desbuelve todos los presidentes de la KingsLeague'
	},
	{
		endpoint: '/presidents/:id',
		description: 'Desbuelve informacion del presidente solicitado'
	},
	{
		endpoint: '/static/logos/:id-team',
		description: 'Imagen del logo del equipo '
	},
	{
		endpoint: '/static/presidents/:id-precident',
		description: 'Imagen del presidente del equipo'
	}
  ])
)
app.get('/leaderboard\\/?', (ctx) => ctx.json(leaderboard))

app.get('/teams\\/?', (ctx) => ctx.json(teams))
app.get('/teams/:id', (ctx) => {
	const id = ctx.req.param('id')
	const foundTeam = teams.find((team) => team.id === id)
  
	return foundTeam
	  ? ctx.json(foundTeam)
	  : ctx.json({ message: 'Team not found' }, 404)
})

app.get('/presidents\\/?', (ctx) => ctx.json(presidents))
app.get('/presidents/:id', (ctx) => {
	const id = ctx.req.param('id')
	const foundPresident = presidents.find((president) => president.id === id)
  
	return foundPresident
	  ? ctx.json(foundPresident)
	  : ctx.json({ message: 'President not found' }, 404)
})
  
  

app.get('/static/*', serveStatic({ root: './' }))

export default app




// FORMA NATIVA DE HACER LA RESPUESTA DE LA API (SIN HONO u EXPRESS)
/*
import leaderboard from '../db/leaderboard.json'
export default {
	async fetch(request, env, ctx) {
		return new Response(JSON.stringify(leaderboard),{
			headers: {
				'content-type':'application/json; charset=utf-8'
			}
		});
	},
};
*/

//--------------------------------------------------------------------------------------

/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npx wrangler dev src/index.js` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npx wrangler publish src/index.js --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
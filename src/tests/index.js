const YoutubeMusicApi = require('../index.js')

const api = new YoutubeMusicApi()
api.initialize() // Retrieves Innertube Config
.then(info => {
	api.search("ne deve ne kush", "song").then(result => {}) // just search for songs
	
})
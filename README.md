# youtube-music-api

Unoffical Youtube Music API

## Installation
```bash
npm install youtube-music-api
```

## Example

```javascript
const YoutubeMusicApi = require('youtube-music-api')

const api = new YoutubeMusicApi()
api.initalize() // Retrieves Innertube Config
.then(info => {
	api.getSearchSuggestions("ne deve ne kush").then(result => {
		/*[
		  'ne deve ne kush',
		  'ne deve ne kush canlı',
		  'ne deve ne kush lyrics',
		  'ne deve ne kush konser',
		  'ne deve ne kush cover',
		  'ne deve ne kush sözleri',
		  'ne deve ne kush akor'
		]*/
		console.log(result)
	})

	api.search("ne deve ne kush").then(result => {
		/*{content: [
			{
				type: 'song', videoId: 'kvoO5hwsYQo', playlistId: 'RDAMVMkvoO5hwsYQo', name: 'ne deve ne kush', artist: [Array], album: [Object], duration: 159000, thumbnails: [Array], params: 'wAEB'
			},
			{
				type: 'video', videoId: 'sixP2AyFOjY', playlistId: 'RDAMVMsixP2AyFOjY', name: 'Büyük Ev Ablukada - Ne Deve Ne Kush (Mutsuz Parti Şekli)', author: 'Mustafa TAŞ', views: '993 views', duration: 12000, thumbnails: [Array], params: 'wAEB'
			},
			{
				type: 'single', browseId: 'MPREb_9TuSrHElFSO', playlistId: 'OLAK5uy_mj-G8ekrTNJbudAD6ehLFM8cW3yezUEe8', name: 'ne deve ne kush', artist: 'Büyük Ev Ablukada, Ezhel', year: '2019', thumbnails: [Array]
			},
			{
				type: 'artist', browseId: 'UCCvxgd2z194wYgpBt-sajrA', name: 'Büyük Ev Ablukada', thumbnails: [Array]
			},
			{
				type: 'playlist', browseId: 'VLPLTw3BBwcLBjG-4fernx2Xt-GHdYMPYAFM', title: 'ne deve ne kush Radio', author: 'Ateş Tan', count: 51, thumbnails: [Array]
			},
			....
			]
		}*/
		console.log(result)
	})
	api.search("ne deve ne kush", "song").then(result => console.log(result)) // just search for songs
	api.search("ne deve ne kush", "video").then(result => console.log(result)) // just search for video
	api.search("ne deve ne kush", "album").then(result => console.log(result)) // just search for album
	api.search("ne deve ne kush", "artist").then(result => console.log(result)) // just search for artist
	api.search("ne deve ne kush", "playlist").then(result => console.log(result)) // just search for playlist

	api.getAlbum("MPREb_9TuSrHElFSO").then(result => {
	/*{	title: 'ne deve ne kush',
		  description: '',
		  trackCount: 1,
		  date: { year: 2019, month: 7, day: 26 },
		  duration: 159180,
		  artist: [
		    {
		      name: 'Büyük Ev Ablukada',
		      browseId: 'UCCvxgd2z194wYgpBt-sajrA',
		      thumbnails: [Array]
		    },
		    {
		      name: 'Ezhel',
		      browseId: 'UCKyS9imZeKupw7aVr6GCI5w',
		      thumbnails: [Array]
		    }
		  ],
		  tracks: [
		    {
		      name: 'ne deve ne kush',
		      videoId: 'kvoO5hwsYQo',
		      artistNames: 'Büyük Ev Ablukada, Ezhel',
		      duration: 159180,
		      thumbnails: [Array]
		    }
		  ],
		  thumbnails: [
		    {
		      url: 'https://lh3.googleusercontent.com/ylDAVJnoEBwUgTZ4Rj4bLQYphOAOvB0j_t8xQEz6zO0POfHVdI1RvzNIcu3UyTnwJrRAm4mIOTmxXESp=w60-h60-l90-rj',
		      width: 60,
		      height: 60
		    },
		    ....
		  ]
		}*/
		console.log(result)
	})

	api.getArtist("UCCvxgd2z194wYgpBt-sajrA").then(result => {
	/*{
	  name: 'Büyük Ev Ablukada',
	  description: 'Büyük Ev Ablukada is a Turkish music group founded in Istanbul in 2008. The band was started by Afordisman Salihins and Canavar Banavar. After some time the band turned into an electrical version, which is described by "Full Faça". Büyük Ev Ablukada became well-known in a very short time with the help of their own songs and special concerts. The group members use aliases instead of their own names and some of the original names of the members are still unknown. They first released a concert record named "Ay Şuram Ağrıyo" and an album named "Olmadı Kaçarız", and then in 21 December 2012, they released their debut album "Full Faça," which was issued in both CD and vinyl by their own record company, Olmadı Kaçarız.',
	  views: 23689254,
	  products: {
	    songs: {
	      content: [Array],
	      browseId: 'VLPLmKAu9cB6-Ic4FStCVQ85ePFQuRTkKoTT',
	      params: 'ggMCCAI%3D'
	    },
	    albums: { content: [Array] },
	    singles: { content: [Array] },
	    videos: { content: [Array] }
	  },
	  thumbnails: [
	    {
	      url: 'https://lh3.googleusercontent.com/CwweEkMq-xI3bw1M04t-Mv60cDcHcucsDzLel4htktbTi9yPkOXJFFYbEhXZcIufSPKqFwxChZBImicv=w540-h225-p-l90-rj',
	      width: 540,
	      height: 225
	    },
	    ....
	  ]
	}*/
	console.log(result)
	})

	api.getPlaylist("VLPLTw3BBwcLBjG-4fernx2Xt-GHdYMPYAFM").then(result => {
	/*{
	  title: 'ne deve ne kush Radio',
	  owner: 'Ateş Tan',
	  trackCount: 51,
	  dateYear: '2020',
	  content: [
	    {
	      videoId: 'kvoO5hwsYQo',
	      name: 'ne deve ne kush',
	      author: [Array],
	      duration: 159000,
	      thumbnails: [Array]
	    },
	    {
	      videoId: 'ZVvmYVDoyaw',
	      name: 'Derine İndik',
	      author: [Object],
	      duration: 257000,
	      thumbnails: [Array]
	    },
	   	....
	  ],
	  thumbnails: [
	    {
	      url: 'https://lh3.googleusercontent.com/ylDAVJnoEBwUgTZ4Rj4bLQYphOAOvB0j_t8xQEz6zO0POfHVdI1RvzNIcu3UyTnwJrRAm4mIOTmxXESp=w60-h60-l90-rj',
	      width: 60,
	      height: 60
	    },
	    ....
	  ],
	  continuation: []
	}*/
	console.log(result)
	})
})
```

## License
[MIT](https://choosealicense.com/licenses/mit/)

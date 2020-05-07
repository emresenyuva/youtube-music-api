# youtube-music-api

Unoffical Youtube Music API

## Installation
```bash
npm install youtube-music-api
```

## Usage

```javascript
const YoutubeMusicApi = require('youtube-music-api')

const api = new YoutubeMusicApi()
api.initalize().then(info => {
    api.search("ne deve ne kush").then(result => console.log(result.content))

    //search songs
    api.search("ne deve ne kush", "song").then(result => console.log(result.content))

    //search videos
    api.search("ne deve ne kush", "video").then(result => console.log(result.content))
})

```

## License
[MIT](https://choosealicense.com/licenses/mit/)

const express = require('express')
const path = require('path')
const app = express();

var Rollbar = require("rollbar");
var rollbar = new Rollbar({
  accessToken: 'cc40359498f14e94a9f675fbaaf3c59c',
  captureUncaught: true,
  captureUnhandledRejections: true
});

app.use(express.json())
app.use('/style', express.static('./public/styles.css'))

let ballPlayers = []

app.get('/', function(req, res) {

    rollbar.log("Hello world!")
    rollbar.critical('Crash while trying to load the page')
    rollbar.warning('Webpage API unavailable')
    res.sendFile(path.join(__dirname, '/public/index.html'))
})

app.get('/spacejam', function (req, res) {
    res.sendFile(path.join(__dirname, '/public/spacejam.jpg'))
})

app.post('/api/ballPlayers', (req, res) => {
    let {name} = req.body
    name = name.trim()

    const index = ballPlayers.findIndex((playerName) => { // check if student name exists already
        return playerName === name
    })

console.log(index)

try {
    if (index === -1 && name !== '') {
        ballPlayers.push(name)
        rollbar.log('A favorite basketball player has been added to the list!', {author: 'israel', type: 'manual'})
        res.status(200).send(ballPlayers)
    } else if (name === '') {
        rollbar.error('no name given')
        res.status(400).send('must provide a name')
    } else {
        rollbar.error('player already exists')
        res.status(400).send('that player already exists')
    }
} catch (err) {
    rollbar.error(err)
}
})


const port = process.env.PORT || 5050

app.listen(port, function () {
    console.log(`Server is running on ${port}`)
});
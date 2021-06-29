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

app.get('/', function(req, res) {

    rollbar.log("Hello world!")
    rollbar.critical('Crash while trying to load the page')
    rollbar.warning('Webpage API unavailable')
    res.sendFile(path.join(__dirname, '/public/index.html'))
})


const port = process.env.PORT || 5050

app.listen(port, function () {
    console.log(`Server is running on ${port}`)
});
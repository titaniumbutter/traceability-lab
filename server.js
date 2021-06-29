const express = require('express')
const path = require('path')
const app = express();

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/index.html'))
})



app.use(express.json())


const port = process.env.PORT || 5050

app.listen(port, function () {
    console.log(`Server is running on ${port}`)
});
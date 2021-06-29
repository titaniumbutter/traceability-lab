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

let students = []

app.get('/', function(req, res) {

    rollbar.log("Hello world!")
    rollbar.critical('Crash while trying to load the page')
    rollbar.warning('Webpage API unavailable')
    res.sendFile(path.join(__dirname, '/public/index.html'))
})

app.post('/api/student', (req, res) => {
    let {name} = req.body
    name = name.trim()

    const index = students.findIndex((studentName) => { // check if student name exists already
        return studentName === name
    })

console.log(index)

try { // using a "try catch" block will handle any generic 500 errors (not necessary, but a good addition)
    if (index === -1 && name !== '') {
        // we'll send responses to the user based upon whether or not they gave us a valid user to add
        // also we'll send information to rollbar so we can keep track of the activity that's happening
        students.push(name)
        rollbar.log('student added successfully', {author: 'riley', type: 'manual'})
        res.status(200).send(students)
    } else if (name === '') {
        rollbar.error('no name given')
        res.status(400).send('must provide a name')
    } else {
        rollbar.error('student already exists')
        res.status(400).send('that student already exists')
    }
} catch (err) {
    rollbar.error(err)
}
})


const port = process.env.PORT || 5050

app.listen(port, function () {
    console.log(`Server is running on ${port}`)
});
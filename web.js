// Requied modules
const { query } = require('express')
const http = require('http')
const app = require('express')()
const server = http.createServer(app)
const ws = require('./ws.js')(server)
const PORT = process.env.PORT || 80

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/pages/index.html')
})

app.get('/styles', (req, res) => {
    res.sendFile(__dirname + '/css/style.css')
})

app.get('/ui-handlers', (req, res) => {
    res.sendFile(__dirname + '/js/ui-handlers.js')
})

app.get('/effects', (req, res) => {
    res.sendFile(__dirname + '/js/effects.js')
})

app.get('/server-handlers', (req, res) => {
    res.sendFile(__dirname + '/js/server-handlers.js')
})

server.listen(PORT)
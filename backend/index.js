const express = require('express')
const app = express()
const port = 3000

var server = app.listen(8082)
var io = require('socket.io').listen(server);
//引入socket.js
require('./model/socket.js')(io);


app.get('/', (req, res) =>{
	console.log(`Api callback hello world`)
	res.send('Hello World!')
})

app.listen(port, () => console.log(`Chatroom backup listening on port ${port}!`))
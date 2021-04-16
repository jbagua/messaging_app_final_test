const express = require('express')
const cookieParser = require('cookie-parser')
const routes = require('./routes/routes.js')
const app = express()

app.use ("/Images",express.static(__dirname + "/images"))

app.set('view engine', 'ejs')

app.use(cookieParser())
app.use(express.urlencoded({extended:false}))

app.use(routes)

app.listen(9090)
console.log("Server up on http://localhost:9090/")
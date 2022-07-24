const express = require("express")
const app = express({mergeParams: true})
const path = require("path")
const bodyParser = require('body-parser')
const db = require('./database')

const cors = require('cors')
var fs = require('fs')

const router = express.Router()

const session = require('express-session')
const KnexSessionStore = require('connect-session-knex')(session)
const store = new KnexSessionStore({
    knex: db,
    tablename: 'sessions'
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send({"mssg":"Something broke!"})
})

/**
 * Routing 
 */
app.use("/", router)
app.listen(process.env.port || 3000)

console.log("Running at Port 3000")


/**
 * Session
 */
app.use(session({
  store: store,
  secret: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 } // 1 week
}))


//load index
app.use("", require(path.normalize(__dirname+'/../routes/index.js')))

function loadV1Routes () {
  try {
    let routes_v1 = __dirname + '/../routes/v1'  
    routes_v1 = path.normalize(routes_v1)

    let files = fs.readdirSync(routes_v1)
   
    files.forEach(file => {
      let name = file.substr(0, file.indexOf('.'));
      let filepath = path.normalize(routes_v1 + '/' + name)
      
      app.use("/"+name, require(filepath))
    })
    
  }catch(exception){
    console.log(exception)
  }
}

loadV1Routes()


module.exports = app
const db = require('knex')({
  client: 'mysql',
  connection : {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
  },
  pool: {
    min: 2,
    max: 10
  }  
})

module.exports = db
const user = require('express').Router()

user.get("/", function(request, response) {
    response.send("This is the user homepage")
})

module.exports = user
const index = require('express').Router()

index.get("/", function(request, response) {
    response.send("Index page.")
})

index.get("/email_instructions", function(request, response ){

    let mssg = 'Please check your email and follow the instructions in the email.'

    //Check if user is not logged in

    response.send(mssg)
})

index.get("/success", function(request, response ){

    let mssg = 'Great job! Now you can log into your account.'

    //Check if user is not logged in

    response.send(mssg)
})



module.exports = index
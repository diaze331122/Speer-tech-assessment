const auth = require('express').Router()
const User = require('../../models/User')
const bcrypt = require('bcryptjs')
const StringUtilities = require('@supercharge/strings')
const moment = require('moment')
const Email = require('../../classes/Email')
const EmailTemplate = require('../../models/EmailTemplate')

auth.post("/login", async (request, response) => {
    let mssg = ''

    if (request.session.loggedin){
        return response.redirect('/user')   
    }

    if (request.body.email && request.body.password) {
        //Check if user exists
        let user = await User.query()
            .select('email','password')
            .where('email', '=', request.body.email)
            .where('status', '=', 1)
            .first()
        
        if (user) {
            let isMatch = await bcrypt.compare(request.body.password, user.password)

            if (isMatch) {
                request.session.loggedin = true
                return response.redirect('/user')    
            }
        }
    }

    mssg ="Invalid username or email"

    response.send(mssg)
})

auth.get('/logout', async (request, response) => {
    if (request.session.loggedin){
        request.session.destroy(error => {
            if (error) {
                response.status(400).send('Unable to logout')
            } else {
                return response.redirect('/')  
            }
        })         
    }    
})

auth.post("/create", async (request, response) => {
    let mssg = ''

    if (request.session.loggedin){
        return response.redirect('/user')
    }

    if (request.body.email && request.body.password){
        try {
            //Check if account with email exists.
            const userExists = await User.query()
                .findOne('email','=', request.body.email)
            
            if (userExists) {
                mssg = 'Sorry! An account with this email already exists.'
            } else {
                const salt = bcrypt.genSaltSync(10)
                const password = bcrypt.hashSync(request.body.password, salt)
        
                let token = StringUtilities.random(52)

                const newUser = await User.query()
                    .insert({
                        email : request.body.email,
                        password: password,
                        token: token,
                        created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                        token_expiry: moment().add(2, 'hours').format('YYYY-MM-DD HH:mm:ss')
                    })
                
                if (newUser) {
                    //fetch email template
                    const template = await EmailTemplate.query()
                        .findOne('code','=','ACC_CONF')
                    
                    //generate verification link
                    const verificationLink = `http://${request.headers.host}/auth/verify_account?email=${request.body.email}&token=${token}`
                    
                    let templateString = template.html

                    templateString = templateString.replace('${acc.conf.link}', verificationLink)

                    let templateAlternativeText = template.text.concat('',verificationLink)

                    let accountConfirmationEmail = new Email(
                        'noreply@test.com', 
                        request.body.email, 
                        template.title, 
                        templateAlternativeText,
                        templateString
                    )

                    accountConfirmationEmail.send()

                    return response.redirect('/email_instructions')
                }
            }
        }catch(exception){
            console.log(exception)
            mssg = 'Oops! There was an error creating your account.'
        }
    } else {
        mssg ="Invalid username or email"        
    }

    response.send(mssg)
})

auth.get("/verify_account", async (request, response) => {
    let mssg = ''

    if (request.session.loggedin){
        return response.redirect('/user')
    }

    if (request.query.email && request.query.token) {
        /**
         * Check if user and unexpired token exists
         */
        let verifyUser = await User.query()
            .select('email')
            .where('email', '=', request.query.email)
            .where('token', '=', request.query.token)
            .where('token_expiry', '>=', moment().format('YYYY-MM-DD HH:mm:ss'))
            .first()
            
        if (verifyUser instanceof User) {
            //Update user status to 'active' and verified_at

            await User.query().update({
                status: 1,
                verified_at: moment().format('YYYY-MM-DD HH:mm:ss') 
            })
            .where('email', '=', request.query.email)

            return response.redirect('/success')
        }
    } else {
        mssg = 'Invalid email or token'
    }

    response.send(mssg)
})

auth.delete("/delete_account", async (request, response) => {
    let mssg = ''
    let flag = false

    if (!request.session.loggedin){
        return response.redirect('/success')
    }

    if (request.body.email && request.body.password) {
        //Check if user exists
        let user = await User.query()
            .select('email','password')
            .where('email', '=', request.body.email)
            .first()

        if (user) {
            let isMatch = await bcrypt.compare(request.body.password, user.password)
    
            if (isMatch) {
                let deleted = await User.query()
                    .delete()
                    .where('email', '=', request.body.email)

                if (deleted > 0) {
                    //destroy session, redirect to homepage and send confirmation deletion email              
                    request.session.destroy((error) => {
                        if (error) {
                            response.status(400).send('Unable to delete session')
                        } else {
                            return response.redirect('/')  
                        }
                    })
                } else {
                    flag = true
                }
            } else {
                flag = true
            }
        } else {
            flag = true
        }    
    } else {
        flag = true
    }

    if (flag) {
        mssg = 'There was an error processing your request.'
        response.send(mssg)
    }
})
    
module.exports = auth
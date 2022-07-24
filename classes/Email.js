const { text } = require('express');
const nodemailer = require('nodemailer')

class Email {
    /**
     * Simple email handler
     * 
     * Note: No verification implemented
     * 
     * @param {*} sender 
     * @param {*} recipients 
     * @param {*} subject 
     * @param {*} body 
     */

    transporter = nodemailer.createTransport({
        host: process.env.EMAIL_AUTH_HOST,
        port: process.env.EMAIL_AUTH_PORT,
        auth: {
            user: process.env.EMAIL_AUTH_USER,
            pass: process.env.EMAIL_AUTH_PASSWORD
        }
    })

    constructor (sender, recipients, subject, text, body) {
        this.email = {
            from : sender,
            to : recipients,
            subject : subject,
            text: text,
            html : body
        }
    }

    send () {
        if (this.email){
            this.transporter.sendMail(this.email, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
            })
        }              
    }
}

module.exports = Email
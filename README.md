# Speer-tech-assessment
A simple backend api for authenticating users and sending email

To get started, you will need to have a running mysql db and an email service.

For this exercise, I created an rdb using amazon services and used mailtrap for email service. 

Create a .env file and place it in your root directory.

For the mysql database, you will need to have a `users` and `email_templates` table.

The `email_templates` table will need to the following columns: id, code, title, text, html, date_created, date_updated.

The `users` table will need to have the following columns: id, email, password, token, date_created, date_verified, date_updated, status.

const { Model } = require('objection')

const database = require('../configurations/database')

class EmailTemplate extends Model {
    static get tableName () {
        return 'email_templates'
    }
}

EmailTemplate.knex(database)

module.exports = EmailTemplate
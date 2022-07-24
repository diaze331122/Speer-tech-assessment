const { Model } = require('objection')

const database = require('../configurations/database')

class User extends Model {
    static get tableName () {
        return 'users'
    }
}

User.knex(database)

module.exports = User
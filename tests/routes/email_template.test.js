const request = require('supertest')
const app = require('../../configurations/server')
const EmailTemplate = require('../../models/EmailTemplate')

describe('email template parsing', () => {
    it('should parse html string',async () => {
        let sampletext = 'sampleurl'

        //fetch email template
        const template = await EmailTemplate.query()
            .findOne('code','=','ACC_CONF')

        let body = template.body

        body = body.replace('${acc.conf.link}', 'http://localhost:3000')

        

    })
})
const request = require('supertest')
const app = require('../../configurations/server')

describe('account auth', () => {
    it('should create a new entry in the Users table', async () => {
      const res = await request(app)
        .post('/auth/create')
        .send({
          email: 'archie@uwindsor.ca',
          password: 'kitty*4962!!_',
        })
      expect(res.statusCode).toEqual(302)
    })

    it('should verify the new account', async () => {
      const res = await request(app)
        .get('/auth/verify_account')
        .send({
          email: '', //create a new account and then use the token
          token: ''
        })
        expect(res.statusCode).toEqual(302)
    })

    it('should successfully login to account', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'michi@uwindsor.ca',
          password: 'HeyThere!2230s'
        })
        expect(res.statusCode).toEqual(302)      
    })

    it('should successfully logout', async () => {
      const res = await request(app)
        .get('/auth/logout')
        expect(res.statusCode).toEqual(302)      
    })    
})



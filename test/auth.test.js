let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;

chai.use(chaiHttp);
const url = 'http://localhost:3555';

describe('Autenticar usuario ', () => {
    it('Deberia recibir el token', (done) => {
        chai.request(url).post('/api/auth').send({ email: 'rayl@awd.com', password: 'password' }).end((err, res) => {
            // console.log(res.body)
            let token = res.body.token;
            // expect(res).to.have.cookie('authToken');
            expect(res).to.have.status(200);
            chai.request(url).get('/api/user/5fb957eddfe0ce3d1497bd88').set('x-token', token).end((err, res) => {
                console.log(res.body);
                expect(res).to.have.status(200);
                done();
            })  
        });
    });
});
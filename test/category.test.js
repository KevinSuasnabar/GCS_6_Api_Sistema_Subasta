let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;

chai.use(chaiHttp);
const url = 'http://localhost:3555';

describe('Obtener todas las categorias: ', () => {
    it('Deberia devolver las categorias', (done) => {
        chai.request(url).get('/api/category').end((err, res) => {
            console.log(res.body);
            expect(res).to.have.status(200);
            done();
        });
    });
});
var should = require("chai").should();
var calculator = require("../src/calculator");
describe("Calcultator tests using SHOULD interface from CHAI module: ", function () {
    describe("Check addTested Function: ", function () {
        it("Check the returned value using: value.should.equal(value): ", function () {
            result = calculator.addTested("text");
            result.should.equal("text tested");
        });
        it("Check the returned value using: value.should.be.a('value'): ", function () {
            result = calculator.addTested("text");
            result.should.be.a('string');
        });
        it("Check the returned value using: expect(value).to.have.lengthOf(value): ", function () {
            result = calculator.addTested("text");
            result.should.have.lengthOf(11);
        });
    });
});
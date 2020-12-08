var assert = require("chai").assert;
var calculator = require("../src/calculator");
describe("Calcultator tests using ASSERT interface from CHAI module: ", function () {
    describe("Check addTested Function: ", function () {
        it("Check the returned value using: assert.equal(value,'value'): ", function () {
            result = calculator.addTested("text");
            assert.equal(result, "text tested");
        });
        it("Check the returned value using: assert.typeOf(value,'value'): ", function () {
            result = calculator.addTested("text");
            assert.typeOf(result, "string");
        });
        it("Check the returned value using: assert.lengthOf(value,'value'): ", function () {
            result = calculator.addTested("text");
            assert.lengthOf(result, 11);
        });
    });
});
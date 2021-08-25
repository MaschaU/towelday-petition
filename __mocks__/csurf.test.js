const csurf = require("./csurf")
// @ponicode
describe("csurf", () => {
    test("0", () => {
        let callFunction = () => {
            csurf()
        }
    
        expect(callFunction).not.toThrow()
    })
})

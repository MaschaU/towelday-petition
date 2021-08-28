const cookie_session = require("./cookie-session")
// @ponicode
describe("cookie_session", () => {
    test("0", () => {
        let callFunction = () => {
            cookie_session()
        }
    
        expect(callFunction).not.toThrow()
    })
})

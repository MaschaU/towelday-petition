//BCRYPT//

const bcrypt = require("bcryptjs");
let {genSalt, hash, compare} = bcrypt;
const {promisify} = require("util");

//promisifying functions
genSalt = promisify(genSalt);
hash = promisify(hash);
compare = promisify(compare);

module.exports.hash = plainTxtPw => genSalt().then(salt=>hash(plainTxtPw,salt));
module.exports.compare = compare;








///DEMO OF BCRYPT FUNCTIONS///
//genSalt().then(salt=>{
//  console.log("salt:", salt);
//  //HASH expects 2 args- a clear text password and salt
//  return hash("safePassword", salt);
//}).then(hashedPw=>{
//    console.log("hashedPw:", hashedPw);
//comapare takes 2 args, a txtpass and hash to compare it to
//    return compare("safePassword", hashedPw);
//}).then(matchValueOfCompare=>{
//    console.log("Compare value is:", matchValueOfCompare);
//    console.log("Is password a match", matchValueOfCompare);
//});

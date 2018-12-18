const db = require('./utils/mongodb')
const userModel = require('./models/user')
const authCodeModel = require('./models/authorization_code')


// userModel.create({
//     userid: 'vrz',
//     userpassword: '123',
//     usergroup: 'administrator'
// }, function (err, res) {
//     if (err) {
//         console.log(err)
//     } else {
//         console.log(res)
//     }
// })
userModel.find(function (err, res) {
    if (err) {
        console.log(err)
    } else {
        console.log(res)
    }
})
// authCodeModel.create({
//     authorization_code: '769704987'
// }, function (err) {
//     if (err) {
//         console.log(err)
//     }    
// })
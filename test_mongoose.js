const db = require('./utils/mongodb')
const userModel = require('./models/user')
const authCodeModel = require('./models/authorization_code')
const chalk = require('chalk')


// userModel.find(function (err, res) {
//     if (err) {
//         console.log(err)
//     } else {
//         console.log(res)
//     }
// })
// authCodeModel.create({
//     authorization_code: '769704987'
// }, function (err) {
//     if (err) {
//         console.log(err)
//     }    
// })
userModel.deleteOne({
    userid: 'doc'
}, function (err,msg) {
    console.log(err)
    console.log(msg)
})
var util = require('util')

var mongoose = require('mongoose')

var Schema = mongoose.Schema

var userSchema = new Schema({
    userid:String,
    userpassword:String,
    usergroup:{ type: String, default: 'doctor'},
    username:{ type: String, default: 'nonamed'},
    created:{ type: Date, default: Date.now() }
},{
    collection: 'user',
    versionKey: false
})

const userModel = mongoose.model('user', userSchema)

module.exports = userModel

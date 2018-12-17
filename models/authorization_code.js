var mongoose = require('mongoose')

var Schema = mongoose.Schema

var authCodeSchema = new Schema({
    authorization_code: String,
    created:{ type: Date, default: Date.now() }
},{
    collection: 'authorization_code',
    versionKey: false
})

const authCodeModel = mongoose.model('authorization_code', authCodeSchema)

module.exports = authCodeModel

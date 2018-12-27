var util = require('util')

var mongoose = require('mongoose')

var Schema = mongoose.Schema

var annotationSchema = new Schema({
    AnnotationId:String,
    AnnotationFileCreationDate:Date,
    AnnotationFileName:String,
    ReferencedStudyInstanceUID:String,
    SOPInstanceUID:String,
    SOPClassUID:{type: String, default: '1.2.840.10008.5.1.4.1.1.11.1'},
    drawings:Object,
    drawingsDetails:Object,    
},{
    collection: 'annotation',
    versionKey: false
})

const annotationModel = mongoose.model('annotation', annotationSchema)

module.exports = annotationModel

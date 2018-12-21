var util = require('util')

var mongoose = require('mongoose')

var Schema = mongoose.Schema

var dicomSchema = new Schema({
    // study tag
    StudyInstanceUID:String,
    StudyDate:String,
    StudyTime:String,
    // patient tag
    PatientAge:String,
    PatientID:String,
    PatientName:String,
    PatientSex:String,
    // dicom tag
    DicomFilePath:String,
    // Hospital tag
    InstitutionName:String,
    Modality:String,
    Manufacturer:String,
    ManufacturerModelName:String,
    // image tag
    NumberOfFrames:String,
    Rows:String,
    Columns:String,
    ImageNumber:String
},{
    collection: 'dicom',
    versionKey: false
})

const dicomModel = mongoose.model('dicom', userSchema)

module.exports = dicomModel

const hbase = require('hbase')
const config = require("config-lite")(__dirname)
var assert = require('assert');
// Instantiate a new client
var client = hbase({
    host: '106.14.188.106',
    port: 8080
});
client.table('DicomAttrTest').scan({
    maxVersions: 1
}, function (err, rows) {
    if (err) {
        console.log('err')
        console.log(err)
        return
    }
    console.info('rows')
    console.info(rows)
})

// client
// .table('DicomAttr')
// .row('1.3.12.2.1107.5.2.32.35162.30000012020622041507900000157')
// .get(['File:DicomFilePath','File:DicomFileName'], function (err, vals) {
//     if (err) {
//         console.log(err)
//         return
//     }
//     var filePath = vals.find(function (val) {
//         return val.column === 'File:DicomFilePath'
//     })
//     var fileName = vals.find(function (val) {
//         return val.column === 'File:DicomFileName'
//     })
//     console.log(vals)
// })


// const scanner = client
//     .table('DicomAttr')
//     .scan({
//         //   columns: 'Study:StudyInstanceUID',
//         // filter: {
//         //     type: 'FirstKeyOnlyFilter'
//         // },
//         maxVersions: 1
//     })
// const dicomlist = []
// scanner.on('readable', function () {
//     while (chunk = scanner.read()) {
//         var dicomIndex = dicomlist.findIndex(function (dicom) {
//             return dicom.UID === chunk.key
//         })
//         if (dicomIndex !== -1) {
//             dicomlist[dicomIndex][chunk.column.split(':')[1]] = chunk.$
//         } else {
//             var dicom = {
//                 UID: chunk.key
//             }
//             dicom[chunk.column.split(':')[1]] = chunk.$
//             dicomlist.push(dicom)
//         }
//     }
// })

// scanner.on('error', function (err) {
//     console.log(err)
// })

// scanner.on('end', function () {
//     console.log(dicomlist)
// })

client
.table( 'DicomAttrTest' )
.regions(function(error, regions){
    if (error) {
        console.info('error2')
        console.info(error)
    } else {
        console.info('regions')
        console.info(regions)
    }

});
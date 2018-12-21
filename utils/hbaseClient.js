const mongoose = require('mongoose')
const hbase = require('hbase')
const config = require("config-lite")(__dirname)
const chalk = require('chalk')

var client = hbase(config.hbase);

module.exports = {
    getDicomList () {
        var dicomlist = []
        var finishFlag = false;
        const scanner = client
        .table('DicomAttr')
        .scan({
            maxVersions: 1
        })

        scanner.on('readable', function () {
            while (chunk = scanner.read()) {
                var dicomIndex = dicomlist.findIndex(function (dicom) {
                    return dicom.UID === chunk.key
                })
                if (dicomIndex !== -1) {
                    dicomlist[dicomIndex][chunk.column.split(':')[1]] = chunk.$
                } else {
                    var dicom = {
                        UID: chunk.key
                    }
                    dicom[chunk.column.split(':')[1]] = chunk.$
                    dicomlist.push(dicom)
                }
            }
        })
        
        scanner.on('error', function (err) {
            console.log(err)
        })
        
        scanner.on('end', function () {
            finishFlag = true;
        })

        while (!finishFlag) {
            return dicomlist
        }
        
    },
    getDicomFile (UID) {
        client.get()
    }
}
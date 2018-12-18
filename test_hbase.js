const hbase = require('hbase')
const config = require("config-lite")(__dirname)
var assert = require('assert');
// Instantiate a new client
client = hbase(config.hbase)
assert.ok(client.connection instanceof hbase.Connection)
// Create a table
// client
//     .table('2018-12-15')
//     .create('my_column_family', function (err, success) {
//         if (err) {
//             console.log(err)
//             return
//         }
//         // Insert a record
//         client
//             .table('my_table')
//             .row('my_row')
//             .put('my_column_family:my_column', 'my value', function (err, success) {
//                 if (err) {
//                     console.log('2')
//                     return
//                 }
//                 // // Read a record
//                 // client
//                 //     .table('my_table')
//                 //     .row('my_row')
//                 //     .get('my_column_family', function (err, [cell]) {
//                 //         // Validate the result
//                 //         assert(cell.key, 'my_row')
//                 //         assert(cell.column, 'my_column_family:my_column')
//                 //         assert(cell.$, 'my value')
//                 //     })
//             })
//     })
// Read a record
// client
//     .table('2018-12-15')
//     .row()
//     .get('Patient', function (err, [cell]) {
//         if (err) {
//             console.log('3')
//             return
//         }
//         console.log(cell)
//         // Validate the result
//         // assert(cell.key, 'my_row')
//         // assert(cell.column, 'my_column_family:my_column')
//         // assert(cell.$, 'my value')
//     })
client.table('2018-12-15').scan({
    startRow: "1.3.12.2.1107.5.2.32.35162.30000012020622041507900000157",
    maxVersions: 1
}, function (err, rows) {
    if (err) {
        console.log(err)
        return
    }
    console.info(rows)
})
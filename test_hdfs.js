const webhdfs = require('webhdfs')
const hdfsClient = webhdfs.createClient({
    user: 'webuser',
    host: '106.14.188.106',
    port: 50070,
    path: '/webhdfs/v1'
})
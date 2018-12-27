module.exports = {
  port: 3001,
  session: {
    secret: 'myblog',
    key: 'myblog',
    maxAge: 2592000000
  },
  mongodb: 'mongodb://localhost:27017/web2d',
  hbase: {
    host: '106.14.188.106',
    port: 8080
  },
  hdfs: {
    host: 'master.msopopop.cn',
    port: 50010
  },
  hbase_remote: 'slave.msopopop.cn:2181',
  json_file_path: '/home/verizonwu/JSONFile'
}

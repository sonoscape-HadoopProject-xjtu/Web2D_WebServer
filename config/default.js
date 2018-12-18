module.exports = {
  port: 3001,
  session: {
    secret: 'myblog',
    key: 'myblog',
    maxAge: 2592000000
  },
  mongodb: 'mongodb://localhost:27017/web2d',
  hbase: {
    host: 'master.msopopop.cn',
    port: 60010
  },
  hdfs: {
    host: 'master.msopopop.cn',
    port: 50010
  },
  hbase_remote: 'master.msopopop.cn:2181'
}

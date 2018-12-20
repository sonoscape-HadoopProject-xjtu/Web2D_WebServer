const hbase = require("hbase-rpc-client")
const should = require("should")
client = hbase({
    zookeeperHosts: ["master.msopopop.cn:2181"],
    zookeeperRoot: "/hbase-1.0.0",
    zookeeperReconnectTimeout: 20000,
    rootRegionZKPath: "/meta-region-server",
    rpcTimeout: 30000,
    callTimeout: 5000,
    tcpNoDelay: 'no',
    tcpKeepAlive: 'yes',
    realUser: "someRealUser",
    effectiveUser: "someEffectiveUser",
})
client.on("error", function (err) {
    console.log("hbase client error:", err)
})
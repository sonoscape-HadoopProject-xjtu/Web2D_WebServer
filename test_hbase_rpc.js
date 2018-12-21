const hbase = require("hbase-rpc-client")
const config = require("config-lite")(__dirname)
const should = require("should")
client = hbase({
    zookeeperHosts: ["slave.msopopop.cn:2181"],
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

client.getScanner('numOfRows', function (err, scanner) {
    var index = 0;
    var next = function (numberOfRows) {
        scanner.next(numberOfRows, function (err, rows) {
            // console.log(rows)
            should.not.exists(err);
            if (rows.length === 0) {
                // index.should.equal(5);
                return scanner.close(done);
            }

            rows.should.length(1);

            var closed = false;
            rows.forEach(function (row) {
                console.log(row)
                // var kvs = row.raw();
                // for (var i = 0; i < kvs.length; i++) {
                //     var kv = kvs[i];
                //     // kv.getRow().toString().should.equal('scanner-row' + index++);
                //     // kv.toString().should.include('/vlen=0/');
                //     console.log(kv.getRow().toString(), kv.toString())
                // }
            });

            if (closed) {
                return scanner.close(done);
            }

            next(numberOfRows);
        });
    };

    next(1);
});
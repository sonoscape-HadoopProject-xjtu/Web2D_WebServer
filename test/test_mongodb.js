'use strict';

const mongoose = require('mongoose');
const config = require("config-lite")(__dirname)
mongoose.connect(config.mongodb);
const db = mongoose.connection;
db.on('error', console.error.bind(console, '连接数据库失败'));
db.once('open',()=>{
  console.log('成功连接');
})

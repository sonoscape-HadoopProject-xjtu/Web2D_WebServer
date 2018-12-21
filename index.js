const db = require('./utils/mongodb')
const userModel = require('./models/user')
const authCodeModel = require('./models/authorization_code')

const hbase = require('hbase')

const path = require('path')
const express = require('express')
const session = require('express-session')
const config = require('config-lite')(__dirname)
const querystring = require('querystring')
const app = express()

const hbaseClient = hbase(config.hbase)

// 登录
app.post('/api/user/login', function (req, res) {
  var body = ''
  req.on('data', function (chunk) {
    body += chunk
  })
  req.on('end', function () {
    // 解析参数
    body = JSON.parse(body)
    console.log(body.userid)

    userModel.findOne({
      userid: body.userid,
      userid: body.userpassword
    }, function (err, userinfo) {
      if (err) {
        res.status(500)
      } else {
        if (userinfo) {
          res.send({
            status: 1,
            message: '登录成功',
            id_token: userinfo
          })
        } else {
          res.send({
            status: 0,
            message: '用户名或密码错误'
          })
        }
      }
    })
  })
})
// 注册
app.post('/api/user/signup', function (req, res) {
  var body = ''
  req.on('data', function (chunk) {
    body += chunk
  })
  req.on('end', function () {
    body = JSON.parse(body)
    authCodeModel.findOne({
      authorization_code: body.authorization_code
    }, function (err, authcode) {
      if (err) {
        res.status(500)
      } else {
        if (authcode) {
          userModel.find({
            userid: body.userid
          }, function (err, userinfo) {
            if (err) {
              res.status(500)
            } else {
              if (userinfo.length !== 0) {
                res.send({
                  status: 0,
                  message: '用户名已存在'
                })
              } else {
                userModel.create({
                  userid: body.userid,
                  userpassword: body.userpassword,
                  username: body.username,
                }, function (err, userinfo) {
                  if (err) {
                    res.status(500)
                  } else {
                    if (userinfo) {
                      res.send({
                        status: 1,
                        message: '用户创建成功',
                        id_token: userinfo
                      })
                    } else {
                      res.send({
                        status: 0,
                        message: '用户创建失败'
                      })
                    }
                  }
                })
              }
            }
          })
        } else {
          res.send({
            status: 0,
            message: '认证码无效'
          })
        }
      }
    })

  })
})
// 用户表单获取
app.get('/api/userlist', function (req, res) {
  // console.log(req.query)
  userModel.find(function (err, users) {
    if (err)
      res.status(500)
    else {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.end(JSON.stringify(users))
    }
  })
})
// dicom表单获取
app.get('/api/studylist', function (req, res) {
  var dicomlist = []
  hbaseClient.table('DicomAttrTest').scan({
    maxVersions: 1
  }, function (err, rows) {
    if (err) {
      console.log(err)
      return
    }
    rows.forEach(chunk => {
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
    })
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.end(JSON.stringify(dicomlist))
  })
})
// Dicom 路径获取
app.post('/api/studylist', function (req, res) {
  var body = ''
  req.on('data', function (chunk) {
    body += chunk
  })
  req.on('end', function () {
    console.log(body)
    hbaseClient
    .table('DicomAttrTest')
    .row(body)
    .get(['File:DicomFilePath','File:DicomFileName'], function (err, vals) {
        if (err) {
            console.log(err)
            return
        }
        var filePath = vals.find(function (val) {
            return val.column === 'File:DicomFilePath'
        })
        var fileName = vals.find(function (val) {
            return val.column === 'File:DicomFileName'
        })
        console.log(filePath)
    })
  })
})
// 监听端口，启动程序
app.listen(config.port, function () {
  console.log(`listening on port ${config.port}`)
})
const db = require('./utils/mongodb')
const userModel = require('./models/user')
const authCodeModel = require('./models/authorization_code')
const annotationModel = require('./models/annotation')

const hbase = require('hbase')
const fs = require('fs')
const path = require('path')
const express = require('express')
const session = require('express-session')
const config = require('config-lite')(__dirname)
const querystring = require('querystring')
const app = express()

const hbaseClient = hbase(config.hbase)

// 设置头，解决跨域问题
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// 登录
app.post('/api/user/login', function (req, res) {
  console.log('1')
  var body = ''
  req.on('data', function (chunk) {
    body += chunk
  })
  req.on('end', function () {

    // 解析参数
    body = JSON.parse(body)
    console.log(body.userid)
    console.log(db.readyState)
    if (db.readyState !== 1) {
      res.status(500).send()
    } else {
      userModel.findOne({
        userid: body.userid,
        userpassword: body.userpassword
      }, function (err, userinfo) {
        if (err) {
          res.status(500).send()
        } else {
          if (userinfo) {
  
            res.status(200).send({
              status: 1,
              message: '登录成功',
              id_token: userinfo
            })
          } else {
            res.status(200).send({
              status: 0,
              message: '用户名或密码错误'
            })
          }
        }
      })
    }    
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
    if (db.readyState !== 1) {
      res.status(500).send()
    } else {
      authCodeModel.findOne({
        authorization_code: body.authorization_code
      }, function (err, authcode) {
        if (err) {
          res.status(500).send()
        } else {
          if (authcode) {
            userModel.find({
              userid: body.userid
            }, function (err, userinfo) {
              if (err) {
                res.status(500).send()
              } else {
                if (userinfo.length !== 0) {
                  res.status(200).send({
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
                      res.status(500).send()
                    } else {
                      if (userinfo) {
                        res.status(200).send({
                          status: 1,
                          message: '用户创建成功',
                          id_token: userinfo
                        })
                      } else {
                        res.status(200).send({
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
            res.status(200).send({
              status: 0,
              message: '认证码无效'
            })
          }
        }
      })
    }
  })
})
// 用户表单获取
app.get('/api/userlist', function (req, res) {
  // console.log(req.query)
  if (db.readyState !== 1) {
    res.status(500).send()
  } else {
    userModel.find(function (err, users) {
      if (err)
        res.status(500).send()
      else {
        res.status(200).send(JSON.stringify(users))
      }
    })
  }
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
    res.status(200).send(JSON.stringify(dicomlist))
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
    })
  })
})
// 删除用户
app.post('/api/user/delete', function (req, res) {
  var body = ''
  req.on('data', function (chunk) {
    body += chunk
  })
  req.on('end', function () {
    if (db.readyState !== 1) {
      res.status(500).send()
    } else {
      userModel.deleteOne({
        userid: body
      }, function (err,msg) {
        if (err) {
          res.status(500).send()
        } else {
          if (msg.n === 1) {
            res.status(200).send({
              status: 1,
              message: '删除用户成功！'
            })
          } else {
            res.status(200).send({
              status: 0,
              message: '删除用户异常！'
            })
          }
        }      
      })
    }
  })
})

// 更新用户资料
app.post('/api/user/update', function (req, res) {
  var body = ''
  req.on('data', function (chunk) {
    body += chunk
  })
  req.on('end', function () {
    if (db.readyState !== 1) {
      res.status(500).send()
    } else {
      body = JSON.parse(body)
      userModel.updateOne({
        userid: body.userid
      }, {
        $set: body
      }, function (err) {
        if (err) {
          res.status(200).send({
            status: 0,
            message: '更新用户失败！'
          })
        } else {
          res.status(200).send({
            status: 1,
            message: '更新用户成功！'
          })
        }      
      })
    }
  })
})

// 保存标注
app.post('/api/savedraws', function (req, res) {
  var body = ''
  req.on('data', function (chunk) {
    body += chunk
  })
  req.on('end', function () {
    body = JSON.parse(body)
    console.log(body)
    annotationModel.findOne({
      ReferencedStudyInstanceUID: body.ReferencedStudyInstanceUID
    }, function (err, item) {
      if (err) {
        res.status(200).send({
          status: 0,
          message: '保存失败！'
        })
        return
      }
      if (item) {
        annotationModel.updateOne({
          ReferencedStudyInstanceUID: body.ReferencedStudyInstanceUID
        }, {
          $set: body
        }, function (err) {
          if (err) {
            res.status(200).send({
              status: 0,
              message: '保存失败！'
            })
          } else {
            res.status(200).send({
              status: 1,
              message: '保存成功！'
            })
          }
        })
      } else {
        annotationModel.create(body, function (err) {
          if (err) {
            res.status(200).send({
              status: 0,
              message: '保存失败！'
            })
          } else {
            res.status(200).send({
              status: 1,
              message: '保存成功！'
            })
          }          
        })
      }
    })    
  })
})

// 获取标注
app.post('/api/getdraws', function (req, res) {
  var body = ''
  req.on('data', function (chunk) {
    body += chunk
  })
  req.on('end', function () {
    annotationModel.findOne({
      ReferencedStudyInstanceUID: body
    }, function (err, item) {
      if (err) {
        res.status(200).send({
          status: 0,
          message: '获取失败！'
        })
      } else {
        if (item) {
          res.status(200).send({
            status: 1,
            item
          })
        } else {
          res.status(200).send({
            status: 0,
            message: '不存在历史标注！'
          })
        }
      }
    })
  })
})

// 监听端口，启动程序
app.listen(config.port, function () {
  console.log(`listening on port ${config.port}`)
})
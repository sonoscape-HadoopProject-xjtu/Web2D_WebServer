const db = require('./utils/mongodb')
const userModel = require('./models/user')
const authCodeModel = require('./models/authorization_code')

const path = require('path')
const express = require('express')
const session = require('express-session')
const config = require('config-lite')(__dirname)
const querystring = require('querystring')
const app = express()

// // 设置模板目录
// app.set('views', path.join(__dirname, 'views'))
// // 设置模板引擎为 ejs
// app.set('view engine', 'ejs')

// // 设置静态文件目录
// app.use(express.static(path.join(__dirname, 'public')))
// // session 中间件
// app.use(session({
//   name: config.session.key, // 设置 cookie 中保存 session id 的字段名称
//   secret: config.session.secret, // 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
//   resave: true, // 强制更新 session
//   saveUninitialized: false, // 设置为 false，强制创建一个 session，即使用户未登录
//   cookie: {
//     maxAge: config.session.maxAge// 过期时间，过期后 cookie 中的 session id 自动删除
//   },
//   store: new MongoStore({// 将 session 存储到 mongodb
//     url: config.mongodb// mongodb 地址
//   })
// }))

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
            message: '登录成功'
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
          }, function (err,userinfo) {
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
                  username: body.userid,
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
  var response = {
    data: {}
  }
  userModel.find(function (err,users) {
    if(err)
      res.status(500)
    else {
      response = users
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.end(JSON.stringify(response))
    }
  })  
})
// dicom表单获取
app.get('/api/users', function (req, res) {
  console.log(req.query)
  res.setHeader("Access-Control-Allow-Origin", "*");
  var response = {
    link: {

    },
    data: {
      name: 'name',
      email: 'email',
      birthdate: 'birthdate',
      address: {
        line1: 'line1',
        line2: 'line2',
        zipcode: 'zipcode'
      }
    }
  }
  res.end(JSON.stringify(response))
})
// 监听端口，启动程序
app.listen(config.port, function () {
  console.log(`listening on port ${config.port}`)
})
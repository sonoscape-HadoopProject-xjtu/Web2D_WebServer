const db = require('./utils/mongodb')
const userModel = require('./models/user')
const authCodeModel = require('./models/authorization_code')

const ADMIN_NAME = 'XJTU_SLST'
const ADMIN_ID = 'admin'
const ADMIN_PASSWORD = 'xjtuslst'
const INITIAL_AUTHORIZATION_CODE = 'xjtuslst'
// 等待3000ms 使数据库连接
setTimeout(function () {
    if (db.readyState !== 1) {
        console.log('数据库未连接！')
    } else {
        userModel.findOne({
            userid: ADMIN_ID
        }, function (err, item) {
            if (err) {
                console.log(err)
            } else {
                if (item) {
                    console.log('该ID已存在！')
                } else {
                    userModel.create({
                        userid: ADMIN_ID,
                        username: ADMIN_NAME,
                        userpassword: ADMIN_PASSWORD,
                        usergroup: 'administrator'
                    },function (err) {
                        if (err) {
                            console.log(err)                        
                        } else {
                            console.log('管理员:' + ADMIN_ID + '创建成功！')
                        }
                    })
                }
            }
        })
        authCodeModel.findOne({
            authorization_code: INITIAL_AUTHORIZATION_CODE
        }, function (err, one) {
            if (err) {
                console.log(err)            
            } else {
                if (one) {
                    console.log('该授权码已存在！')                
                } else {
                    authCodeModel.create({
                        authorization_code: INITIAL_AUTHORIZATION_CODE
                    }, function (err) {
                        if (err) {
                            console.log(err)                        
                        } else {
                            console.log('授权码：' + INITIAL_AUTHORIZATION_CODE + '添加成功！')
                        }                    
                    })
                }
            }
            
        })
    }    
}, 3000);

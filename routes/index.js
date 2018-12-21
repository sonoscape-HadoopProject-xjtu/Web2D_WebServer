module.exports = function (app) {
  app.get('/', function (req, res) {
    res.redirect('/welcome')
  })
  app.use('/welcome', require('./welcome'))
  app.use('/signup', require('./signup'))
  app.use('/signin', require('./signin'))
  app.use('/signout', require('./signout'))
  app.use('/userinfo', require('./userinfo'))
  app.use('/usermanagement', require('./usermanagement'))

  app.use(function (req, res) {
    if (!res.headersSent) {
      res.status(404)
    }
  })
}

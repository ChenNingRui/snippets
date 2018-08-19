let express = require('express')
let expressLayouts = require('express-ejs-layouts')
let bodyParser = require('body-parser')
let fs = require('fs')
let https = require('https')

// key and certificate for https
let privateKey = fs.readFileSync('./encryption/private.pem', 'utf8')
let certificate = fs.readFileSync('./encryption/file.crt', 'utf8')
let options = {key: privateKey, cert: certificate}

let app = express()
// let port = 4000
let port = 4000

app.use(bodyParser.urlencoded({extended: true}))

var router = require('./app/routes')
app.use('/', router)
app.use(express.static(__dirname + './public'))

app.set('view engine', 'ejs')
app.use(expressLayouts)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.send(err.status + ' ' + err.message)
})

// app.listen(port, function () {
//   console.log('start')
// })
https.createServer(options, app).listen(port, function () {
  console.log('start')
})

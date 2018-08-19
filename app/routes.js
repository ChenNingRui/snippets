let express = require('express')
let user = require('./user')
let test = require('./text')
let mongod = require('./mongod')

let router = express.Router()
module.exports = router

let curUser = null
let usertexts = null
let searchname = null
let searchtexts = null
let textname = null
let textContent = null
let alert = null

mongod.init()

router.get('/', function (req, res) {
  alert = null
  res.status(202).send(202 + ' OK')
  res.render('pages/index', {
    username: curUser,
    usertexts: null,
    searchtexts: searchtexts,
    textname: textname,
    textContent: textContent,
    alert: alert})
})

router.get('/save', function (req, res) {
  res.status(403).send(403 + ' forbidden')
})

router.get('/delete', function (req, res) {
  res.status(403).send(403 + ' forbidden')
})

router.get('/signIn', function (req, res) {
  res.status(403).send(403 + ' forbidden')
})

router.get('/search', function (req, res) {
  res.status(403).send(403 + ' forbidden')
})
router.get('/register', function (req, res) {
  res.status(403).send(403 + ' forbidden')
})

router.get('/signIn', function (req, res) {
  res.status(403).send(403 + ' forbidden')
})

router.get('/signOut', function (req, res) {
  res.status(403).send(403 + ' forbidden')
})

router.get('/usertexts', function (req, res) {
  res.status(403).send(403 + ' forbidden')
})

router.get('/searchtexts', function (req, res) {
  res.status(403).send(403 + ' forbidden')
})

router.post('/search', function (req, res) {
  searchname = req.body.authorname
  user.findUserByName(searchname).then(function (response) {
    textname = null
    textContent = null
    alert = null

    if (response === null) {
      searchtexts = null
      alert = 'The username - ' + searchname + ' cannot be found'
    } else {
      searchtexts = response[0].texts
    }

    res.render('pages/index', {
      username: curUser,
      usertexts: usertexts,
      searchtexts: searchtexts,
      textname: textname,
      textContent: textContent,
      alert: alert
    })
  })
})

router.post('/save', function (req, res) {
  if (curUser !== null) {
    test.saveChanging(curUser, req.body.textname, req.body.contentTxt).then(function (response) {
      user.findUserByName(curUser).then(function (response) {
        usertexts = response[0].texts
        alert = null
        textname = req.body.textname
        textContent = req.body.contentTxt

        res.render('pages/index', {
          username: curUser,
          usertexts: usertexts,
          searchtexts: searchtexts,
          textname: textname,
          textContent: textContent,
          alert: alert})
      })
    })
  } else {
    textname = null
    textContent = null
    alert = 'You do not have permission to access this action'

    res.render('pages/index', {
      username: curUser,
      usertexts: usertexts,
      searchtexts: searchtexts,
      textname: textname,
      textContent: textContent,
      alert: alert})
  }
})

router.post('/delete', function (req, res) {
  if (curUser !== null) {
    test.deleteTextByName(curUser, req.body.textname).then(function (response) {
      user.findUserByName(curUser).then(function (response) {
        usertexts = response[0].texts
        textname = null
        textContent = null

        res.render('pages/index', {
          username: curUser,
          usertexts: usertexts,
          searchtexts: searchtexts,
          textname: textname,
          textContent: textContent,
          alert: alert})
      })
    })
  } else {
    textname = null
    textContent = null
    alert = 'You do not have permission to access this action'

    res.render('pages/index', {
      username: curUser,
      usertexts: usertexts,
      searchtexts: searchtexts,
      textname: textname,
      textContent: textContent,
      alert: alert})
  }
})

router.post('/register', function (req, res) {
  user.register(req.body.name, req.body.password).then(function (response) {
    textname = null
    textContent = null

    if (response) {
      alert = null
      curUser = response.username
    } else {
      curUser = null
      alert = 'This username has been used'
    }

    res.render('pages/index', {
      username: curUser,
      usertexts: usertexts,
      searchtexts: searchtexts,
      textname: textname,
      textContent: textContent,
      alert: alert})
  })
})

router.post('/signIn', function (req, res) {
  user.signIn(req.body.name, req.body.password).then(function (response) {
    textname = null
    textContent = null

    if (response) {
      usertexts = response[0].texts
      alert = null
      curUser = response[0].username
    } else {
      alert = 'Username or Password is not correct'
      usertexts = null
      curUser = null
    }

    res.render('pages/index', {
      username: curUser,
      usertexts: usertexts,
      searchtexts: searchtexts,
      textname: textname,
      textContent: textContent,
      alert: alert})
  })
})

router.post('/signOut', function (req, res) {
  if (curUser) {
    curUser = null
    usertexts = null
    textname = null
    textContent = null
    alert = null

    res.render('pages/index', {
      username: curUser,
      usertexts: usertexts,
      searchtexts: searchtexts,
      textname: textname,
      textContent: textContent,
      alert: alert})
  }
})

router.post('/usertexts', function (req, res) {
  if (curUser !== null) {
    test.findText(curUser, req.body.submit).then(function (response) {
      if (response.length !== 0) {
        textname = response[0].textname
        textContent = response[0].content
        alert = null

        res.render('pages/index', {
          username: curUser,
          usertexts: usertexts,
          searchtexts: searchtexts,
          textname: textname,
          textContent: textContent,
          alert: alert})
      }
    })
  }
})

router.post('/searchtexts', function (req, res) {
  if (searchname !== null) {
    test.findText(searchname, req.body.submit).then(function (response) {
      if (response.length !== 0) {
        textname = response[0].textname
        textContent = response[0].content
        alert = null
      } else {
        alert = 'This text had been deleted'
        textname = null
        textContent = null
      }

      res.render('pages/index', {
        username: curUser,
        usertexts: usertexts,
        searchtexts: searchtexts,
        textname: textname,
        textContent: textContent,
        alert: alert})
    })
  }
})

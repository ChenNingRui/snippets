module.exports = {
  signIn: signIn,
  register: register,
  findUserByName: findUserByName
}

let mongod = require('./mongod')
let bcrypt = require('bcrypt')

const saltRounds = 10

function signIn (username, password) {
  return new Promise(function (resolve, reject) {
    mongod.findUser(username).then(function (response) {
      let result = null
      if (response != null && response.length !== 0) {
        bcrypt.compare(password, response[0].password, function (error, res) {
          if (res) {
            result = response
            resolve(result)
          } else {
            resolve(result)
          }
        })
      } else {
        resolve(result)
      }
    }).catch((error) => {
      console.log('Oop, signIn error:' + error)
    })
  })
}

function register (username, password) {
  return new Promise(function (resolve, reject) {
    mongod.findUser(username).then(function (response) {
      if (response != null && response.length !== 0) {
        // username has been used
        response = null
        resolve(response)
      } else {
        // create a new account
        bcrypt.hash(password, saltRounds, function (error, hash) {
          mongod.createUser({username: username, password: hash}).then(function (response) {
            resolve(response)
          })
        })
      }
    })
  })
}

function findUserByName (username) {
  return new Promise(function (resolve, reject) {
    mongod.findUser(username).then(function (response) {
      if (response != null && response.length !== 0) {
        resolve(response)
      } else {
      // cannot found the username in db
        resolve(null)
      }
    })
  })
}

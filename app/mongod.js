module.exports = {
  createUser: createUser,
  createText: createText,
  findText: findText,
  findUser: findUser,
  updateText: updateText,
  init: init,
  removeTextItemOnUser: removeTextItemOnUser
}

let mongoose = require('mongoose')

let Text
let User

// initiated the db condition
function init () {
  let MONGO_URI = 'mongodb://localhost/test'
  mongoose.connect(MONGO_URI, {useMongoClient: true}, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err)
    } else {
      console.log('Connection established to', MONGO_URI)
    }
  })
  mongoose.Promise = global.Promise

  createType()
}

function createType () {
  let Schema = mongoose.Schema

  // user
  let userSchema = new Schema({
    username: String,
    password: String,
    texts: []
  })

  // text
  let textSchema = new Schema({
    username: String,
    textname: String,
    content: String
  })

  Text = mongoose.model('Text', textSchema)
  User = mongoose.model('User', userSchema)
}

// username texxtname content
function createText (paramArr) {
  return new Promise(function (resolve, reject) {
    let textEntity = new Text({username: paramArr.username, textname: paramArr.textname, content: paramArr.content})
    textEntity.save(function (error) {
      if (error) {
        console.log('Oop,mongod createText error ' + error)
      }
      addTextItemOnUser(paramArr.username, paramArr.textname).then(function (response) {
        resolve(textEntity)
      })
    })
  })
}

// username password
function createUser (paramArr) {
  return new Promise(function (resolve, reject) {
    let userEntity = new User({username: paramArr.username, password: paramArr.password, texts: []})
    userEntity.save(function (error) {
      if (error) {
        console.log('Oop,mongod createUser error ' + error)
      }
    })
    resolve(userEntity)
  })
}

// By username & textname
function findText (paramArr) {
  return new Promise(function (resolve, reject) {
    let query = {'username': paramArr.username, 'textname': paramArr.textname}
    Text.find(query, function (error, docs) {
      if (error || !docs) {
        console.log('Oop,mongod findText error ' + error)
        resolve(null)
      } else {
        resolve(docs)
      }
    })
  })
}

// By username
function findUser (username) {
  return new Promise(function (resolve, reject) {
    let query = {'username': username}
    User.find(query, function (error, docs) {
      if (error || !docs) {
        console.log('Oop,mongod findUser error ' + error)
        resolve(null)
      } else {
        resolve(docs)
      }
    })
  })
}

function updateText (paramArr) {
  return new Promise(function (resolve, reject) {
    let query = {username: paramArr.username, textname: paramArr.textname}
    Text.update(query, {content: paramArr.content}, {multi: true}, function (error, docs) {
      if (error || !docs) {
        console.log('Oop,mongod updateText error ' + error)
      }
      resolve(docs)
    })
  })
}

function addTextItemOnUser (username, textname) {
  return new Promise(function (resolve, reject) {
    let query = {username: username}
    User.update(query, {$addToSet: {texts: textname}}, {multi: true}, function (error, docs) {
      if (error || !docs) {
        console.log('Oop,mongod addTextItemOnUser error ' + error)
      }
      resolve(docs)
    })
  })
}

function removeTextItemOnUser (username, textname) {
  return new Promise(function (resolve, reject) {
    // remove the text from User
    let query = {username: username}
    User.update(query, {$pull: {texts: textname}}, {multi: true}, function (error, docs) {
      if (error || !docs) {
        console.log('Oop,mongod updateUserList error ' + error)
      }
      resolve(docs)
    })

    // remove the text
    query = {username: username, textname: textname}
    Text.remove(query, function (error, docs) {
      if (error || !docs) {
        // nothing need to do
        console.log('Oop,mongod removeText error ' + error)
      }
    })
  })
}

module.exports = {
  deleteTextByName: deleteTextByName,
  saveChanging: saveChanging,
  findText: findText
}

let mongod = require('./mongod')

// creating a new text or update
function saveChanging (username, textname, content) {
  return new Promise(function (resolve, reject) {
    mongod.findText({username, textname}).then(function (response) {
      if (response != null && response.length !== 0) {
      // update
        mongod.updateText({username: username, textname: textname, content: content}).then(function (response) {
          resolve(response)
        })
      } else {
      // new
        mongod.createText({username: username, textname: textname, content: content}).then(function (response) {
          resolve(response)
        })
      }
    })
  })
}

function deleteTextByName (username, textname) {
  return new Promise(function (resolve, reject) {
    mongod.removeTextItemOnUser(username, textname).then(function (response) {
      resolve(response)
    })
  })
}

function findText (username, textname) {
  return new Promise(function (resolve, reject) {
    mongod.findText({username, textname}).then(function (response) {
      resolve(response)
    })
  })
}

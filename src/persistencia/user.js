const mongoose =require('mongoose')
const bCrypt = require('bcrypt')

const userCollection = 'users'

const UserSchema = new mongoose.Schema({
    username: String,
    password: String
})

const isValidPassword = function(user, password) {
    return bCrypt.compareSync(password, user.password)
}

const createHash = function(password) {
    return bCrypt.hashSync(passsword, bCrypt.genSaltSync(10), null)
}

const UserModel = mongoose.model(userCollection, UserSchema)

module.exports = {UserModel, isValidPassword, createHash}
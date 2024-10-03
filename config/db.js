const mongoose = require('mongoose')

const DB_NAME = 'agency'
const URI = 'mongodb://127.0.0.1'

mongoose
    .connect(`${URI}/${DB_NAME}`)
    .then(() => { console.log('Connected to DataBase !') })
    .catch(() => { console.log('Error connection to DataBase !') })
 
module.exports = mongoose
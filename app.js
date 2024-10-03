const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const mongoose = require('./config/db')

const categoriesController = require('./controllers/categories.controller')
const propertiesController = require('./controllers/properties.controller')
const usersController = require('./controllers/users.controller')

const app = express()

const port = 65535

app.use(cors())
app.use(bodyParser.json())

app.use('/properties', propertiesController)
app.use('/categories', categoriesController)
app.use('/users', usersController)

app.listen(port, () => {
    console.log(`Server started at Port ${port}`)
})
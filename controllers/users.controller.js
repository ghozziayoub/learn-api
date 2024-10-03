const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('./../models/user')

const app = express()

app.get('/', async (req, res) => {
    try {
        const users = await User.find()

        res.status(200).send(users)
    }
    catch (error) {
        res.status(400).send({ message: "Error fetching data", error: error })
    }
})

app.get('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const user = await User.findOne({ _id: id })

        if (!user) {
            res.status(404).send({ message: "user not found !" })
        } else {
            res.status(200).send(user)
        }

    } catch (error) {
        res.status(400).send({ message: "Error fetching data", error: error })
    }
})

app.post('/signup', async (req, res) => {
    try {
        const user = req.body

        const hashedPassword = bcrypt.hashSync(user.password)

        const userToSave = new User({
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            password: hashedPassword,
            role: user.role,
        })

        await userToSave.save()

        res.status(201).send({ message: "user saved !" })
    } catch (error) {
        res.status(400).send({ message: "user already exist !", error: error })
    }
})

app.post('/signin', async (req, res) => {
    try {
        const data = req.body

        const user = await User.findOne({ email: data.email })

        if (!user) {
            res.status(404).send({ message: "user not found !" })
        } else {

            const compare = bcrypt.compareSync(data.password, user.password)

            if (!compare) {
                res.status(404).send({ message: "user not found !" })
            } else {

                const payload = { userId: user._id , role : user.role }
                const token = jwt.sign(payload, "SECRET_KEY")

                res.status(200).send({ token: token })
            }
        }
    } catch (error) {
        res.status(400).send({ message: "user not found !", error })
    }
})

app.patch('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const data = req.body

        const user = await User.findOneAndUpdate({ _id: id }, data, { new: true })

        if (!user) {
            res.status(404).send({ message: "user not found !" })
        } else {
            res.status(200).send(user)
        }

    } catch (error) {
        res.status(400).send({ message: "Error fetching data", error: error })
    }
})

app.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id
        await User.findOneAndDelete({ _id: id })

        if (!user) {
            res.status(404).send({ message: "user not found !" })
        } else {
            res.status(200).send({ message: "user deleted" })
        }

    } catch (error) {
        res.status(400).send({ message: "Error fetching data", error: error })
    }
})



module.exports = app
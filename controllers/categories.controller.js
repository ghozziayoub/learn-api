const express = require('express')

const Category = require('./../models/category')

const app = express()

app.get('/all/old', (req, res) => {
    Category
        .find()
        .then((categories) => {
            res.status(200).send(categories)
        })
        .catch(() => {
            res.status(400).send({ message: "Error fetching data" })
        })
})

app.get('/', async (req, res) => {
    try {
        const categories = await Category.find()

        res.status(200).send(categories)
    }
    catch (error) {
        res.status(400).send({ message: "Error fetching data", error: error })
    }
})

app.get('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const category = await Category.findOne({ _id: id })

        if (!category) {
            res.status(404).send({ message: "category not found !" })
        } else {
            res.status(200).send(category)
        }

    } catch (error) {
        res.status(400).send({ message: "Error fetching data", error: error })
    }
})

app.post('/', (req, res) => {
    // get data from postman / front
    const category = req.body
    // creation d'un objet
    const categoryToSave = new Category({ name: category.name })

    categoryToSave
        .save()
        .then(() => {
            res.status(201).send({ message: "category saved !" })
        })
        .catch(() => {
            res.status(400).send({ message: "category already exist !" })
        })
})

app.patch('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const data = req.body

        const category = await Category.findOneAndUpdate({ _id: id }, data, { new: true })

        if (!category) {
            res.status(404).send({ message: "category not found !" })
        } else {
            res.status(200).send(category)
        }

    } catch (error) {
        res.status(400).send({ message: "Error fetching data", error: error })
    }
})

app.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id
        await Category.findOneAndDelete({ _id: id })

        if (!category) {
            res.status(404).send({ message: "category not found !" })
        } else {
            res.status(200).send({ message: "category deleted" })
        }

    } catch (error) {
        res.status(400).send({ message: "Error fetching data", error: error })
    }
})

module.exports = app
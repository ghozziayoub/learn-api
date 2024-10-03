const express = require('express')

const Property = require('../models/property')

const app = express()

app.get('/', async (req, res) => {
    try {
        const properties = await Property.aggregate(
            [
                {
                    $lookup: {
                        from: 'categories', // the name of the collection in MongoDB
                        localField: 'category', // field in the Property model
                        foreignField: '_id', // field in the Category model
                        as: 'categoryDetails' // output array containing category details
                    }
                },
                {
                    $unwind: '$categoryDetails' // to get a single object instead of an array
                },
                {
                    $project: {
                        name: 1, // include property name
                        price: 1,
                        'categoryDetails.name': 1 // include the category name
                    }
                }
            ]);

        res.status(200).send(properties)
    }
    catch (error) {
        res.status(400).send({ message: "Error fetching data", error: error })
    }
})

app.get('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const property = await Property.findOne({ _id: id })

        if (!property) {
            res.status(404).send({ message: "property not found !" })
        } else {
            res.status(200).send(property)
        }

    } catch (error) {
        res.status(400).send({ message: "Error fetching data", error: error })
    }
})

app.post('/', (req, res) => {

    const property = req.body

    const propertyToSave = new Property({
        name: property.name,
        price: property.price,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        area: property.area,
        floor: property.floor,
        parking: property.parking,
        category: property.category,
    })

    propertyToSave
        .save()
        .then(() => {
            res.status(201).send({ message: "property saved !" })
        })
        .catch(() => {
            res.status(400).send({ message: "property already exist !" })
        })
})

app.patch('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const data = req.body

        const property = await Property.findOneAndUpdate({ _id: id }, data, { new: true })

        if (!property) {
            res.status(404).send({ message: "property not found !" })
        } else {
            res.status(200).send(property)
        }

    } catch (error) {
        res.status(400).send({ message: "Error fetching data", error: error })
    }
})

app.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id
        await Property.findOneAndDelete({ _id: id })

        if (!property) {
            res.status(404).send({ message: "property not found !" })
        } else {
            res.status(200).send({ message: "property deleted" })
        }

    } catch (error) {
        res.status(400).send({ message: "Error fetching data", error: error })
    }
})

module.exports = app
const express = require("express");
const Item = require("../models/item");

const router = express.Router();

// ----------------------------------
// CREATE - POST /api/items
// ----------------------------------
router.post("/items", async (req, res) => {
    try {
        const item = new Item(req.body);

        const savedItem = await item.save();

        res.status(201).json(savedItem);
    } catch (err) {
        res.status(400).json({
            error: err.message
        });
    }
});


// ----------------------------------
// READ ALL - GET /api/items
// ----------------------------------
router.get("/items", async (req, res) => {
    try {
        const items = await Item.find();

        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});


// ----------------------------------
// READ ONE - GET /api/items/:id
// ----------------------------------
router.get("/items/:id", async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                error: "Item not found"
            });
        }

        res.status(200).json(item);
    } catch (err) {
        res.status(400).json({
            error: "Invalid item ID"
        });
    }
});


// ----------------------------------
// UPDATE - PUT /api/items/:id
// ----------------------------------
router.put("/items/:id", async (req, res) => {
    try {
        const item = await Item.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!item) {
            return res.status(404).json({
                error: "Item not found"
            });
        }

        res.status(200).json(item);
    } catch (err) {
        res.status(400).json({
            error: err.message
        });
    }
});


// ----------------------------------
// DELETE - DELETE /api/items/:id
// ----------------------------------
router.delete("/items/:id", async (req, res) => {
    try {
        const item = await Item.findByIdAndDelete(req.params.id);

        if (!item) {
            return res.status(404).json({
                error: "Item not found"
            });
        }

        res.status(200).json({
            message: "Item deleted successfully"
        });
    } catch (err) {
        res.status(400).json({
            error: "Invalid item ID"
        });
    }
});


module.exports = router;
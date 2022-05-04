const { Schema, model } = require("mongoose");

const movieSchema =  new Schema({
    userId: {type: Number, required: true},
    title: { type: String, required: true },
    released: { type: Date, required: true },
    genre: { type: String, required: true },
    director: { type: String, required: true }
}, { timestamps: true })

const movieModel = model("movie", movieSchema);

module.exports = movieModel;
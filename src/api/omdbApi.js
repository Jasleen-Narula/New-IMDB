const axios = require("axios");
const HttpException = require("../utils/httpException");
require('dotenv').config()

const url = process.env.OMDB_URL;
const apiKey = process.env.OMDB_API_KEY;

async function getMovieDataByTitle(title) {
  try {
    const request = `${url}?t=${title}&apikey=${apiKey}`;
    const movieDetails = await axios.get(request);

    return movieDetails.data;
  } catch (error) {
    throw new HttpException(404, "The movie details could not be fetched");  }
}

module.exports = {
  getMovieDataByTitle,
};

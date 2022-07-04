const movieRouter = require("express").Router();
const movieService = require("./movie.service");
const HttpException = require("../utils/httpException");
const { getMovieDataByTitle } = require("../api/omdbApi");

// GET movies/:id
movieRouter.get("/", async (req, res) => {
  const item = await movieService.find({ userId: req.user.userId });
  res.status(200).json(item);
});

// POST movies
movieRouter.post("/", async (req, res, next) => {
  try {
    const { title } = req.body;
    if (title === "") {
      next(new HttpException("400", "Title is required"));
      return;
    }

    //Basic users are restricted to create 5 movies per month
    if (
      req.user.role === "basic" &&
      (await movieService.findUserMoviesFromCurrentMonth(req.user.userId)) >= 5
    ) {
      next(
        new HttpException(
          "405",
          "Basic users are restricted to create 5 movies per month"
        )
      );
      return;
    }

    //fetch movie details
    const movieData = await getMovieDataByTitle(title);

    if(movieData.Error){
      next(
        new HttpException(
          "400",
          "Movie not found"
        )
      );
      return;
    }
    const { Title, Released, Genre, Director } = movieData;

    //check if title is duplicate
    const item = await movieService.find({
      title: Title,
      userId: req.user.userId,
    });

    if (item && item.length) {
      next(new HttpException("409", "Duplicate Error"));
      return;
    }

    const movie = {
      title: Title,
      released: Released,
      genre: Genre,
      director: Director,
      userId: req.user.userId,
      createdAt: new Date(),
    };

    const newItem = await movieService.saveItem(movie);

    res.status(201).json(newItem);
    
  } catch (e) {
    throw new Error("Something went wrong!");
  }
});

module.exports = movieRouter;

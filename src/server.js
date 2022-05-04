const express = require("express");
const bodyParser = require("body-parser");
const { authFactory, AuthError, authCheck } = require("./auth");
const HttpException = require("./utils/httpException");
const dbConnect = require("./utils/dbConnect");
const movieRouter = require("./movies/movie.router");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../docs");

require('dotenv').config()

const PORT = 3000;
const { JWT_SECRET } = process.env;

if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET env var. Set it and restart the server");
}

const auth = authFactory(JWT_SECRET);
const app = express();

app.use(bodyParser.json());

dbConnect();

// serve api docs
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(authCheck);

app.post("/auth", (req, res, next) => {
  if (!req.body) {
    return res.status(400).json({ error: "invalid payload" });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "invalid payload" });
  }

  try {
    const token = auth(username, password);

    return res.status(200).json({ token });
  } catch (error) {
    if (error instanceof AuthError) {
      return res.status(401).json({ error: error.message });
    }

    next(error);
  }
});

app.use("/movie", movieRouter);

app.use((error, _, res, __) => {
  
  if (error instanceof HttpException) {
    return res
      .status(error.statusCode)
      .json({ message: error.message, status: error.statusCode });
  }
  console.error(
    `Error processing request ${error}. See next message for details`
  );
  console.error(error);

  return res.status(500).json({ error: "internal server error" });
});

const server = app.listen(PORT, async () => {
  console.log(`auth svc running at port ${PORT}`);
});

module.exports = {
  app,
  server,
};

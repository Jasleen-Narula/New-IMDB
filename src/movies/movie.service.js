const movieModel = require("./movie.model");
/**
 * Service Methods
 */

async function saveItem(data) {
  const movie = new movieModel(data);
  return movie.save();
}

async function find(payload) {
  return movieModel.find(payload);
}

async function findUserMoviesFromCurrentMonth(userId) {
  const currentDate = new Date();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  return movieModel.count({
    userId,
    createdAt: {
      $gte: firstDayOfMonth,
      $lte: lastDayOfMonth,
    },
  });
}

async function removeItems(){
  return movieModel.deleteMany();
}

module.exports = {
  saveItem,
  find,
  findUserMoviesFromCurrentMonth,
  removeItems
};

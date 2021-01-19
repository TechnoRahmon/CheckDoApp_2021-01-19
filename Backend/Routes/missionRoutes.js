const Router = require("express").Router();
const missionController = require("../controller/missionController");
const {missionValidator} = require('../middleware/missionValidator')

 Router.route("/user/:userId/missions")
    .get(missionController.getMissions)
    //.post(missionController.new);

// Router.route("/article/:article_id")
//   .get(missionController.view)
//   .delete(missionController.delete);

module.exports = Router;

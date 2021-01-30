const Router = require("express").Router();
const missionController = require("../controller/missionController");
const {missionValidator} = require('../middleware/missionValidator')

 Router.route("/user/:userId/missions")
    .get(missionController.getMissions)
    .post(missionValidator ,missionController.new);

 Router.route("/user/:userId/mission/:missionId")
    .get(missionController.view)
//   .delete(missionController.delete);

module.exports = Router;

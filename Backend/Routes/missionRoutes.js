const Router = require("express").Router();
const missionController = require("../controller/missionController");
const {missionValidator} = require('../middleware/missionValidator')
const {isLoggedIn}=require('../middleware/userMiddleware')

 Router.route("/user/missions")
    .get(isLoggedIn,missionController.getMissions)
    .post(isLoggedIn,missionValidator ,missionController.new);

 Router.route("/user/mission/:missionId")
   .get(isLoggedIn,missionController.view)
   .delete(isLoggedIn,missionController.delete);

module.exports = Router;

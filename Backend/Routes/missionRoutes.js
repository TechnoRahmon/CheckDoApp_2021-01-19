const Router = require("express").Router();
const missionController = require("../controller/missionController");
const {missionValidator} = require('../middleware/missionValidator')
const {isLoggedIn}=require('../middleware/userMiddleware')

 Router.route("/missions")
    .get(isLoggedIn,missionController.getMissions)
    .post(isLoggedIn,missionValidator ,missionController.new);

 Router.route("/mission/:missionId")
   .get(isLoggedIn,missionController.view)
   .delete(isLoggedIn,missionController.delete);


 Router.route("/mission/:missionId/start-action")
   .get(isLoggedIn,missionController.startAction)

Router.route("/mission/:missionId/end-action")
   .get(isLoggedIn,missionController.endAction);

   
module.exports = Router;

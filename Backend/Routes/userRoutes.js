const Router = require('express').Router(); 
const UserController = require('../controller/userController')
const { addUserValidator } = require('../middleware/userMiddleware')


Router
    .route('/user')
        .post( addUserValidator ,UserController.addUserDetails)

Router 
    .route('/login')
        .post(UserController.userLogin)
Router 
    .route('/logout')
        .get(UserController.logout)    


Router 
    .route('/valid')
        .post(UserController.isTokenValid)
    
module.exports = Router;
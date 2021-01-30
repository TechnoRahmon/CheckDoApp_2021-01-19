
const {check,validatorresult } = require('express-validator');


 const missionValidator = [
  check('name')
        .notEmpty().withMessage('The name Should Not Be Empty')
        .bail()
        .isString().withMessage('The name Should Be String'),
  check("description")
    .notEmpty().withMessage("description can not be empty"),

    
];






module.exports = { missionValidator };
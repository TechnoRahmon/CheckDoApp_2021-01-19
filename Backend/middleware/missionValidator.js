
const {check,validatorresult } = require('express-validator');


 const missionValidator = [
  check('name')
        .notEmpty().withMessage('The Name Should Not Be Empty')
        .bail()
        .isString().withMessage('The Name Should Be String'),
  check("url")
        .notEmpty().withMessage("url can not be empty")
        .bail()
       .isURL().withMessage('The URL Should Be Correct'),
  check("source_code")
      .notEmpty().withMessage("Source Code can not be empty")
      .bail()
      .isURL().withMessage('The Source Code Should Be Correct'),
  check("description")
    .notEmpty().withMessage("description can not be empty"),

    
];






module.exports = { missionValidator };
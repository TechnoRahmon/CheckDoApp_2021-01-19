const {check} = require('express-validator')


//must include one lowercase character, one uppercase character, a number, and a special character.
    const addUserValidator = [
        check('username').notEmpty().withMessage(' Username Should Not Be Empty')
        .bail()
        ,

        check('email').notEmpty().withMessage('Email Should Not Be Empty').bail()
        .isEmail().withMessage('Invalid Emial'),

        check('password').notEmpty().withMessage('Password Should Not Be Empty')
        .bail()
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i")
        .withMessage('Invalid Password Entries, Use 8 or more characters with a mix of letters, numbers & symbols ')
    ]
module.exports = { addUserValidator }
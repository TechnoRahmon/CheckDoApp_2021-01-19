const {check} = require('express-validator')
const jwt = require('jsonwebtoken');
const User = require('../Models/userModel')


//cheack user Token
const Check_token = async (req, res,next)=>{
        // if token is exist in req
        if (req.cookies['token']){
            try {
                //retrieve the token
                const accessToken = req.cookies['token'];
                const { userId } = await jwt.verify(accessToken, process.env.TOKEN)
                const user = await User.find({_id : userId })
                //console.log('user '+user[0]); 
                 res.locals.loggedInUser = user[0];
                //console.log(`res here : ${res.locals.loggedInUser}`.yellow)
                next()
            } catch (error) {
                return res.status(500).json({ success:false, error:'Server Error'+ error})
            }
        }else{
            next()
        }
        
}

// is user logged in
const  isLoggedIn=async (req,res,next)=>{
        try {
            const user = res.locals.loggedInUser
            if (!user) return res.status(401).json({success:false, error:'You Need To Login To Have Access.'})
            req.user = user;
            next()
        } catch (error) {
            next(error)
        }
}

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
module.exports = { addUserValidator ,Check_token,isLoggedIn}
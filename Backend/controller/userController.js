const Users = require('../Models/userModel')
const bcrypt  = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {  validationResult } = require('express-validator')



//********** validation Resault ************

 function getValidationResualt(req){
            const error = validationResult(req)
            if(!error.isEmpty())
                return error.array() 
            return false
 }

//********** is email exist ************
async function isEmailExist(email){
        const user =await Users.find({ email : email})
        //console.log('inner func :',user);
        if (user) return user
        return false
}

//********** is passwords Matched ************
async function isPwdsMatched(oldPwd , newPwd ){
        //compare the passwords 
        return await bcrypt.compare(oldPwd, newPwd)
}



//********** valid token  ********** 
//@des Check token validation
//@route Get api/v1/valid
//@accesss Public
exports.isTokenValid = async(req,res,next)=>{
        try{
            const token =  req.header('x-auth-token');
            // console.log('token from controller : '.green ,token,'*'.green);
            if (!token) return res.status(401).json(false)

            const verified = jwt.verify(token , process.env.TOKEN)
            if(!verified) return res.status(401).json(false)

            const user = await Users.findById(verified.id)
            if(!user) return res.status(404).json(false)

            return res.status(200).json({
                success:true,
                user:{
                    id:user._id,
                    username : user.username,
                }
            })
        }
        catch(err){
            return res.status(500).json({ success:false, error : 'Server Error : '+err})
        }
}



//********** register **********
//@des Add  new User
//@route Get api/v1/user
//@accesss Public

exports.addUserDetails = async (req, res ,next)=>{
    try{
        const errors = getValidationResualt(req)
        if(errors)
        //returning only first error allways 
            return res.status(400).json({ success:false , msg:errors[0].msg })

        const { email , password , username } = req.body; 
        //check the eamil 
        const user =await isEmailExist(email)
        console.log(user);

        if ( user.length) return res.status(400).json({ success:false , msg:'This Email is already registered'})
        //hash password
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);
        
        //add new instance 
        const newUser = new Users({
            username : username,  
            email : email , 
            password : passwordHash,
        })
        const savedUser = await newUser.save(); 
    
        return res.status(200).json({ success:true , data: savedUser})
    }
    catch(err){
        if ( err.name == 'ValidationError') return res.status(400).json({ success:false, error : 'Server Error'})
        return res.status(500).json({ success:false, error : 'Server Error : '+err})
    }
}

//********** login **********
//@des login User
//@route Get api/v1/login
//@accesss Public

exports.userLogin = async (req, res ,next)=>{
    try{
        const errors = getValidationResualt(req)
        if(errors)
        //returning only first error allways 
            return res.status(400).json({ success:false , msg:errors[0] })

        const { email , password } = req.body; 

        //check the eamil 
        const user =await isEmailExist(email) ;
        //console.log(user);
        if ( !user.length ) return res.status(400).json({ success:false , msg:'This Email is Not registered'})

        // is the passwords matched  (new pwd , old pwd )
        const isMatched = await isPwdsMatched(password, user[0].password ); 
        //console.log('matcheing pwd' ,isMatched);
        if ( !isMatched )return res.status(400).json({ success:false , msg:'The Password is Not Correct'})

        //generate token 
        const token = jwt.sign({userId: user[0]._id.toString() }, process.env.TOKEN , { algorithm:"HS256"} )
         
        
        return res.status(200).json({ success:true ,token, user:{username:user[0].username }})
    }
    catch(err){
        return res.status(500).json({ success:false, error : 'Server Error : '+err})
    }
}

exports.logout =  async (req,res,next)=>{
    try {
        res.cookie('token','');
        return res.status(200).json({success:true, msg:'User logged out successfully'})
    } catch (error) {
        return res.status(500).json({success:false, error:'Server Error'+error})
    }
}
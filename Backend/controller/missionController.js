const Mission = require('../Models/missionsModel');
const User = require('./userController')
const {  validationResult } = require('express-validator')








//********** validation Resault ************

function getValidationResualt(req){
  const error = validationResult(req)
  if(!error.isEmpty())
      return error.array() 
  return false
}




// @Desc Get all Missions for singal user
// @Route /api/v2/user/userId/missions
// @access privat only for account owner 

exports.getMissions = async (req, res) => {
  try {
    const { userId }  = req.params
    const missions = await Mission.find({ userId : userId }).populate('userId' , 'username')
    if ( !missions.length ) return res.status(404).json({ success:false, err: 'NO Missions Found'})

    return res.status(200).json({
        success:true,
        data:missions, 
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      err: 'Server Error '+error,
    });
  }
};


// @des add new mission
// @Route /api/v2/user/userId/missions
// @access privat only for account owner 

exports.new = async(req, res)=>{
    try {
        const errors = getValidationResualt(req); 
        if ( errors ) return res.status(400).json({ success:false , msg:errors[0].msg })
         
        const { userId } = req.params
        const { name , description } = req.body; 
         
        const mission = new Mission();
        mission.userId = userId;
        mission.name = name;
        mission.description = description; 
        await mission.save();

        return res.status(201).json({  success: true, data: mission  })

    } catch (error) {
      if(error)console.log(`${error}`.red.bold);
        res.status(500).json({
            success: false,
            err:'Server Error : '+error
        })
    }
}


//@des View single mission
// @Route /api/v2/user/userId/mission/missionId 
// @access privat only for account owner 

exports.view = async (req, res) => {
  try {
    const { userId , missionId  } = req.params ; 

    const mission = await Mission.find({ _id : missionId, userId :userId }).populate('userId' ,' username')

    if (!mission.length)return res.status(404).json({ success: false,  err: "Mission is not found", });
    

    return res.status(200).json({ success: true,  data: mission  });
    
  } catch (error) {
    // Error condtion
    
     return res.status(500).json({
      success: false,
      err: "Server error: " +error,
    });
  }
};




// @des delete  Mission
exports.delete = async function (req, res) {
  try {
    const Mission = await Mission.findById(req.params.Mission_id);
    if (!Mission) {
      return res.status(404).json({
        success: false,
        err: "Mission is not exist",
      });
    }
    await Mission.deleteOne({ _id: Mission._id }, (err) => {
      res.json({
        success: true,
        message: "Mission deleted",
      });
    });
  } catch (error) {
      res.json({
        err: error.message,
        success:false
        // message: "something worng!"
      });
    
  }
};
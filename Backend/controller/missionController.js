const Mission = require('../Models/missionsModel');
const User = require('./userController')
const {  validationResult } = require('express-validator')


/************** calculate the final total for the mission :function */

const get_final_total = (log)=>{
  console.log(log);
      let total={days:0,hours:0,minutes:0};
      log.forEach(element => {   
        //console.log(total); 
          total.days += element.total.days;
          total.hours += element.total.hours;
          total.minutes += element.total.minutes;
      });
      return total
}
/********************************************** */



/************* get Times diffrace function ********************* */
const get_time_diffrance= (in_date , out_date)=>{
      const date2= new Date(in_date)
      const date1= new Date(out_date)
      let  diffrance_days,diffrace_hours,diffrance_minutes = 0;

      console.log(date2, date1);
      // get the milisecondes diffrance.
      const diffrance_time = date1.getTime()-date2.getTime();

      //calculate the days
      diffrance_days= Math.floor(diffrance_time / (1000*3600*24)) ;
      console.log('days:'+diffrance_days);

      //calculate the hours
      if ((diffrance_time / (1000*3600*24)) - diffrance_days > 0 )
        diffrace_hours = ((diffrance_time / (1000*3600*24)) - diffrance_days)*24
      console.log('hours :'+Math.floor(diffrace_hours));

      //calculate the minutes
    if (diffrace_hours -Math.floor(diffrace_hours)  > 0 )
        diffrance_minutes = Math.round((diffrace_hours -Math.floor(diffrace_hours))*60)
    console.log('minutes :'+Math.round(diffrance_minutes));


    return { days:diffrance_days , hours:diffrance_days , minutes: diffrance_minutes}
      //console.log(`total is: ${diffrance_days} days ${diffrance_days}h:${diffrance_minutes}m`);
    }


//********** validation Resault ************

function getValidationResualt(req){
  const error = validationResult(req)
  if(!error.isEmpty())
      return error.array() 
  return false
}




// @Desc Get all Missions for singal user
// @Route /api/v2/missions
// @access privat only for account owner 

exports.getMissions = async (req, res) => {
  try {
    const userId = req.user._id
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
// @Route /api/v2/missions
// @access privat only for account owner 

exports.new = async(req, res)=>{
    try {
        const errors = getValidationResualt(req); 
        if ( errors ) return res.status(400).json({ success:false , msg:errors[0].msg })
         
        const userId = req.user._id
        const { name , description } = req.body; 
         // console.log('req.user :'+req.user);
        const mission = new Mission();
        mission.userId =userId;
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
// @Route /api/v2/mission/missionId 
// @access privat only for account owner 

exports.view = async (req, res) => {
  try {
    const { missionId  } = req.params ; 
    const userId = req.user._id;
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
// @Route /api/v2/mission/missionId 
// @access privat only for account owner
exports.delete = async function (req, res) {
  try {
    const mission = await Mission.findOne({_id : req.params.missionId, userId: req.user._id});

    if (!mission) {return res.status(404).json({success: false,err: "Mission does not exist" })}

    await mission.deleteOne();
    return res.status(200).json({ success: true,message: "Mission deleted" });

  } catch (error) {
     return res.status(500).json({err: 'Server Error'+error , success:false });
  }
};




// @des start Action
// @Route /api/v2/mission/missionId/start-action
// @access privat only for account owner
exports.startAction = async (req,res,next)=>{
  try {
    //get the user and mission id 
      const user  = req.user;
    const { missionId} =req.params

    // get specific mission 
    const mission = await Mission.findOne({_id:missionId , userId: user._id}); 
    //check the missoin does exist
    if (!mission) return res.status(404).json({success:false, error:'Mission Does Not Exist'})
    //check if the action is ended, before we start a new action.
    if(mission.mission_log.length){
      const action_in = mission.mission_log[mission.mission_log.length-1].in; 
      const action_out = mission.mission_log[mission.mission_log.length-1].out; 
      //console.log(`in ${action_in} , out : ${action_out}`);

      if ( action_in && !action_out ){
          return res.status(400).json({success:false, msg:"The Action is Already Started"})
      }
    
    }


    //push the start time into Mission_log
    await mission.updateOne({$push:{mission_log:{in:Date.now()} } })
    
   
    return res.status(200).json({success:true, msg:'Action Started', action:mission.mission_log });

  } catch (error) {
    return res.status(500).json({err: 'Server Error'+error , success:false });
  }
}





// @des end Action
// @Route /api/v2/mission/missionId/end-action
// @access privat only for account owner
exports.endAction = async (req,res,next)=>{
  try {
    

    //get the user and mission id 
    const user  = req.user;
    const { missionId} =req.params

    // get specific mission 
    const mission = await Mission.findOne({_id:missionId , userId: user._id}); 
    //check the missoin does exist
    if (!mission) return res.status(404).json({success:false, error:'Mission Does Not Exist'})
    //check if the action is started, before we end the action.
    if(mission.mission_log.length){
          const action_in = mission.mission_log[mission.mission_log.length-1].in; 
          const action_out = mission.mission_log[mission.mission_log.length-1].out; 
          //console.log(`in ${action_in} , out : ${action_out}`);
        
          if (mission.mission_log.length && action_in && action_out ){
              return res.status(400).json({success:false, msg:"The Action is Already Ended, Start New Action"})
          }


        // calculate the total to push into mission_log!!
          const startPoint = mission.mission_log[mission.mission_log.length-1].in;
          const endPoint = Date.now();
          const Total= get_time_diffrance(startPoint,endPoint);
          //console.log(`The total :`,Total );
        //***********/
        mission.mission_log[mission.mission_log.length-1].total.days = Total.days;
        mission.mission_log[mission.mission_log.length-1].total.hours = Total.hours;
        mission.mission_log[mission.mission_log.length-1].total.minutes = Total.minutes;
        mission.mission_log[mission.mission_log.length-1].out = endPoint;
         await mission.save();
   
        //push the start time into Mission_log
        //await mission.updateOne({'mission_log':{$slice:-1}},{$set:{'mission_log.$.out':Date.now() } })
        
      
        return res.status(200).json({success:true, msg:'Action Ended', action:mission.mission_log });
    }
        return res.status(400).json({success:false, msg:'Action Cannot Be End, Start Action First' });
  } catch (error) {
    return res.status(500).json({err: 'Server Error'+error , success:false });

  }
}







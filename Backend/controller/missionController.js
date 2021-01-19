const Mission = require('../Models/missionsModel');

// @Desc Get all Missions for singal user
// @Route /api/v2/user/userId/missions
exports.getMissions = async (req, res) => {
  try {
    const { userId }  = req.body
    const missions = await Mission.find({ userId : userId })
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

// @des add new post

exports.new = async(req, res)=>{
    try {
      console.log("reqBody: ",req.body)
        const Mission = new Mission();
        Mission.title = req.body.title;
        Mission.content = req.body.content;
        await Mission.save();

        return res.status(201).json({
            success: true,
            data: Mission
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            err: error.message
        })
    }
}


//@des View artcle
exports.view = async (req, res) => {
  try {
    const Mission = await Mission.findById(req.params.Mission_id);

    if (!Mission) {
      console.log("error 404, prjocet not found".red);
      return res.status(404).json({
        success: false,
        err: "Mission is not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: Mission,
    });
  } catch (error) {
    // Error condtion
     return res.status(500).json({
      success: false,
      err: "Server error: " + error.message,
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
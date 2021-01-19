const mongoose = require('mongoose');

const missoinSchma = new mongoose.Schema({
    userId : { type: mongoose.Schema.Types.ObjectId, ref: 'Users'  },
    name :{type: String, required: true},
    description : { type:String, required: true },

    mission_log :[{ in:{type : Date },
                    out : {type : Date },
                    total: { hours :{ type: Number}, minutes : { type :Number} }  }],

    createdAt: { type: Date, default: Date.now },
    total_logs:{ hours :{ type: Number}, minutes : { type :Number}}
})

module.exports = mongoose.model("Missions", missoinSchma);

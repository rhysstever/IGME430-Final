const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let TeamModel = {};

// mongoose.Types.ObjectID is a function that
// converts string ID to real mongo ID
const convertID = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const TeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  size: {
    type: Number,
    min: 0,
    required: true,
  },

  leader: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

TeamSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  size: doc.size,
  leader: doc.leader,
});

TeamSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertID(ownerId),
  };

  return TeamModel.find(search).select('name size leader').lean().exec(callback);
};

TeamModel = mongoose.model('Team', TeamSchema);

module.exports.TeamModel = TeamModel;
module.exports.TeamSchema = TeamSchema;

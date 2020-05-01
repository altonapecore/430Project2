const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let SiteModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const SiteSchema = new mongoose.Schema({
  siteName: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  tag: {
    type: String,
    required: true,
  },
  creator: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

SiteSchema.statics.toAPI = (doc) => ({
  siteName: doc.siteName,
  tag: doc.tag,
});

SiteSchema.statics.findByTag = (tag, callback) => {
  const search = {
    tag,
  };

  return SiteModel.find(search).select('siteName tag').lean().exec(callback);
};

SiteSchema.statics.findAll = (callback) => SiteModel.find().select('siteName tag').lean().exec(callback);

SiteSchema.statics.findByUser = (creatorId, callback) => {
  const search = {
    creator: convertId(creatorId),
  };

  return SiteModel.find(search).select('siteName tag').lean().exec(callback);
};

SiteSchema.statics.getSite = (callback) => {
  SiteModel.findAll((err, doc) => {
    if (err) {
      return callback(err);
    }

    if (!doc) {
      return callback();
    }

    const array = Object.values(doc);

    const count = array.length;

    const randomNumber = Math.floor(Math.random() * Math.floor(count));

    const site = array.slice(randomNumber + 1, randomNumber + 2);

    return callback(null, site);
  });
};

SiteModel = mongoose.model('Site', SiteSchema);

module.exports.SiteModel = SiteModel;
module.exports.SiteSchema = SiteSchema;

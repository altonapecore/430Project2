const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let SiteModel = {};

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
    owner: tag,
  };

  return SiteModel.find(search).select('siteName').lean().exec(callback);
};

SiteSchema.statics.findAll = (callback) => SiteModel.find().select('name').lean().exec(callback);

SiteModel = mongoose.model('Site', SiteSchema);

module.exports.SiteModel = SiteModel;
module.exports.SiteSchema = SiteSchema;

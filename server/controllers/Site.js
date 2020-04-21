const models = require('../models');

const { Site } = models;

const makeSite = (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'Site name is required' });
  }

  const siteData = {
    siteName: req.body.siteName,
    tag: req.body.tag,
    creator: req.session.account._id,
  };

  const newSite = new Site.SiteModel(siteData);

  const sitePromise = newSite.save();

  sitePromise.then(() => res.json({ redirect: '/maker' }));

  sitePromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(4000).json({ error: 'Site already exists' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return sitePromise;
};

const makerPage = (req, res) => {
  Site.SiteModel.findAll((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), sites: docs });
  });
};

// Gets all sites for not
const getSite = (req, res) => Site.SiteModel.findAll((err, docs) => {
  if (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error occurred' });
  }

  return res.json({ sites: docs });
});

module.exports.makerPage = makerPage;
module.exports.getSite = getSite;
module.exports.make = makeSite;

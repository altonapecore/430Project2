const models = require('../models');

const { Site } = models;

// Creates a new site and saves it to the database
const makeSite = (req, res) => {
  if (!req.body.siteName) {
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

const getTagForm = (req, res) => {
  res.render('getByTag', { csrfToken: req.csrfToken() });
};

// Brings up the maker page
const makerPage = (req, res) => {
  Site.SiteModel.findByUser(req.session.account._id,
    (err, docs) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occurred' });
      }

      return res.render('app', { csrfToken: req.csrfToken(), sites: docs });
    });
};

// Gets all sites
const getAllSites = (req, res) => Site.SiteModel.findAll((err, docs) => {
  if (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error occurred' });
  }

  return res.json({ sites: docs });
});

// Gets all the sites that a user has added
const getUserSites = (req, res) => Site.SiteModel.findByUser(req.session.account._id,
  (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ sites: docs });
  });

const getByTag = (req, res) => Site.SiteModel.findByTag(req.body.tag,
  (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ sites: docs });
  });

const getRandomSite = (req, res) => Site.SiteModel.getSite((err, docs) => {
  if (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error occurred' });
  }

  return res.json({ sites: docs });
});

module.exports.makerPage = makerPage;
module.exports.getAllSites = getAllSites;
module.exports.getUserSites = getUserSites;
module.exports.makeSite = makeSite;
module.exports.getTagForm = getTagForm;
module.exports.getByTag = getByTag;
module.exports.getSite = getRandomSite;

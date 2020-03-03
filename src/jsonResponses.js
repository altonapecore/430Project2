const sites = {
  'http://tinytuba.com/': 'weird',
  'http://burymewithmymoney.com/': 'weird',
  'http://eelslap.com/': 'weird',
  'http://beesbeesbees.com/': 'funny',
  'http://www.staggeringbeauty.com/': 'weird',
  'https://chrismckenzie.com/': 'computers',
  'http://hasthelargehadroncolliderdestroyedtheworldyet.com/': 'science',
  'http://corndog.io/': 'weird',
  'http://ihasabucket.com/': 'funny',
  'http://www.republiquedesmangues.fr/': 'weird',
  'http://www.rrrgggbbb.com/': 'computers',
  'http://imaninja.com/': 'computers',
  'http://www.movenowthinklater.com/': 'computers',
  'http://www.ismycomputeron.com/': 'funny',
  'https://happyhappyhardcore.com/': 'weird',
  'http://www.everydayim.com/': 'funny',
  'http://ninjaflex.com/': 'weird',
};

const tags = [
  'funny',
  'weird',
  'science',
  'computers',
];

const getSite = () => {
  const keys = Object.keys(sites);
  const site = keys[Math.floor(Math.random() * keys.length)];
  return site;
};

const findByTag = (tagName) => {
  const foundSites = [];
  const keys = Object.keys(sites);
  const values = Object.values(sites);
  for (let i = 0; i < keys.length; i++) {
    if (values[i] === tagName) {
      foundSites.push(keys[i]);
    }
  }

  return foundSites;
};

// Regular expression to see if a url is valid or not
function validateUrl(value) {
  return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
}

const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

// Simply returns the sites object
const getAllSites = (request, response) => {
  const object = {
    message: sites,
    id: 'allSites',
  };

  respondJSON(request, response, 200, object);
};

// Returns one random site
const getRandomSite = (request, response) => {
  // Create the response where the message is the site
  const site = getSite();
  const object = {
    message: site,
    id: 'randomSite',
  };

  respondJSON(request, response, 200, object);
};

// Gets all the sites that have the provided tag
const getTagPage = (request, response, params) => {
  const obj = findByTag(params.tag);

  const object = {
    id: 'viewTag',
    message: 'Sites have been grabbed!',
    sites: obj,
    tag: params.tag,
  };

  respondJSON(request, response, 200, object);
};

// Sumbits a site
const submitSite = (request, response, params) => {
  // If there is no tag or siteName provided give back a bad request
  if (!params.tag || !params.siteName) {
    const object = {
      id: 'badRequest',
      message: 'Missing necessary parameters',
    };

    respondJSON(request, response, 400, object);
    return;
  }
  const tagName = params.tag;
  const { siteName } = params;

  // Check to see if the siteName is valid
  // If it isn't send back a bad request
  if (!validateUrl(siteName)) {
    const object = {
      id: 'badRequest',
      message: 'URL is not valid',
    };

    respondJSON(request, response, 400, object);
    return;
  }

  // Add the site
  sites[siteName] = tagName;

  const object = {
    id: 'siteAdded',
    message: 'Site added!',
    url: siteName,
    tag: tagName,
  };

  respondJSON(request, response, 200, object);
};

// Submit a new tag
const submitTag = (request, response, params) => {
  // If there is no tag send back a bad request
  if (!params.tag) {
    const object = {
      id: 'badRequest',
      message: 'Missing necessary parameters',
    };

    respondJSON(request, response, 400, object);
    return;
  }

  const tagName = params.tag;

  // If the tag is already there send back a bad request
  if (tags.includes(tagName)) {
    const object = {
      id: 'tagNotAdded',
      message: `${tagName} is already added`,
    };

    respondJSON(request, response, 200, object);
  } 
  // Add the tag
  else {
    tags.push(tagName);
    const object = {
      id: 'tagAdded',
      message: `${tagName} added successfully!`,
      tag: tagName,
    };

    respondJSON(request, response, 201, object);
  }
};

const getAllTags = (request, response) => {
  const allTags = Object.assign({}, tags);
  const object = {
    id: 'AllTags',
    message: allTags,
  }

  respondJSON(request, response, 200, object);
}

module.exports = {
  getAllSites,
  getRandomSite,
  getTagPage,
  submitSite,
  submitTag,
  getAllTags,
};

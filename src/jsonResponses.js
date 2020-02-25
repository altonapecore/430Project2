const sites = {
  'http://tinytuba.com/':'weird',
  'http://burymewithmymoney.com/':'weird',
  'http://eelslap.com/':'weird',
  'http://beesbeesbees.com/':'funny',
  'http://www.staggeringbeauty.com/':'weird',
  'https://chrismckenzie.com/':'computers',
  'http://hasthelargehadroncolliderdestroyedtheworldyet.com/':'science',
  'http://corndog.io/':'weird',
  'http://ihasabucket.com/':'funny',
  'http://www.republiquedesmangues.fr/':'weird',
  'http://www.rrrgggbbb.com/':'computers',
  'http://imaninja.com/':'computers',
  'http://www.movenowthinklater.com/':'computers',
  'http://www.ismycomputeron.com/':'funny',
  'https://happyhappyhardcore.com/':'weird',
  'http://www.everydayim.com/':'funny',
  'http://ninjaflex.com/':'weird',
};

const tags = [
  'funny',
  'weird',
  'science',
  'computers',
];

const getSite = () => {
  let keys = Object.keys(sites);
  let site = keys[Math.floor(Math.random() * keys.length)];
  return site;
};

const findByTag = (tagName) => {
  const foundSites = [];
  const keys = Object.keys(sites);
  for(let i = 0; i < sites.length; i++){
    if(sites[i].value == tagName){
      foundSites.push(keys[i]);
    }
  }

  return foundSites;
}

const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json'});
  response.write(JSON.stringify(object));
  response.end();
};


const getAllSites = (request, response) => {
  const object = {
    message: sites,
    id: 'allSites'
  };
  
  respondJSON(request, response, 200, object);
};

const getRandomSite = (request, response) => {
  // Create the response where the message is the site
  const object = {
    message: getSite(),
    id: 'randomSite'
  };

  respondJSON(request, response, 200, object);
};

const getTagPage = (request, response, params) => {
  // Check to see if the username they are trying to use exists

  // If not send back a response saying that the username isn't correct

  // If it is then take them to their custom page, where they can add a site and hopefully see their favorite sites
  const obj = findByTag(params.tag);
  console.log(obj);

  const object = {
    "id": "GetTagSites",
    "message": "Sites have been grabbed!",
    "sites": obj
  }

  respondJSON(request, response, 200, object);
};

const submitSite = (request, response, params) => {
  // Check to see if they are signed in

  // If they're not send back an unauthorized response

  // If they are then we need to check and see if the siteName is valid

  // If it isn't then send back a response saying that the site isn't valid

  // If it is then add it to the list and send back a 200 response

  const siteName = params.siteName;
  const tagName = "default tag";
  console.log(params);

  sites[siteName] = tagName;

  const object = {
    "id": "siteAdded",
    "message": "Site added!",
    "url": siteName,
    "tag": tagName
  }

  respondJSON(request, response, 200, object);
};

const submitTag = (request, response, params) => {

};

const notFound = (request, response) => {
  const object = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };
  
   // return our json with a 404 not found error code
  respondJSON(request, response, 404, object);
};

module.exports = {
  getAllSites,
  getRandomSite,
  getTagPage,
  submitSite,
  submitTag,
  notFound
};
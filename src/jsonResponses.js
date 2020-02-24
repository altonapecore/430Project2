const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json'});
  response.write(JSON.stringify(object));
  response.end();
};

// Helper function for the get random site to reduce the code there
const randomRange = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

const getAllSites = (request, response, sites) => {
  // Create an object literal version of all the sites
  const jsonArray = Object.assign({}, sites);
  
  const responseJSON = {
    message: jsonArray,
    id: 'allSites'
  };
  
  respondJSON(request, response, 200, responseJSON);
};

const getRandomSite = (request, response, sites) => {
  let index = randomRange(0, sites.length);

  // Create the response where the message is the site
  const responseJSON = {
    message: sites[index],
    id: 'randomSite'
  };

  respondJSON(request, response, 200, responseJSON);
};

const getUserPage = (request, response, sites, users) => {
  // Check to see if the username they are trying to use exists

  // If not send back a response saying that the username isn't correct

  // If it is then take them to their custom page, where they can add a site and hopefully see their favorite sites
};

const submitSite = (request, response, sites, users, params, siteName) => {
  // Check to see if they are signed in

  // If they're not send back an unauthorized response

  // If they are then we need to check and see if the siteName is valid

  // If it isn't then send back a response saying that the site isn't valid

  // If it is then add it to the list and send back a 200 response
};

const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };
  
   // return our json with a 404 not found error code
  respondJSON(request, response, 404, responseJSON);
};

module.exports = {
  getAllSites,
  getRandomSite,
  getUserPage,
  submitSite,
  notFound
};
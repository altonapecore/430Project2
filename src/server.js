const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/': htmlHandler.getIndex,
  '/style.css': htmlHandler.getCSS,
  '/getAllSites': jsonHandler.getAllSites,
  '/getRandomSite': jsonHandler.getRandomSite,
  '/getTagPage': jsonHandler.getUserPage,
  '/submitSite': jsonHandler.submitSite,
  '/submitTag': jsonHandler.submitTag,
  notFound: jsonHandler.notFound
};



const onRequest = (request, response) => {
  // parse the url using the url module
  // This will let us grab any section of the URL by name
  const parsedUrl = url.parse(request.url);

  // grab the query parameters (?key=value&key2=value2&etc=etc)
  // and parse them into a reusable object by field name
  // NOT USING yet - but we can test with ?name=Kirby
  const params = query.parse(parsedUrl.query);

  console.log(parsedUrl.pathname);
  console.log(params);

  // grab the 'accept' headers (comma delimited) and split them into an array
  const acceptedTypes = request.headers.accept.split(',');

  // check if the path name (the /name part of the url) matches
  // any in our url object. If so call that function. If not, default to index.
  if (urlStruct[parsedUrl.pathname]) {
    urlStruct[parsedUrl.pathname](request, response, params);
  } else {
    urlStruct.notFound(request, response, params);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
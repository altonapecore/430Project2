const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/': htmlHandler.getIndex,
  '/client.html': htmlHandler.getIndex,
  '/style.css': htmlHandler.getCSS,
  '/getAllSites': jsonHandler.getAllSites,
  '/getRandomSite': jsonHandler.getRandomSite,
  '/getTagPage': jsonHandler.getTagPage,
  '/submitSite': jsonHandler.submitSite,
  '/submitTag': jsonHandler.submitTag,
  '/getAllTags': jsonHandler.getAllTags,
  notFound: htmlHandler.notFound,
};

const handlePost = (request, response, parsedUrl) => {
  const res = response;

  const body = [];

  // If there's an error handle it
  request.on('error', (err) => {
    console.dir(err);
    res.statusCode = 400;
    res.end();
  });

  request.on('data', (chunk) => {
    body.push(chunk);
  });

  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();

    const bodyParams = query.parse(bodyString);

    if (parsedUrl.pathname === '/submitTag') {
      jsonHandler.submitTag(request, response, bodyParams);
    } else {
      jsonHandler.submitSite(request, response, bodyParams);
    }
  });
};

const onRequest = (request, response) => {
  // parse the url using the url module
  // This will let us grab any section of the URL by name
  const parsedUrl = url.parse(request.url);

  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  } else {
    // grab the query parameters (?key=value&key2=value2&etc=etc)
    // and parse them into a reusable object by field name
    // NOT USING yet - but we can test with ?name=Kirby
    const params = query.parse(parsedUrl.query);

    // check if the path name (the /name part of the url) matches
    // any in our url object. If so call that function. If not, default to index.
    if (urlStruct[parsedUrl.pathname]) {
      urlStruct[parsedUrl.pathname](request, response, params);
    } else {
      urlStruct.notFound(request, response, params);
    }
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);

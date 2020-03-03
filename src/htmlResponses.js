const fs = require('fs'); // pull in the file system module

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const notFoundPage = fs.readFileSync(`${__dirname}/../client/notFound.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

// Index Page
const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

// Get the raw css
const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};

// Page for if the user gets lost
const notFound = (request, response) => {
  response.writeHead(404, {'Content-Type': 'text/html'});
  response.write(notFoundPage);
  response.end();
};

module.exports = {
  getIndex,
  getCSS,
  notFound,
};

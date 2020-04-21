const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  console.log(mid.requiresLogout);
  console.log(mid.requiresLogin);
  console.log(mid.requiresLogout);
  
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getSite', mid.requiresSecure, controllers.Site.getSite);
  app.get('/getAllSites', mid.requiresSecure, controllers.Site.getSite);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/maker', mid.requiresLogin, controllers.Site.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Site.make);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;

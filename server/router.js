const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  //app.get('/getSites', mid.requiresLogin, controllers.Site.GetSite);
  //app.get('/getAllSites', mid.requiresSecure, controllers.Site.GetAllSites);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.LoginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  //app.get('/maker', mid.requiresLogin, controllers.Site.makerPage);
  //app.post('/maker', mid.requiresLogin, controllers.Site.make);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.LoginPage);
};

module.exports = router;

const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getSite', mid.requiresSecure, controllers.Site.getSite);
  app.get('/getUserSites', mid.requiresLogin, controllers.Site.getUserSites);
  app.get('/getAllSites', mid.requiresSecure, controllers.Site.getAllSites);
  app.post('/getByTag', mid.requiresSecure, controllers.Site.getByTag);
  app.get('/getTagForm', mid.requiresSecure, controllers.Site.getTagForm)
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/changePass', mid.requiresLogin, controllers.Account.changePassPage);
  app.post('/changePass', mid.requiresLogin, controllers.Account.changePass);
  app.get('/maker', mid.requiresLogin, controllers.Site.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Site.makeSite);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;

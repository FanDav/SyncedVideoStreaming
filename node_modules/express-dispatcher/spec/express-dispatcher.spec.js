var dispatcher = require('../lib/express-dispatcher.js').dispatcher;

var dummyApp = function() {
    this.routes = [];
};

dummyApp.prototype.get = function(verb, callback) {
    var route = {};
    route[verb] = callback;
    this.routes.push(route);
};

dummyApp.prototype.post = function(verb, callback) {
    var route = {};
    route[verb] = callback;
    this.routes.push(route);
};

var app = new dummyApp();

var path = __dirname + '/../test/controllers/';

describe("Routes test", function() {
    it("Zero routes", function() {
        dispatcher.init({app: app, path: path});
        expect(dispatcher.routes.length).toBe(0);
    });

    it("One route", function() {
        dispatcher.init({app: app, path: path, routeFile : path + 'routes'});
        expect(dispatcher.routes.length).toBe(3);
    });
    it("One route added ?", function() {
        expect(app.routes.length).toBe(3);
    });
});

describe("Controller tests", function() {
    it("Have action (callback)", function() {
        expect(app.routes[0].index instanceof Function).toBe(true);
    });
});
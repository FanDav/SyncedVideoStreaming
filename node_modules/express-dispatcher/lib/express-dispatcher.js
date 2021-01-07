var fs = require('fs'),
    path = require('path');

var dispatcher = function() {
    this.app = null; // TODO : Set it as a middleware
    this.path = null;
    this.routes = [];
};

dispatcher.prototype.init = function(options) {
    this.app = options.app;
    this.path = options.path;
    this.parseRoute(options.routeFile);
};

dispatcher.prototype.parseRoute = function(routeFile) {
    if(typeof(routeFile) !== "undefined") {
        var route = require(routeFile).routes;

        if(typeof(route) != "object") {
            return;
        }

        this.addRoute(this.app, route.app);

        if(typeof(route.routes) !== "undefined") {
            var routeName;
            for(routeName in route.routes) {
                this.parseRoute(this.path + route.routes[routeName]);
            }
        }
        return;
    }
};

dispatcher.prototype.addRoute = function(app, routes) {
    for(var route in routes) {
        var fileController = this.path + routes[route].controller;
        var controller = require(fileController)._controller;

        var view = null;
        if(typeof(routes[route].view) !== "undefined") {
            view = routes[route].view;
        }

        app.get(route, controller[routes[route].action]);
        this.routes.push(route);
    }
};

exports.dispatcher = new dispatcher();

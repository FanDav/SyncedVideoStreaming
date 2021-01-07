express-dispatcher [![Build Status](https://api.travis-ci.org/aliel/express-dispatcher.png)](https://travis-ci.org/aliel/express-dispatcher)
====================

Dispatcher for expressjs : Under development !

## Installation

```js
$ npm install -g express-dispatcher
```

## Usage exemple
```js
// controllers/routes.js
exports.routes = {
    app: {
        'index' : {
            path: '/',
            controller: 'index',
            action: 'index',
            view: 'index',
            method: 'GET',
            isSecure: false
        },
        'about' : {
            path: '/about',
            controller: 'about',
            action: 'index',
            method: 'POST',
            isSecure: false
        }
    },
    routes: {
        'blog' : 'blog/routes',
        'user' : 'user/routes'
    }
};

// for "/" VERB, load "controller/index" from "./controllers/main/index"
// and execute "index" action

// code of "controllers/index.js"
var main = exports._controller = {
    index : function(req, res, next) {
        console.log('view is => ' + main.getView(req));
        res.render(main.getView(req), { title: 'My title' });
    }
    //...
};
```


## Let's starting with a simple configuration of nodejs

```js
var express = require('express')
  , http = require('http')
  , path = require('path')
  , dispatcher = require('express-dispatcher').dispatcher;
  
var app = express();

app.configure(function(){
  app.engine('.hjs', require('hogan-express'));
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'hjs');
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('a45Er#f5J'));
  app.use(express.session());
  app.use(app.router);

  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// This dispatcher
dispatcher.init({app: app, path: __dirname + '/controllers/'});

var server = http.createServer(app);

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
```

## Our MVC architecture

```sh
app.js
controllers
controllers/routes.js
controllers/main/index.js
models
views
views/index.js
public
```

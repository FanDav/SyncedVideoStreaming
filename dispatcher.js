"use strict"
// Dispatcher per la gestionedinamica di qualsiasi risorsa
var url = require('url');
var fs = require('fs');
var mime = require("mime");
var queryString = require("querystring");
var crypto = require("crypto");
var stringaErrore;
var path = require("path");
const { log } = require('console');

var dispatcher = function () {
    this.prompt = ">_  ";
    this.listeners = {
        get: {},
        post: {},
        delete: {},
        put: {},
        patch: {}
    };
    init();
}

// .prototype mi serve per aggiungere dei metodi al mio oggetto creato tramite un costruttore
// the prototype property can be used to add methods to existing constructors
dispatcher.prototype.addListener = function (metodo, risorsa, callback) {
    metodo = metodo.toLowerCase();
    this.listeners[metodo][risorsa] = callback;
}

dispatcher.prototype.showList = function () {
    var s = "";
    //console.log("Elenco dei Listener registrati:")
    for (var key in this.listeners) {
        //console.log(key);
        s += key + "<br>"
        var listeners = this.listeners[key];
        for (var key in listeners) {
            //console.log(key);
            s += key + "<br>";
        }
    }
    return s;
}

//  *********************** PARTE 1  Dispatch ***************************	
dispatcher.prototype.innerDispatch = function (req, res) {
    var metodo = req.method.toLowerCase();
    // Lettura dei parametri GET 
    // (intercettati SEMPRE, qualunque sia il method della richiesta)	
    var _url = url.parse(req.url, false);
    var risorsa = _url.pathname;
    var params = _url.query || "";
    // L'ultima OR serve per intercettare i parametri get nel caso di richieste lanciate direttamente dalla barra di navigazione

    // lettura parametri get
    params = decodeURIComponent(params);    // Sostituisce ogni sequenza di escape nella parte di URI codificata con il carattere che la rappresenta.
    // https://developer.mozilla.org/it/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent
    try {
        // parametri get in formato JSON
        req["get"] = JSON.parse(params);
    } catch (error) {
        // parametri get in formato url-encoded
        req["get"] = queryString.parse(params);
    }

    // log   
    //console.log(this.prompt + metodo + ": " + risorsa);
    //if (metodo != "get")
        //console.log("parametri " + metodo + ": " + JSON.stringify(req[metodo]));
    //console.log("parametri get: " + JSON.stringify(req["get"]));

    // dispatch
    if (risorsa in this.listeners[metodo]) {
        var callback = this.listeners[metodo][risorsa];
        callback(req, res);
    } else
        this.staticListener(req, res);
}

//  ******* PARTE 2 : Static e Error Listener  ************
dispatcher.prototype.staticListener = function (req, res) {
    var risorsa = url.parse(req.url).pathname;
    if (risorsa.endsWith('/'))
        risorsa += "index.html";
    else if(path.extname(risorsa)=="")
        risorsa += "/index.html";

    var filename = path.resolve("." + risorsa);

    //console.log(filename)

    var _this = this;
    // filename = percorso relativo o assoluto tramite __dirname
    fs.readFile(filename, function (err, content) {
        if (err)
            _this.errorListener(req, res);
        else {
            if (content.toString().match(/<\?php(.+?)\?>/is)) {
                var header = { "Content-Type": "text/txt" }
                res.writeHead(200, header);
                //content = content.toString().replace(new RegExp(/<\?php(.+?)\?>/is, "gm"), "");
                
                res.write("PHP not supported")
                //res.write(content.toString())
                res.end()
            } else {
                var header = { "Content-Type": mime.getType(filename) }
                res.writeHead(200, header);
                res.end(content);
            }
        }
    });
}

dispatcher.prototype.errorListener = function (req, res) {
    var risorsa = url.parse(req.url)["pathname"];
    if (risorsa.substr(0, 4) == "/api") {  // errore dovuto ad un addListener mancante
        var header = { "Content-Type": 'text/html;charset=utf-8' };
        res.writeHead(404, header);
        res.end("<h1>Risorsa non trovata! Errore dovuto ad un addListener mancante!</h1>");
    } else {    // errore dovuto ad una risorsa statica mancante
        var header = { "Content-Type": 'text/html;charset=utf-8' };
        res.writeHead(404, header);
        res.end(stringaErrore);
    }
}

// Serve per inizializzare la gestione dell'errore
function init(req, res) {
    fs.readFile("./static/error.html", function (err, content) {
        if (err)
            content = "<h1>Risorsa statica non trovata</h1>"
        stringaErrore = content.toString();
    });
}

//  ******* PARTE 3 : Lettura dei parametri POST **********
dispatcher.prototype.parsePostParameters = function (req, res) {
    var body = "";

    req.on("data", function (data) {
        body += data;
    });

    let _this = this;
    req.on("end", function () {
        let params;
        try {
            // parametri post formato JSON    
            params = JSON.parse(body)
        }
        catch (error) {
            // parametri post formato url-encoded
            params = queryString.parse(body);
        }
        finally {
            var metodo = req.method.toLowerCase();
            req[metodo] = params;
            _this.innerDispatch(req, res);
        }
    });
}

dispatcher.prototype.dispatch = function (req, res) {
    if (req.method.toUpperCase() == "GET")
        this.innerDispatch(req, res);
    else
        this.parsePostParameters(req, res);
}

// export in forma anonima
module.exports = new dispatcher();
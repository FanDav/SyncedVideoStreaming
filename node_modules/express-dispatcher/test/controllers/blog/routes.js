exports.routes = {
    app: {
        'index' : {
            path: '/blog',
            controller: 'blog/index',
            action: 'index',
            view: 'index',
            method: 'GET',
            isSecure: false
        }
    }
};
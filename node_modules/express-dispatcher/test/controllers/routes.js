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
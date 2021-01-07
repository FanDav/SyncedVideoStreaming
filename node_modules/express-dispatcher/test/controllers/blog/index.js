/*
 * GET Blog page.
 */

var main = exports._controller = {
    index : function(req, res, next) {
        res.render('index', { title: 'Blog' });
    }

}

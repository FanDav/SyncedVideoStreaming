/*
 * GET about page.
 */

var main = exports._controller = {
    index : function(req, res, next) {
        res.render('about', { title: 'About page' });
    }

}

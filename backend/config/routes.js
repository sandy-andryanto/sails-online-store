/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
    'GET /api/ping': 'HomeController.ping',
    'GET /api/home/component': 'HomeController.component',
    'GET /api/home/page': 'HomeController.page',
    'POST /api/newsletter/send': 'HomeController.send',
    'POST /api/auth/login': 'AuthController.login',
    'POST /api/auth/register': 'AuthController.register',
    'GET /api/auth/confirm/:token': 'AuthController.confirm',
    'POST /api/auth/email/forgot': 'AuthController.forgot',
    'POST /api/auth/email/reset/:token': 'AuthController.reset',
    'GET /api/profile/detail': 'ProfileController.detail',
    'POST /api/profile/update': 'ProfileController.update',
    'POST /api/profile/password': 'ProfileController.password',
    'POST /api/profile/upload': 'ProfileController.upload',
    'GET /api/profile/activity': 'ProfileController.activity',
    'GET /api/shop/list': 'ShopController.list',
    'GET /api/shop/filter': 'ShopController.filter',
    'GET /api/order/list': 'OrderController.list',
    'GET /api/order/billing': 'OrderController.billing',
    'GET /api/order/product': 'OrderController.product',
    'GET /api/order/review/:id': 'OrderController.listReview',
    'GET /api/order/cart/:id': 'OrderController.cart',
    'POST /api/order/cart/:id': 'OrderController.add',
    'GET /api/order/wishlist/:id': 'OrderController.wishlist',
    'GET /api/order/detail/:id': 'OrderController.detail',
    'GET /api/order/view/:id': 'OrderController.view',
    'GET /api/order/cancel/:id': 'OrderController.cancel',
    'POST /api/order/review/:id': 'OrderController.review',
    'POST /api/order/checkout/:id': 'OrderController.checkout',
};

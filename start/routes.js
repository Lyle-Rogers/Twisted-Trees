'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', 'ForSaleController.render')

Route.on('/make_sell_listing').render('associates.makeSellListing')
Route.post('/make_sell_listing', 'ForSaleController.makeSellListing')

Route.get('/edit_sell_listing/:id', 'ForSaleController.editSellListing')
Route.post('/post_sell_listing/:id', 'ForSaleController.updateSellListing')
Route.post('create_sell_listing_photo/:id', 'ForSaleController.createSellListingPhoto')
Route.get('delete_sell_listing_photo/:id/:photo', 'ForSaleController.deleteThePhoto')

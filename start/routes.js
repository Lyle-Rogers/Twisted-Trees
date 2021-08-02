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
Route.get('/delete_sell_listing_click/:id', 'ForSaleController.deleteSellListingClick')
Route.get('/delete_sell_listing/:id', 'ForSaleController.deleteSellListing')
Route.get('/see_sell_listing_photos/:id', 'ForSaleController.seeThePhoto')
Route.post('create_sell_listing_photo/:id', 'ForSaleController.createSellListingPhoto')
Route.get('/delete_sell_listing_photo_click/:id/:photo', 'ForSaleController.photoDeleteClick')
Route.get('/delete_sell_listing_photo/:id', 'ForSaleController.deleteThePhoto')

Route.get('/about_the_artist', 'ForSaleController.aboutTheArtist')

Route.get('/best_work', 'BestWorkController.render')
Route.on('/make_best_work_listing').render('associates.makeBestWorkListing')
Route.post('/make_best_work_listing', 'BestWorkController.makeBestWorkListing')
Route.get('/edit_best_work_listing/:id', 'BestWorkController.editBestWorkListing')
Route.post('/post_best_work_listing/:id', 'BestWorkController.updateBestWorkListing')
Route.get('/delete_best_work_listing_click/:id', 'BestWorkController.deleteBestWorkListingClick')
Route.get('/delete_best_work_listing/:id', 'BestWorkController.deleteBestWorkListing')
Route.get('/see_best_work_listing_photos/:id', 'BestWorkController.seeThePhoto')
Route.post('create_best_work_listing_photo/:id', 'BestWorkController.createBestWorkListingPhoto')
Route.get('/delete_best_work_listing_photo_click/:id/:photo', 'BestWorkController.photoDeleteClick')
Route.get('/delete_best_work_listing_photo/:id', 'BestWorkController.deleteThePhoto')
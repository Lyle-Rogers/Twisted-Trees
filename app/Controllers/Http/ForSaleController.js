'use strict'

const Helpers = use('Helpers')
// const fs = require('fs');
const SellListing = use('App/Models/SellListing')
const Image = use('App/Models/Image')

class ForSaleController {
  async render({ view, auth }) {
    // const admin = auth.user ? true : false;
    const admin = true;

    const sellListings = await SellListing
      .query()
      .orderBy('id', 'desc')
      .fetch()

    return view.render('directory/for_sale', { admin, sellListings: sellListings.toJSON() })
  }

  async makeSellListing({ request, response }) {
    const sellListingInfo = request.all(); 
    const photo = request.file('photo', {
      type: ['image'],
      size: '13mb'
    })

    if (photo) {
      const name = `${new Date().getTime()}.${photo.subtype}`;

      await photo.move(Helpers.publicPath('uploads'), {
        name: name,
        overwrite: true
      })

      if (!photo.moved()) {
        return response.redirect('/the_china')
      }

      const makeSellListing = await SellListing.create({
        photo: name,
        title: sellListingInfo.title,
        price: sellListingInfo.price,
        description: sellListingInfo.description,
      })

      await makeSellListing.photos().create({
        image: name,
      })
    } else {
      await SellListing.create({
        title: sellListingInfo.title,
        price: sellListingInfo.price,
        description: sellListingInfo.description,
      })
    }

    // const sellListing = await SellListing.find(makeSellListing.id)
    
    // const createPhoto = await sellListing.photos().create({
    //   image: name,
    // })

    // const removeFile = Helpers.promisify(fs.unlink)
    
    // if (!photos.movedAll()) {
    //   const movedFiles = photos.movedList()

    //   await Promise.all(movedFiles.map((file) => {
    //     return removeFile(path.join(file._location, file.fileName))
    //   }))

    //   return response.redirect('/china_the')
    // }

    return response.redirect('/')
  }

  async editSellListing({ view, params }) {
    const sellListing = await SellListing.find(params.id)
    const photos = await Image
      .query()
      .where('sell_listing_id', params.id)
      .orderBy('id', 'asc')
      .fetch()

    return view.render('associates.editSellListing', { sellListing, photos: photos.toJSON() })
  }
}

module.exports = ForSaleController

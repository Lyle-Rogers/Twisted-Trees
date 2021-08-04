'use strict'

const Helpers = use('Helpers')
const SellListing = use('App/Models/SellListing')
const Hash = use('Hash')
const Image = use('App/Models/Image')
const User = use('App/Models/User')

class ForSaleController {
  async render({ view, auth }) {
    const admin = auth.user ? true : false;

    const sellListings = await SellListing
      .query()
      .orderBy('id', 'desc')
      .fetch()

    return view.render('directory/for_sale', { admin, sellListings: sellListings.toJSON() })
  }

  async signIn({ response, auth, request, session }) {
    const { username, password } = request.all();
    
    const user = await User.query()
      .where('username', username)
      .first()

    if (user) {
      const verification = await Hash.verify(password, user.password)

      if (verification) {
        await auth.remember(true).login(user)

        return response.route('/')
      } else {
        session.flash({ message: "Your password was incorrect. Please try again." })

        return response.redirect('back')
      }
    }
    session.flash({ message: "Couldn't find the username. Please see if it's correct." })

    return response.redirect('back')
  }

  async aboutTheArtist({ view }) {
    return view.render('directory/aboutTheArtist')
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

    return response.redirect('/')
  }

  async seeThePhoto({ params, view }) {
    const thePhotos = await Image
      .query()
      .where('sell_listing_id', params.id)
      .orderBy('sell_listing_id', 'desc')
      .fetch()

    return view.render('associates.seeThePhoto', { thePhotos: thePhotos.toJSON() })
  }

  async deleteSellListingClick({ params, auth, view }) {
    const sellListingBeingDeleted = params.id;
    const admin = auth.user ? true : false;

    const sellListings = await SellListing
      .query()
      .orderBy('id', 'desc')
      .fetch()

    return view.render('directory/for_sale', { admin, sellListingBeingDeleted, sellListings: sellListings.toJSON() })
  }

  async deleteSellListing({ response, params }) {
    const sellListing = await SellListing.find(params.id);
    
    await Image
      .query()
      .where('sell_listing_id', params.id)
      .delete()

    sellListing.delete()

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

  async updateSellListing({ response, params, request }) {
    const sellListing = await SellListing.find(params.id);
    const sellListingData = request.all();

    sellListing.title = sellListingData.title;
    sellListing.price = sellListingData.price;
    sellListing.description = sellListingData.description;
    
    await sellListing.save();

    return response.redirect('/')
  }

  async createSellListingPhoto({ response, params, request }) {
    const sellListing = await SellListing.find(params.id);

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
        return response.redirect('/photo_not_uploaded')
      }

      await sellListing.photos().create({
        image: name,
      })

      sellListing.new_photo = name;

      await sellListing.save()
    }

    return response.redirect(`/edit_sell_listing/${params.id}`)
  }

  async photoDeleteClick({ view, params }) {
    const sellListing = await SellListing.find(params.id)
    const photoBeingDeleted = params.photo;
    const photos = await Image
      .query()
      .where('sell_listing_id', params.id)
      .orderBy('id', 'asc')
      .fetch()

    return view.render('associates.editSellListing', { photoBeingDeleted, sellListing, photos: photos.toJSON() })
  }

  async deleteThePhoto({ response, params }) {
    const thePhoto = await Image.find(params.id);
    const sellListing = await SellListing.find(thePhoto.sell_listing_id);
    const fs = Helpers.promisify(require('fs'))
    const photoDir = thePhoto.image;

    if (sellListing.photo == photoDir) {
      sellListing.photo = sellListing.new_photo;
      await sellListing.save()
    }

    await thePhoto.delete()

    await fs.unlink(Helpers.publicPath(`/uploads/${photoDir}`))

    return response.redirect('back')
  }
}

module.exports = ForSaleController

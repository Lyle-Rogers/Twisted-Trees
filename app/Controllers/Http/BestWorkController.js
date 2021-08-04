'use strict'

const Helpers = use('Helpers')
const BestWork = use('App/Models/BestWork')
const Image = use('App/Models/Image')

class BestWorkController {
  async render({ view, auth }) {
    const admin = auth.user ? true : false;

    const bestWorkListings = await BestWork
      .query()
      .orderBy('id', 'desc')
      .fetch()

    return view.render('directory.bestWorks', { admin, bestWorkListings: bestWorkListings.toJSON() })
  }

  async makeBestWorkListing({ request, response }) {
    const bestWorkListingInfo = request.all(); 
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

      const makeBestWorkListing = await BestWork.create({
        photo: name,
        title: bestWorkListingInfo.title,
        price: bestWorkListingInfo.price,
        description: bestWorkListingInfo.description,
      })

      await makeBestWorkListing.photos().create({
        image: name,
      })
    } else {
      await BestWork.create({
        title: bestWorkListingInfo.title,
        price: bestWorkListingInfo.price,
        description: bestWorkListingInfo.description,
      })
    }

    return response.redirect('/best_work')
  }

  async seeThePhoto({ params, view }) {
    const thePhotos = await Image
      .query()
      .where('best_work_id', params.id)
      .orderBy('best_work_id', 'desc')
      .fetch()

    return view.render('associates.seeThePhoto', { thePhotos: thePhotos.toJSON() })
  }

  async deleteBestWorkListingClick({ params, auth, view }) {
    const bestWorkListingBeingDeleted = params.id;
    const admin = auth.user ? true : false;

    const bestWorkListings = await BestWork
      .query()
      .orderBy('id', 'desc')
      .fetch()

    return view.render('directory/bestWorks', { admin, bestWorkListingBeingDeleted, bestWorkListings: bestWorkListings.toJSON() })
  }

  async deleteBestWorkListing({ response, params }) {
    const bestWorkListing = await BestWork.find(params.id);
    
    await Image
      .query()
      .where('best_work_id', params.id)
      .delete()

    bestWorkListing.delete()

    return response.redirect('/best_work')
  }

  async editBestWorkListing({ view, params }) {
    const bestWorkListing = await BestWork.find(params.id)
    const photos = await Image
      .query()
      .where('best_work_id', params.id)
      .orderBy('id', 'asc')
      .fetch()

    return view.render('associates.editBestWorkListing', { bestWorkListing, photos: photos.toJSON() })
  }

  async updateBestWorkListing({ response, params, request }) {
    const bestWorkListing = await BestWork.find(params.id);
    const bestWorkListingData = request.all();

    bestWorkListing.title = bestWorkListingData.title;
    bestWorkListing.price = bestWorkListingData.price;
    bestWorkListing.description = bestWorkListingData.description;
    
    await bestWorkListing.save();

    return response.redirect('/best_work')
  }

  async createBestWorkListingPhoto({ response, params, request }) {
    const bestWorkListing = await BestWork.find(params.id);

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

      await bestWorkListing.photos().create({
        image: name,
      })

      bestWorkListing.new_photo = name;

      await bestWorkListing.save()
    }

    return response.redirect(`/edit_best_work_listing/${params.id}`)
  }

  async photoDeleteClick({ view, params }) {
    const bestWorkListing = await BestWork.find(params.id)
    const photoBeingDeleted = params.photo;
    const photos = await Image
      .query()
      .where('best_work_id', params.id)
      .orderBy('id', 'asc')
      .fetch()

    return view.render('associates.editBestWorkListing', { photoBeingDeleted, bestWorkListing, photos: photos.toJSON() })
  }

  async deleteThePhoto({ response, params }) {
    const thePhoto = await Image.find(params.id);
    const bestWorkListing = await BestWork.find(thePhoto.best_work_id);
    const fs = Helpers.promisify(require('fs'))
    const photoDir = thePhoto.image;

    if (bestWorkListing.photo == photoDir) {
      bestWorkListing.photo = bestWorkListing.new_photo;
      await bestWorkListing.save()
    }

    await thePhoto.delete()

    await fs.unlink(Helpers.publicPath(`/uploads/${photoDir}`))

    return response.redirect('back')
  }
}

module.exports = BestWorkController


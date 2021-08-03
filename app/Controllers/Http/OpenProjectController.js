'use strict'

const Helpers = use('Helpers')
const OpenProject = use('App/Models/OpenProject')
const Image = use('App/Models/Image')

class OpenProjectController {
  async render({ view, auth }) {
    // const admin = auth.user ? true : false;
    const admin = true;

    const openProjectListings = await OpenProject
      .query()
      .orderBy('id', 'desc')
      .fetch()

    return view.render('directory.openProjects', { admin, openProjectListings: openProjectListings.toJSON() })
  }

  async makeOpenProjectListing({ request, response }) {
    const openProjectListingInfo = request.all(); 
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

      const makeOpenProjectListing = await OpenProject.create({
        photo: name,
        title: openProjectListingInfo.title,
        price: openProjectListingInfo.price,
        description: openProjectListingInfo.description,
      })

      await makeOpenProjectListing.photos().create({
        image: name,
      })
    } else {
      await OpenProject.create({
        title: openProjectListingInfo.title,
        price: openProjectListingInfo.price,
        description: openProjectListingInfo.description,
      })
    }

    return response.redirect('/open_project')
  }

  async seeThePhoto({ params, view }) {
    const thePhotos = await Image
      .query()
      .where('open_project_id', params.id)
      .orderBy('open_project_id', 'desc')
      .fetch()

    return view.render('associates.seeThePhoto', { thePhotos: thePhotos.toJSON() })
  }

  async deleteOpenProjectListingClick({ params, auth, view }) {
    const openProjectListingBeingDeleted = params.id;
     // const admin = auth.user ? true : false;
    const admin = true;

    const openProjectListings = await OpenProject
      .query()
      .orderBy('id', 'desc')
      .fetch()

    return view.render('directory/openProjects', { admin, openProjectListingBeingDeleted, openProjectListings: openProjectListings.toJSON() })
  }

  async deleteOpenProjectListing({ response, params }) {
    const openProjectListing = await OpenProject.find(params.id);
    
    await Image
      .query()
      .where('open_project_id', params.id)
      .delete()

    openProjectListing.delete()

    return response.redirect('/open_project')
  }

  async editOpenProjectListing({ view, params }) {
    const openProjectListing = await OpenProject.find(params.id)
    const photos = await Image
      .query()
      .where('open_project_id', params.id)
      .orderBy('id', 'asc')
      .fetch()

    return view.render('associates.editOpenProjectListing', { openProjectListing, photos: photos.toJSON() })
  }

  async updateOpenProjectListing({ response, params, request }) {
    const openProjectListing = await OpenProject.find(params.id);
    const openProjectListingData = request.all();

    openProjectListing.title = openProjectListingData.title;
    openProjectListing.price = openProjectListingData.price;
    openProjectListing.description = openProjectListingData.description;
    
    await openProjectListing.save();

    return response.redirect('/open_project')
  }

  async createOpenProjectListingPhoto({ response, params, request }) {
    const openProjectListing = await OpenProject.find(params.id);

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

      await openProjectListing.photos().create({
        image: name,
      })

      openProjectListing.new_photo = name;

      await openProjectListing.save()
    }

    return response.redirect(`/edit_open_project_listing/${params.id}`)
  }

  async photoDeleteClick({ view, params }) {
    const openProjectListing = await OpenProject.find(params.id)
    const photoBeingDeleted = params.photo;
    const photos = await Image
      .query()
      .where('open_project_id', params.id)
      .orderBy('id', 'asc')
      .fetch()

    return view.render('associates.editOpenProjectListing', { photoBeingDeleted, openProjectListing, photos: photos.toJSON() })
  }

  async deleteThePhoto({ response, params }) {
    const thePhoto = await Image.find(params.id);
    const openProjectListing = await OpenProject.find(thePhoto.open_project_id);
    const fs = Helpers.promisify(require('fs'))
    const photoDir = thePhoto.image;

    if (openProjectListing.photo == photoDir) {
      openProjectListing.photo = openProjectListing.new_photo;
      await openProjectListing.save()
    }

    await thePhoto.delete()

    await fs.unlink(Helpers.publicPath(`/uploads/${photoDir}`))

    return response.redirect('back')
  }
}

module.exports = OpenProjectController



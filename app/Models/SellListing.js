'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class SellListing extends Model {
  photos () {
    return this.hasMany('App/Models/Image')
  }
}

module.exports = SellListing

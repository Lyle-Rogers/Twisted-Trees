'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class BestWork extends Model {
  photos () {
    return this.hasMany('App/Models/Image')
  }
}

module.exports = BestWork

'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ImagesSchema extends Schema {
  up () {
    this.table('images', (table) => {
      table.string('image', 19000).alter()
    })
  }

  down () {
    this.table('images', (table) => {
      // reverse alternations
    })
  }
}

module.exports = ImagesSchema

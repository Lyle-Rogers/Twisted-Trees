'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SellListingSchema extends Schema {
  up () {
    this.table('sell_listings', (table) => {
      table.string('photo')
    })
  }

  down () {
    this.table('sell_listings', (table) => {
      // reverse alternations
    })
  }
}

module.exports = SellListingSchema

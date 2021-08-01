'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SellListingsSchema extends Schema {
  up () {
    this.table('sell_listings', (table) => {
      table.string('new_photo', 1700)
    })
  }

  down () {
    this.table('sell_listings', (table) => {
      // reverse alternations
    })
  }
}

module.exports = SellListingsSchema

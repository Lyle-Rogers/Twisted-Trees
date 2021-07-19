'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SellListingsSchema extends Schema {
  up () {
    this.table('sell_listings', (table) => {
      table.string('title', 900).alter()
      table.string('description', 6900).alter()
      table.string('photo', 19000).alter()
    })
  }

  down () {
    this.table('sell_listings', (table) => {
      // reverse alternations
    })
  }
}

module.exports = SellListingsSchema

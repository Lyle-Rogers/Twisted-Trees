'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SellListingSchema extends Schema {
  up () {
    this.create('sell_listings', (table) => {
      table.increments()
      table.string('title')
      table.integer('price')
      table.string('description')
      table.timestamps()
    })
  }

  down () {
    this.drop('sell_listings')
  }
}

module.exports = SellListingSchema

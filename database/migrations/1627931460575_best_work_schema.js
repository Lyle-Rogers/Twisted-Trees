'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BestWorkSchema extends Schema {
  up () {
    this.create('best_works', (table) => {
      table.increments()
      table.string('title', 900)
      table.integer('price')
      table.string('description', 9600)
      table.string('photo', 19000)
      table.string('new_photo', 1700)
      table.timestamps()
    })
  }

  down () {
    this.drop('best_works')
  }
}

module.exports = BestWorkSchema

'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ImagesSchema extends Schema {
  up () {
    this.table('images', (table) => {
      table.integer('best_work_id')
      table.integer('open_project_id')
    })
  }

  down () {
    this.table('images', (table) => {
      // reverse alternations
    })
  }
}

module.exports = ImagesSchema

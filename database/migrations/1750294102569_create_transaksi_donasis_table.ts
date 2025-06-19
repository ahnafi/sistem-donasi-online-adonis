import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transaksi_donasis'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.enum('status', ['PENDING', 'SUCCESS', 'FAILED']).defaultTo('PENDING')
      table.integer('donasi_id').unsigned().references('donasis.id').onDelete('CASCADE')
      table.integer('kampanye_id').unsigned().references('kampanyes.id').onDelete('CASCADE')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'donasis'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.bigint('jumlah')
      table.date('tanggal')
      table.integer('donatur_id').unsigned().references('donaturs.id').onDelete('CASCADE')
      table.integer('kategori_id').unsigned().references('kategoris.id').onDelete('CASCADE')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

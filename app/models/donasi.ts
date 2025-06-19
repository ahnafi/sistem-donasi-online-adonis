import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasOne } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'
import Kategori from '#models/kategori'
import Donatur from '#models/donatur'
import TransaksiDonasi from './transaksi_donasi.js'

export default class Donasi extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare jumlah: number

  @column.date()
  declare tanggal: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare donaturId: number

  @belongsTo(() => Donatur)
  declare donaturs: BelongsTo<typeof Donatur>

  @column()
  declare kategoriId: number

  @belongsTo(() => Kategori)
  declare kategoris: BelongsTo<typeof Kategori>

  @hasOne(() => TransaksiDonasi)
  declare transaksiDonasi: HasOne<typeof TransaksiDonasi>
}

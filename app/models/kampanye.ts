import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import Kategori from '#models/kategori'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import TransaksiDonasi from './transaksi_donasi.js'

export default class Kampanye extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare namaKampanye: string

  @column()
  declare target: number

  @column()
  declare kategoriId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Kategori)
  declare kategori: BelongsTo<typeof Kategori>

  @hasMany(() => TransaksiDonasi)
  declare transaksiDonasis: HasMany<typeof TransaksiDonasi>
}

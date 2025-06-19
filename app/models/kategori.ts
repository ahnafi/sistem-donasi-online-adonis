import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Kampanye from '#models/kampanye'
import Donasi from '#models/donasi'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Kategori extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nama_kategori: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Kampanye)
  declare kampanyes: HasMany<typeof Kampanye>

  @hasMany(() => Donasi)
  declare donasis: HasMany<typeof Donasi>
}

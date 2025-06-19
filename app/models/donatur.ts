import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Donasi from '#models/donasi'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Donatur extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nama: string

  @column()
  declare email: string

  @column()
  declare telepon: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Donasi)
  declare donasis: HasMany<typeof Donasi>
}

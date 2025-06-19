import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Donasi from '#models/donasi'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Kampanye from '#models/kampanye'

export default class TransaksiDonasi extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare donasiId: number

  @column()
  declare kampanyeId: number

  @column()
  declare status: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Donasi)
  declare donasis: BelongsTo<typeof Donasi>

  @belongsTo(() => Kampanye)
  declare kampanyes: BelongsTo<typeof Kampanye>
}

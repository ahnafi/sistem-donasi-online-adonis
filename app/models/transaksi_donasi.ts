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
  declare status: 'PENDING' | 'SUCCESS' | 'FAILED'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Donasi)
  declare donasi: BelongsTo<typeof Donasi>

  @belongsTo(() => Kampanye)
  declare kampanye: BelongsTo<typeof Kampanye>
}

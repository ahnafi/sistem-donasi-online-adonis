import vine from '@vinejs/vine'

/**
 * Validator to validate the payload when creating
 * a new donasi.
 */
export const createDonasiValidator = vine.compile(
  vine.object({
    jumlah: vine.number().positive(),
    tanggal: vine.date(),
    donaturId: vine.number().positive(),
    kampanyeId: vine.number().positive(),
  })
)

/**
 * Validator to validate the payload when updating
 * an existing donasi.
 */
export const updateDonasiValidator = vine.compile(
  vine.object({
    jumlah: vine.number().positive(),
    tanggal: vine.date(),
    donaturId: vine.number().positive(),
    kampanyeId: vine.number().positive(),
  })
)

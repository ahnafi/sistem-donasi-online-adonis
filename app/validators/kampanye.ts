import vine from '@vinejs/vine'

/**
 * Validator to validate the payload when creating
 * a new kampanye.
 */
export const createKampanyeValidator = vine.compile(
  vine.object({
    namaKampanye: vine.string().trim().minLength(1).maxLength(255),
    target: vine.number().positive(),
    kategoriId: vine.number().positive(),
  })
)

/**
 * Validator to validate the payload when updating
 * an existing kampanye.
 */
export const updateKampanyeValidator = vine.compile(
  vine.object({
    namaKampanye: vine.string().trim().minLength(1).maxLength(255),
    target: vine.number().positive(),
    kategoriId: vine.number().positive(),
  })
)

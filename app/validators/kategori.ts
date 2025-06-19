import vine from '@vinejs/vine'

/**
 * Validator to validate the payload when creating
 * a new kategori.
 */
export const createKategoriValidator = vine.compile(
  vine.object({
    nama_kategori: vine.string().trim().minLength(1).maxLength(100),
  })
)

/**
 * Validator to validate the payload when updating
 * an existing kategori.
 */
export const updateKategoriValidator = vine.compile(
  vine.object({
    nama_kategori: vine.string().trim().minLength(1).maxLength(100),
  })
)

import vine from '@vinejs/vine'

/**
 * Validator to validate the payload when creating
 * a new donatur.
 */
export const createDonaturValidator = vine.compile(
  vine.object({
    nama: vine.string().trim().minLength(1).maxLength(255),
    email: vine.string().trim().email().maxLength(255),
    telepon: vine.string().trim().minLength(10).maxLength(15),
  })
)

/**
 * Validator to validate the payload when updating
 * an existing donatur.
 */
export const updateDonaturValidator = vine.compile(
  vine.object({
    nama: vine.string().trim().minLength(1).maxLength(255),
    email: vine.string().trim().email().maxLength(255),
    telepon: vine.string().trim().minLength(10).maxLength(15),
  })
)

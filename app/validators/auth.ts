import vine from '@vinejs/vine'

/**
 * Validator to validate the payload when logging in
 */
export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string().minLength(6),
  })
)

/**
 * Validator to validate the payload when registering
 */
export const registerValidator = vine.compile(
  vine.object({
    fullName: vine.string().minLength(2),
    email: vine.string().email(),
    password: vine.string().minLength(6).confirmed(),
  })
)

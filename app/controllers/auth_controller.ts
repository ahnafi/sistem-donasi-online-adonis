import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { loginValidator, registerValidator } from '#validators/auth'

export default class AuthController {
  async loginShow({ view }: HttpContext) {
    return view.render('pages/auth/login')
  }

  async login({ request, auth, response, session }: HttpContext) {
    try {
      const { email, password } = await request.validateUsing(loginValidator)

      const user = await User.verifyCredentials(email, password)
      await auth.use('web').login(user)

      session.flash('success', 'Login berhasil!')
      return response.redirect().toRoute('dashboard')
    } catch (error) {
      session.flash('error', 'Email atau password salah!')
      return response.redirect().back()
    }
  }

  async registerShow({ view }: HttpContext) {
    return view.render('pages/auth/register')
  }

  async register({ request, auth, response, session }: HttpContext) {
    try {
      const payload = await request.validateUsing(registerValidator)

      const user = await User.create({
        fullName: payload.fullName,
        email: payload.email,
        password: payload.password,
      })

      await auth.use('web').login(user)

      session.flash('success', 'Registrasi berhasil!')
      return response.redirect().toRoute('dashboard')
    } catch (error) {
      session.flash('error', 'Registrasi gagal!')
      return response.redirect().back()
    }
  }

  async logout({ auth, response, session }: HttpContext) {
    await auth.use('web').logout()
    session.flash('success', 'Logout berhasil!')
    return response.redirect().toRoute('login')
  }
}

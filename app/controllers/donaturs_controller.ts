import type { HttpContext } from '@adonisjs/core/http'
import Donatur from '#models/donatur'
import { createDonaturValidator, updateDonaturValidator } from '#validators/donatur'

export default class DonatursController {
  /**
   * Display a list of donatur
   */
  async index({ view }: HttpContext) {
    const donaturs = await Donatur.all()
    return view.render('pages/donatur/index', { donaturs })
  }

  /**
   * Display the form for creating new donatur
   */
  async create({ view }: HttpContext) {
    return view.render('pages/donatur/create')
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response, session }: HttpContext) {
    try {
      const payload = await request.validateUsing(createDonaturValidator)
      await Donatur.create(payload)

      session.flash('success', 'Donatur berhasil ditambahkan!')
      return response.redirect().toRoute('donaturs.index')
    } catch (error) {
      session.flash('error', 'Gagal menambahkan donatur!')
      return response.redirect().back()
    }
  }

  /**
   * Show individual donatur with donation history
   */
  async show({ params, view }: HttpContext) {
    const donatur = await Donatur.query()
      .where('id', params.id)
      .preload('donasis', (query) => {
        query.preload('kategori').orderBy('tanggal', 'desc')
      })
      .firstOrFail()

    // Calculate total donations
    const totalDonasi = donatur.donasis.reduce((total, donasi) => total + donasi.jumlah, 0)

    return view.render('pages/donatur/show', { donatur, totalDonasi })
  }

  /**
   * Edit individual donatur
   */
  async edit({ params, view }: HttpContext) {
    const donatur = await Donatur.findOrFail(params.id)
    return view.render('pages/donatur/edit', { donatur })
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response, session }: HttpContext) {
    try {
      const donatur = await Donatur.findOrFail(params.id)
      const payload = await request.validateUsing(updateDonaturValidator)

      await donatur.merge(payload).save()

      session.flash('success', 'Donatur berhasil diperbarui!')
      return response.redirect().toRoute('donaturs.index')
    } catch (error) {
      session.flash('error', 'Gagal memperbarui donatur!')
      return response.redirect().back()
    }
  }

  /**
   * Delete individual donatur
   */
  async destroy({ params, response, session }: HttpContext) {
    try {
      const donatur = await Donatur.findOrFail(params.id)
      await donatur.delete()

      session.flash('success', 'Donatur berhasil dihapus!')
      return response.redirect().toRoute('donaturs.index')
    } catch (error) {
      session.flash('error', 'Gagal menghapus donatur!')
      return response.redirect().back()
    }
  }
}

import type { HttpContext } from '@adonisjs/core/http'
import Donatur from '#models/donatur'
import { createDonaturValidator, updateDonaturValidator } from '#validators/donatur'

export default class DonatursController {
  async index({ view }: HttpContext) {
    const donaturs = await Donatur.all()
    return view.render('pages/donatur/index', { donaturs })
  }

  async create({ view }: HttpContext) {
    return view.render('pages/donatur/create')
  }

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

  async show({ params, view }: HttpContext) {
    const donatur = await Donatur.query()
      .where('id', params.id)
      .preload('donasis', (query) => {
        query.preload('kategori').orderBy('tanggal', 'desc')
      })
      .firstOrFail()

    const totalDonasi = donatur.donasis.reduce((total, donasi) => total + donasi.jumlah, 0)

    return view.render('pages/donatur/show', { donatur, totalDonasi })
  }

  async edit({ params, view }: HttpContext) {
    const donatur = await Donatur.findOrFail(params.id)
    return view.render('pages/donatur/edit', { donatur })
  }

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

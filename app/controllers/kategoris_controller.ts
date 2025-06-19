import type { HttpContext } from '@adonisjs/core/http'
import Kategori from '#models/kategori'
import { createKategoriValidator, updateKategoriValidator } from '#validators/kategori'

export default class KategorisController {
  async index({ view }: HttpContext) {
    const kategoris = await Kategori.all()
    return view.render('pages/kategori/index', { kategoris })
  }

  async create({ view }: HttpContext) {
    return view.render('pages/kategori/create')
  }

  async store({ request, response, session }: HttpContext) {
    try {
      const payload = await request.validateUsing(createKategoriValidator)
      await Kategori.create(payload)

      session.flash('success', 'Kategori berhasil ditambahkan!')
      return response.redirect().toRoute('kategoris.index')
    } catch (error) {
      session.flash('error', 'Gagal menambahkan kategori!')
      return response.redirect().back()
    }
  }

  async show({ params, view }: HttpContext) {
    const kategori = await Kategori.findOrFail(params.id)
    return view.render('pages/kategori/show', { kategori })
  }

  async edit({ params, view }: HttpContext) {
    const kategori = await Kategori.findOrFail(params.id)
    return view.render('pages/kategori/edit', { kategori })
  }

  async update({ params, request, response, session }: HttpContext) {
    try {
      const kategori = await Kategori.findOrFail(params.id)
      const payload = await request.validateUsing(updateKategoriValidator)

      await kategori.merge(payload).save()

      session.flash('success', 'Kategori berhasil diperbarui!')
      return response.redirect().toRoute('kategoris.index')
    } catch (error) {
      session.flash('error', 'Gagal memperbarui kategori!')
      return response.redirect().back()
    }
  }

  async destroy({ params, response, session }: HttpContext) {
    try {
      const kategori = await Kategori.findOrFail(params.id)
      await kategori.delete()

      session.flash('success', 'Kategori berhasil dihapus!')
      return response.redirect().toRoute('kategoris.index')
    } catch (error) {
      session.flash('error', 'Gagal menghapus kategori!')
      return response.redirect().back()
    }
  }
}

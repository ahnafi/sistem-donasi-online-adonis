import type { HttpContext } from '@adonisjs/core/http'
import Kampanye from '#models/kampanye'
import Kategori from '#models/kategori'
import { createKampanyeValidator, updateKampanyeValidator } from '#validators/kampanye'

export default class KampanyesController {
  async index({ view }: HttpContext) {
    const kampanyes = await Kampanye.query().preload('kategori')
    return view.render('pages/kampanye/index', { kampanyes })
  }

  async create({ view }: HttpContext) {
    const kategoris = await Kategori.all()
    return view.render('pages/kampanye/create', { kategoris })
  }

  async store({ request, response, session }: HttpContext) {
    try {
      const payload = await request.validateUsing(createKampanyeValidator)
      await Kampanye.create(payload)

      session.flash('success', 'Kampanye berhasil ditambahkan!')
      return response.redirect().toRoute('kampanyes.index')
    } catch (error) {
      session.flash('error', 'Gagal menambahkan kampanye!')
      return response.redirect().back()
    }
  }

  async show({ params, view }: HttpContext) {
    const kampanye = await Kampanye.query().where('id', params.id).preload('kategori').firstOrFail()
    return view.render('pages/kampanye/show', { kampanye })
  }

  async edit({ params, view }: HttpContext) {
    const kampanye = await Kampanye.findOrFail(params.id)
    const kategoris = await Kategori.all()
    return view.render('pages/kampanye/edit', { kampanye, kategoris })
  }

  async update({ params, request, response, session }: HttpContext) {
    try {
      const kampanye = await Kampanye.findOrFail(params.id)
      const payload = await request.validateUsing(updateKampanyeValidator)

      await kampanye.merge(payload).save()

      session.flash('success', 'Kampanye berhasil diperbarui!')
      return response.redirect().toRoute('kampanyes.index')
    } catch (error) {
      session.flash('error', 'Gagal memperbarui kampanye!')
      return response.redirect().back()
    }
  }

  async destroy({ params, response, session }: HttpContext) {
    try {
      const kampanye = await Kampanye.findOrFail(params.id)
      await kampanye.delete()

      session.flash('success', 'Kampanye berhasil dihapus!')
      return response.redirect().toRoute('kampanyes.index')
    } catch (error) {
      session.flash('error', 'Gagal menghapus kampanye!')
      return response.redirect().back()
    }
  }
}

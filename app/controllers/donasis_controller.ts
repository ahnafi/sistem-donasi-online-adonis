import type { HttpContext } from '@adonisjs/core/http'
import Donasi from '#models/donasi'
import Donatur from '#models/donatur'
import Kampanye from '#models/kampanye'
import TransaksiDonasi from '#models/transaksi_donasi'
import { createDonasiValidator, updateDonasiValidator } from '#validators/donasi'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export default class DonasisController {
  /**
   * Display a list of donasi with transaction status
   */
  async index({ view }: HttpContext) {
    const donasis = await Donasi.query()
      .preload('donatur')
      .preload('kategori')
      .preload('transaksiDonasi', (query) => {
        query.preload('kampanye')
      })
      .orderBy('created_at', 'desc')

    return view.render('pages/donasi/index', { donasis })
  }

  /**
   * Display the form for creating new donasi
   */
  async create({ view }: HttpContext) {
    const donaturs = await Donatur.all()
    const kampanyes = await Kampanye.query().preload('kategori')
    return view.render('pages/donasi/create', { donaturs, kampanyes })
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response, session }: HttpContext) {
    const trx = await db.transaction()

    try {
      const payload = await request.validateUsing(createDonasiValidator)

      // Get kampanye to get kategoriId
      const kampanye = await Kampanye.findOrFail(payload.kampanyeId)
      // Create donasi
      const donasi = await Donasi.create(
        {
          jumlah: payload.jumlah,
          tanggal: DateTime.fromJSDate(payload.tanggal),
          donaturId: payload.donaturId,
          kategoriId: kampanye.kategoriId,
        },
        { client: trx }
      )

      // Create transaksi donasi
      await TransaksiDonasi.create(
        {
          donasiId: donasi.id,
          kampanyeId: payload.kampanyeId,
          status: 'PENDING',
        },
        { client: trx }
      )

      await trx.commit()

      session.flash('success', 'Donasi berhasil ditambahkan dengan status PENDING!')
      return response.redirect().toRoute('donasis.index')
    } catch (error) {
      await trx.rollback()
      session.flash('error', 'Gagal menambahkan donasi!')
      return response.redirect().back()
    }
  }

  /**
   * Show individual donasi
   */
  async show({ params, view }: HttpContext) {
    const donasi = await Donasi.query()
      .where('id', params.id)
      .preload('donatur')
      .preload('kategori')
      .preload('transaksiDonasi', (query) => {
        query.preload('kampanye')
      })
      .firstOrFail()

    return view.render('pages/donasi/show', { donasi })
  }

  /**
   * Edit individual donasi
   */
  async edit({ params, view }: HttpContext) {
    const donasi = await Donasi.query()
      .where('id', params.id)
      .preload('transaksiDonasi')
      .firstOrFail()

    const donaturs = await Donatur.all()
    const kampanyes = await Kampanye.query().preload('kategori')

    return view.render('pages/donasi/edit', { donasi, donaturs, kampanyes })
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response, session }: HttpContext) {
    const trx = await db.transaction()

    try {
      const donasi = await Donasi.findOrFail(params.id)
      const payload = await request.validateUsing(updateDonasiValidator)

      // Get kampanye to get kategoriId
      const kampanye = await Kampanye.findOrFail(payload.kampanyeId)
      // Update donasi
      await donasi
        .merge({
          jumlah: payload.jumlah,
          tanggal: DateTime.fromJSDate(payload.tanggal),
          donaturId: payload.donaturId,
          kategoriId: kampanye.kategoriId,
        })
        .save()

      // Update transaksi donasi
      const transaksi = await TransaksiDonasi.query().where('donasi_id', donasi.id).firstOrFail()

      await transaksi
        .merge({
          kampanyeId: payload.kampanyeId,
        })
        .save()

      await trx.commit()

      session.flash('success', 'Donasi berhasil diperbarui!')
      return response.redirect().toRoute('donasis.index')
    } catch (error) {
      await trx.rollback()
      session.flash('error', 'Gagal memperbarui donasi!')
      return response.redirect().back()
    }
  }

  /**
   * Update transaction status
   */
  async updateStatus({ params, request, response, session }: HttpContext) {
    try {
      const { status } = request.only(['status'])

      if (!['PENDING', 'SUCCESS', 'FAILED'].includes(status)) {
        session.flash('error', 'Status tidak valid!')
        return response.redirect().back()
      }

      const transaksi = await TransaksiDonasi.query().where('donasi_id', params.id).firstOrFail()

      await transaksi.merge({ status }).save()

      session.flash('success', `Status transaksi berhasil diubah menjadi ${status}!`)
      return response.redirect().toRoute('donasis.index')
    } catch (error) {
      session.flash('error', 'Gagal mengubah status transaksi!')
      return response.redirect().back()
    }
  }

  /**
   * Delete individual donasi
   */
  async destroy({ params, response, session }: HttpContext) {
    const trx = await db.transaction()

    try {
      const donasi = await Donasi.findOrFail(params.id)

      // Delete transaksi donasi first (due to foreign key)
      await TransaksiDonasi.query().where('donasi_id', donasi.id).delete()

      // Delete donasi
      await donasi.delete()

      await trx.commit()

      session.flash('success', 'Donasi berhasil dihapus!')
      return response.redirect().toRoute('donasis.index')
    } catch (error) {
      await trx.rollback()
      session.flash('error', 'Gagal menghapus donasi!')
      return response.redirect().back()
    }
  }
}

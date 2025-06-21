import type { HttpContext } from '@adonisjs/core/http'
import Donasi from '#models/donasi'
import Donatur from '#models/donatur'
import Kampanye from '#models/kampanye'
import TransaksiDonasi from '#models/transaksi_donasi'
import { createDonasiValidator, updateDonasiValidator } from '#validators/donasi'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export default class DonasisController {
  async index({ view }: HttpContext) {
    const donasis = await Donasi.query()
      .preload('donatur')
      .preload('kategori')
      .preload('transaksiDonasi', (query) => {
        query.preload('kampanye')
      })
      .orderBy('created_at', 'desc')

    // return {
    //   test: donasis,
    // }

    return view.render('pages/donasi/index', { donasis })
  }

  async create({ view }: HttpContext) {
    const donaturs = await Donatur.all()
    const kampanyes = await Kampanye.query().preload('kategori')
    return view.render('pages/donasi/create', { donaturs, kampanyes })
  }

  async store({ request, response, session }: HttpContext) {
    const trx = await db.transaction()

    try {
      const payload = await request.validateUsing(createDonasiValidator)

      const kampanye = await Kampanye.findOrFail(payload.kampanyeId)

      // Hitung total donasi yang sudah terkumpul untuk kampanye ini
      const totalDonasiTerkumpul = await db
        .from('transaksi_donasis')
        .join('donasis', 'transaksi_donasis.donasi_id', 'donasis.id')
        .where('transaksi_donasis.kampanye_id', payload.kampanyeId)
        .where('transaksi_donasis.status', 'SUCCESS')
        .sum('donasis.jumlah as total')
        .first()

      const donasiTerkumpul = totalDonasiTerkumpul?.total || 0
      const sisaTarget = kampanye.target - donasiTerkumpul

      // Validasi: donasi tidak boleh melebihi sisa target
      if (payload.jumlah > sisaTarget) {
        session.flash(
          'error',
          `Donasi melebihi target kampanye! Target: Rp ${kampanye.target.toLocaleString('id-ID')}, ` +
            `Terkumpul: Rp ${donasiTerkumpul.toLocaleString('id-ID')}, ` +
            `Sisa: Rp ${sisaTarget.toLocaleString('id-ID')}`
        )
        return response.redirect().back()
      }

      const donasi = await Donasi.create(
        {
          jumlah: payload.jumlah,
          tanggal: DateTime.fromJSDate(payload.tanggal),
          donaturId: payload.donaturId,
          kategoriId: kampanye.kategoriId,
        },
        { client: trx }
      )

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

  async edit({ params, view }: HttpContext) {
    const donasi = await Donasi.query()
      .where('id', params.id)
      .preload('transaksiDonasi')
      .firstOrFail()

    const donaturs = await Donatur.all()
    const kampanyes = await Kampanye.query().preload('kategori')

    return view.render('pages/donasi/edit', { donasi, donaturs, kampanyes })
  }

  async update({ params, request, response, session }: HttpContext) {
    const trx = await db.transaction()

    try {
      const donasi = await Donasi.findOrFail(params.id)
      const payload = await request.validateUsing(updateDonasiValidator)

      const kampanye = await Kampanye.findOrFail(payload.kampanyeId)

      // Hitung total donasi yang sudah terkumpul (kecuali donasi yang sedang diedit)
      const totalDonasiTerkumpul = await db
        .from('transaksi_donasis')
        .join('donasis', 'transaksi_donasis.donasi_id', 'donasis.id')
        .where('transaksi_donasis.kampanye_id', payload.kampanyeId)
        .where('transaksi_donasis.status', 'SUCCESS')
        .where('donasis.id', '!=', donasi.id)
        .sum('donasis.jumlah as total')
        .first()

      const donasiTerkumpul = totalDonasiTerkumpul?.total || 0
      const sisaTarget = kampanye.target - donasiTerkumpul

      // Validasi: donasi tidak boleh melebihi sisa target
      if (payload.jumlah > sisaTarget) {
        session.flash(
          'error',
          `Donasi melebihi target kampanye! Target: Rp ${kampanye.target.toLocaleString('id-ID')}, ` +
            `Terkumpul: Rp ${donasiTerkumpul.toLocaleString('id-ID')}, ` +
            `Sisa: Rp ${sisaTarget.toLocaleString('id-ID')}`
        )
        return response.redirect().back()
      }

      await donasi
        .merge({
          jumlah: payload.jumlah,
          tanggal: DateTime.fromJSDate(payload.tanggal),
          donaturId: payload.donaturId,
          kategoriId: kampanye.kategoriId,
        })
        .save()

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

  async updateStatus({ params, request, response, session }: HttpContext) {
    try {
      const { status } = request.only(['status'])

      if (!['PENDING', 'SUCCESS', 'FAILED'].includes(status)) {
        session.flash('error', 'Status tidak valid!')
        return response.redirect().back()
      }

      const transaksi = await TransaksiDonasi.query()
        .where('donasi_id', params.id)
        .preload('kampanye')
        .preload('donasi')
        .firstOrFail()

      // Hitung total donasi yang sudah terkumpul untuk kampanye ini
      const totalDonasiTerkumpul = await db
        .from('transaksi_donasis')
        .join('donasis', 'transaksi_donasis.donasi_id', 'donasis.id')
        .where('transaksi_donasis.kampanye_id', transaksi.kampanyeId)
        .where('transaksi_donasis.status', 'SUCCESS')
        .sum('donasis.jumlah as total')
        .first()

      const donasiTerkumpul = totalDonasiTerkumpul?.total || 0
      const sisaTarget = transaksi.kampanye.target - donasiTerkumpul

      // Validasi: donasi tidak boleh melebihi sisa target jika status bukan FAILED
      if (status !== 'FAILED' && transaksi.donasi.jumlah > sisaTarget) {
        session.flash(
          'error',
          `Donasi melebihi target kampanye! Target: Rp ${transaksi.kampanye.target.toLocaleString('id-ID')}, ` +
            `Terkumpul: Rp ${donasiTerkumpul.toLocaleString('id-ID')}, ` +
            `Sisa: Rp ${sisaTarget.toLocaleString('id-ID')}`
        )
        return response.redirect().back()
      }

      await transaksi.merge({ status }).save()

      session.flash('success', `Status transaksi berhasil diubah menjadi ${status}!`)
      return response.redirect().toRoute('donasis.index')
    } catch (error) {
      session.flash('error', 'Gagal mengubah status transaksi!')
      return response.redirect().back()
    }
  }

  async destroy({ params, response, session }: HttpContext) {
    const trx = await db.transaction()

    try {
      const donasi = await Donasi.findOrFail(params.id)

      await TransaksiDonasi.query().where('donasi_id', donasi.id).delete()

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

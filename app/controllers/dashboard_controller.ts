import type { HttpContext } from '@adonisjs/core/http'
import Kategori from '#models/kategori'
import Kampanye from '#models/kampanye'
import Donatur from '#models/donatur'
import Donasi from '#models/donasi'

export default class DashboardController {
  async index({ view }: HttpContext) {
    const [kategoriCount, kampanyeCount, donaturCount, donasiCount] = await Promise.all([
      Kategori.query().count('* as total'),
      Kampanye.query().count('* as total'),
      Donatur.query().count('* as total'),
      Donasi.query().count('* as total'),
    ])

    const recentDonations = await Donasi.query()
      .preload('donatur')
      .preload('kategori')
      .preload('transaksiDonasi', (query) => {
        query.preload('kampanye')
      })
      .orderBy('created_at', 'desc')
      .limit(10)

    const totalDonationResult = await Donasi.query().sum('jumlah as total').first()

    const totalDonationAmount = totalDonationResult?.$extras.total || 0

    const stats = {
      kategori: kategoriCount[0].$extras.total,
      kampanye: kampanyeCount[0].$extras.total,
      donatur: donaturCount[0].$extras.total,
      donasi: donasiCount[0].$extras.total,
      totalAmount: totalDonationAmount,
    }

    return view.render('pages/dashboard', {
      stats,
      recentDonations,
    })
  }
}

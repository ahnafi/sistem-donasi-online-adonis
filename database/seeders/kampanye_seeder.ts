import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Kampanye from '#models/kampanye'

export default class extends BaseSeeder {
  async run() {
    await Kampanye.createMany([
      {
        namaKampanye: 'Bangun Sekolah untuk Anak Dhuafa',
        target: 100000000,
        kategoriId: 1, // Pendidikan
      },
      {
        namaKampanye: 'Bantuan Medis untuk Lansia',
        target: 50000000,
        kategoriId: 2, // Kesehatan
      },
      {
        namaKampanye: 'Korban Banjir Bandang',
        target: 75000000,
        kategoriId: 3, // Bencana Alam
      },
      {
        namaKampanye: 'Bantuan Yatim Piatu',
        target: 25000000,
        kategoriId: 4, // Kemanusiaan
      },
    ])
  }
}

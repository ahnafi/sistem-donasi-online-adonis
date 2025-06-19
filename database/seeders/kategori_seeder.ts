import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Kategori from '#models/kategori'

export default class extends BaseSeeder {
  async run() {
    await Kategori.createMany([
      {
        nama_kategori: 'Pendidikan',
      },
      {
        nama_kategori: 'Kesehatan',
      },
      {
        nama_kategori: 'Bencana Alam',
      },
      {
        nama_kategori: 'Kemanusiaan',
      },
    ])
  }
}

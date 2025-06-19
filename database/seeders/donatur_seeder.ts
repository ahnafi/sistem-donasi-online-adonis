import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Donatur from '#models/donatur'

export default class extends BaseSeeder {
  async run() {
    await Donatur.createMany([
      {
        nama: 'Ahmad Suhendra',
        email: 'ahmad.suhendra@gmail.com',
        telepon: '081234567890',
      },
      {
        nama: 'Siti Rahayu',
        email: 'siti.rahayu@gmail.com',
        telepon: '081234567891',
      },
      {
        nama: 'Budi Santoso',
        email: 'budi.santoso@gmail.com',
        telepon: '081234567892',
      },
      {
        nama: 'Indira Maharani',
        email: 'indira.maharani@gmail.com',
        telepon: '081234567893',
      },
    ])
  }
}

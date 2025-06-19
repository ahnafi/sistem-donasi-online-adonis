/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const KategorisController = () => import('#controllers/kategoris_controller')

// dashboard
router.on('/').render('pages/dashboard')

// kategori routes
router
  .group(() => {
    router.get('/', [KategorisController, 'index']).as('index')
    router.get('/create', [KategorisController, 'create']).as('create')
    router.post('/', [KategorisController, 'store']).as('store')
    router.get('/:id', [KategorisController, 'show']).as('show')
    router.get('/:id/edit', [KategorisController, 'edit']).as('edit')
    router.put('/:id', [KategorisController, 'update']).as('update')
    router.delete('/:id', [KategorisController, 'destroy']).as('destroy')
  })
  .prefix('/kategoris')
  .as('kategoris')

// kampanye

// donatur

// donasi

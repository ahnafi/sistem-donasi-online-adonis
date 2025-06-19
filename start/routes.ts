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
const KampanyesController = () => import('#controllers/kampanyes_controller')

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

// kampanye routes
router
  .group(() => {
    router.get('/', [KampanyesController, 'index']).as('index')
    router.get('/create', [KampanyesController, 'create']).as('create')
    router.post('/', [KampanyesController, 'store']).as('store')
    router.get('/:id', [KampanyesController, 'show']).as('show')
    router.get('/:id/edit', [KampanyesController, 'edit']).as('edit')
    router.put('/:id', [KampanyesController, 'update']).as('update')
    router.delete('/:id', [KampanyesController, 'destroy']).as('destroy')
  })
  .prefix('/kampanyes')
  .as('kampanyes')

// donatur

// donasi

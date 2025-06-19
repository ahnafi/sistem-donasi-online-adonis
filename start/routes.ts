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
const DonatursController = () => import('#controllers/donaturs_controller')
const DonasisController = () => import('#controllers/donasis_controller')
const DashboardController = () => import('#controllers/dashboard_controller')

// dashboard
router.get('/', [DashboardController, 'index']).as('dashboard')

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

// donatur routes
router
  .group(() => {
    router.get('/', [DonatursController, 'index']).as('index')
    router.get('/create', [DonatursController, 'create']).as('create')
    router.post('/', [DonatursController, 'store']).as('store')
    router.get('/:id', [DonatursController, 'show']).as('show')
    router.get('/:id/edit', [DonatursController, 'edit']).as('edit')
    router.put('/:id', [DonatursController, 'update']).as('update')
    router.delete('/:id', [DonatursController, 'destroy']).as('destroy')
  })
  .prefix('/donaturs')
  .as('donaturs')

// donasi routes
router
  .group(() => {
    router.get('/', [DonasisController, 'index']).as('index')
    router.get('/create', [DonasisController, 'create']).as('create')
    router.post('/', [DonasisController, 'store']).as('store')
    router.get('/:id', [DonasisController, 'show']).as('show')
    router.get('/:id/edit', [DonasisController, 'edit']).as('edit')
    router.put('/:id', [DonasisController, 'update']).as('update')
    router.patch('/:id/status', [DonasisController, 'updateStatus']).as('updateStatus')
    router.delete('/:id', [DonasisController, 'destroy']).as('destroy')
  })
  .prefix('/donasis')
  .as('donasis')

import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'task-form', // Para crear
    loadChildren: () => import('./pages/task-form/task-form.module').then( m => m.TaskFormPageModule)
  },
  {
    path: 'task-form/:id', // Para editar
    loadChildren: () => import('./pages/task-form/task-form.module').then( m => m.TaskFormPageModule)
  },
  {
    path: 'task-detail/:id', // Para ver detalles
    loadChildren: () => import('./pages/task-detail/task-detail.module').then( m => m.TaskDetailPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController } from '@ionic/angular';

// Importaciones de nuestro servicio y modelo
import { TaskService } from '../services/task.service';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false, // Mantenemos el standalone en false como lo tenías
})
export class HomePage {
  // Variables para almacenar las tareas
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  searchTerm: string = '';

  // Inyección de dependencias en el constructor
  constructor(
    private taskService: TaskService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  // Se ejecuta cada vez que el usuario entra a esta página
  ionViewWillEnter() {
    this.loadTasks();
  }

  // Método para cargar las tareas desde el almacenamiento local
  async loadTasks() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando tareas...',
      spinner: 'circles'
    });
    await loading.present();

    try {
      this.tasks = await this.taskService.getTasks();
      this.filterTasks(); // Aplicamos el filtro por si hay algo escrito en el buscador
    } catch (error) {
      this.showToast('Error al cargar las tareas', 'danger');
    } finally {
      loading.dismiss();
    }
  }

  // Método para el buscador
  filterTasks() {
    if (!this.searchTerm.trim()) {
      this.filteredTasks = [...this.tasks];
      return;
    }
    const term = this.searchTerm.toLowerCase();
    this.filteredTasks = this.tasks.filter(task => 
      task.title.toLowerCase().includes(term) || 
      task.description.toLowerCase().includes(term)
    );
  }

  // Navegación para crear una nueva tarea
  goToCreate() {
    this.navCtrl.navigateForward('/task-form');
  }

  // Navegación para ver/editar una tarea específica
  goToDetail(id: string) {
    this.navCtrl.navigateForward(`/task-detail/${id}`);
  }

  // Método auxiliar para mostrar notificaciones breves
  async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'bottom'
    });
    toast.present();
  }
}
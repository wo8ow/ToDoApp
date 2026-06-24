import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, LoadingController, ToastController, AlertController } from '@ionic/angular';

// IMPORTACIONES CORREGIDAS CON LA RUTA EXACTA
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.page.html',
  styleUrls: ['./task-detail.page.scss'],
  standalone: false, // Añadimos esto por si estás usando módulos tradicionales
})
export class TaskDetailPage {
  task: Task | undefined;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private taskService: TaskService, // Aquí es donde daba el error
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) { }

  ionViewWillEnter() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTask(id);
    }
  }

  async loadTask(id: string) {
    this.task = await this.taskService.getTask(id);
  }

  editTask() {
    if (this.task) {
      this.navCtrl.navigateForward(`/task-form/${this.task.id}`);
    }
  }

  async toggleStatus() {
    if (this.task) {
      this.task.completed = !this.task.completed;
      await this.taskService.saveTask(this.task);
      this.showToast(this.task.completed ? 'Marcada como completada' : 'Marcada como pendiente', 'success');
    }
  }

  async confirmDelete() {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: '¿Estás seguro de que deseas eliminar esta tarea?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', handler: () => this.deleteTask() }
      ]
    });
    await alert.present();
  }

  async deleteTask() {
    if (!this.task) return;

    const loading = await this.loadingCtrl.create({ message: 'Eliminando...' });
    await loading.present();

    try {
      await this.taskService.deleteTask(this.task.id);
      this.showToast('Tarea eliminada correctamente', 'success');
      this.navCtrl.navigateBack('/home'); // Regresar a la lista
    } catch (error) {
      this.showToast('Error al eliminar', 'danger');
    } finally {
      loading.dismiss();
    }
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000, color });
    toast.present();
  }
}
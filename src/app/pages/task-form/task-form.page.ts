import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.page.html',
  styleUrls: ['./task-form.page.scss'],
})
export class TaskFormPage implements OnInit {
  task: Task = {
    id: '',
    title: '',
    description: '',
    completed: false
  };
  isEditMode = false;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private taskService: TaskService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadTask(id);
    }
  }

  async loadTask(id: string) {
    const loadedTask = await this.taskService.getTask(id);
    if (loadedTask) {
      this.task = loadedTask;
    }
  }

  async saveTask() {
    if (!this.task.title.trim()) {
      this.showToast('Por favor, ingresa un título.', 'warning');
      return;
    }

    const loading = await this.loadingCtrl.create({ message: 'Guardando datos...' });
    await loading.present();

    try {
      if (!this.isEditMode) {
        this.task.id = Date.now().toString(); // Generar ID único usando la fecha actual
      }
      
      await this.taskService.saveTask(this.task);
      this.showToast('Tarea guardada exitosamente', 'success');
      this.navCtrl.back(); // Retorna a la vista anterior
    } catch (error) {
      this.showToast('Error al guardar', 'danger');
    } finally {
      loading.dismiss();
    }
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message, duration: 2000, color
    });
    toast.present();
  }
}
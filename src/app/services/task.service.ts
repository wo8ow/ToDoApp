// src/app/services/task.service.ts
import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly TASKS_KEY = 'mis_tareas';

  constructor() { }

  async getTasks(): Promise<Task[]> {
    const { value } = await Preferences.get({ key: this.TASKS_KEY });
    return value ? JSON.parse(value) : [];
  }

  async getTask(id: string): Promise<Task | undefined> {
    const tasks = await this.getTasks();
    return tasks.find(task => task.id === id);
  }

  async saveTask(task: Task): Promise<void> {
    const tasks = await this.getTasks();
    const index = tasks.findIndex(t => t.id === task.id);
    
    if (index > -1) {
      tasks[index] = task;
    } else {
      tasks.push(task);
    }
    
    await Preferences.set({ key: this.TASKS_KEY, value: JSON.stringify(tasks) });
  }

  async deleteTask(id: string): Promise<void> {
    let tasks = await this.getTasks();
    tasks = tasks.filter(task => task.id !== id);
    await Preferences.set({ key: this.TASKS_KEY, value: JSON.stringify(tasks) });
  }
}
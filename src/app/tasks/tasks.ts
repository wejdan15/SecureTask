import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule],
  styleUrl: './tasks.css',
  templateUrl: './tasks.html',
})
export class Tasks implements OnInit {

  tasks: any[] = [];

  constructor(
  private http: HttpClient,
  private cdr: ChangeDetectorRef
) {}
  ngOnInit(): void {
    this.loadTasks();
  }
loadTasks(): void {
  this.http.get<any[]>('http://localhost:3000/api/tasks')
    .subscribe({
      next: (data) => {
        this.tasks = data;
        console.log('Tasks from MySQL:', this.tasks);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur API:', error);
      }
    });
}

 addTask(): void {
  const title = prompt('Enter task title:');

  if (!title) {
    return;
  }

  const description = prompt('Enter task description:') || 'New security task';

  const newTask = {
    title: title,
    description: description
  };

  this.http.post<any>('http://localhost:3000/api/tasks', newTask)
    .subscribe({
      next: (task) => {
        console.log('Task added:', task);

        // Recharge les tâches depuis MySQL
        this.loadTasks();
      },
      error: (error) => {
        console.error('Erreur ajout tâche:', error);
      }
    });
}

  completeTask(id: number): void {

  this.http.put(`http://localhost:3000/api/tasks/${id}/complete`, {})
    .subscribe({
      next: () => {
        this.loadTasks();
      },
      error: (error) => {
        console.error('Erreur Complete:', error);
      }
    });

}

  deleteTask(id: number): void {
    console.log('Delete task:', id);
  }
}
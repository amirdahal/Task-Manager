import { Component, OnInit } from '@angular/core';
import {TaskService} from '../../task.service';
import {List} from '../../models/list.model';
import {Task} from '../../models/task.model';
import {ActivatedRoute, Params, Router} from '@angular/router';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent implements OnInit {

  lists: List[] = [];
  tasks: Task[] = [];
  listId: string;

  constructor(private taskService: TaskService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    // @ts-ignore
    this.taskService.getLists()
      .subscribe((list: List[]) => this.lists = list);

    this.route.params.subscribe((param: Params) => {
      this.listId = param.listId;
      if(!this.listId) return;
      this.taskService.getTasks(this.listId)
        .subscribe((tasks: Task[]) => this.tasks = tasks);
    });
  }

  onTaskClick(task:Task) {
    this.taskService.setCompleted(this.listId, task).subscribe(() => task.completed = !task.completed);
  }
  deleteTask(task: Task) {
    // @ts-ignore
    // @ts-ignore
    this.taskService.deleteTask(this.listId, task._id)
      .subscribe((task:Task) => {
        this.tasks = this.tasks.filter(t=> t._id != task._id);
      });
  }

  deleteList(list: List) {
    this.taskService.deleteList(list._id)
      .subscribe(() => {
        this.lists = this.lists.filter(l => l._id != list._id);
        this.router.navigate(['/lists'])
      })
  }

  addTaskClick() {
    if(!this.listId) {
      alert("Please select a list to add task");
      return;
    }
    this.router.navigate(['./new-task'], { relativeTo: this.route});
  }

}

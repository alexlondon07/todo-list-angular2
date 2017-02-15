import { ServicioIndexedBD } from './app.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  newTodo: string;
  todos: any;
  todoObj: any;

  constructor(private ServicioIndexedBD: ServicioIndexedBD) {
    this.newTodo = '';
    this.todos = [];
    this.todos = this.ServicioIndexedBD.items;
    this.ServicioIndexedBD.inicializarIndexedDB();
  }

  addTodo(event) {
    this.todoObj = {
      newTodo: this.newTodo,
      completed: false
    }
    this.todos.push(this.todoObj);
    this.ServicioIndexedBD.agregarItemDB(this.todoObj);
    this.newTodo = '';
    event.preventDefault();
  }

  // deleteTodo(index) {
  //   this.todos.splice(index, 1);
  // }

  deleteSelectedTodos() {
    for (let i = (this.todos.length - 1); i > -1; i--) {
      if (this.todos[i].completed) {
        this.todos.splice(i, 1);
        this.ServicioIndexedBD.eliminarItemDB(i);
      }
    }
  }
}

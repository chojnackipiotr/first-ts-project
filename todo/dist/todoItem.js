"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoItem = void 0;
class TodoItem {
    // public id: number;
    // public task: string;
    // public complete: boolean = false;
    constructor(id, task, complete = false) {
        this.id = id;
        this.task = task;
        this.complete = complete;
        // this.id = id;
        // this.task = task;
        // this.complete = complete
    }
    printDetails() {
        console.log(`${this.id}\t${this.task} ${this.complete ? '\t(wykonane)' : ''}`);
    }
}
exports.TodoItem = TodoItem;

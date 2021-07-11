"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const todoItem_1 = require("./todoItem");
const jsonTodoCollection_1 = require("./jsonTodoCollection");
const inquirer = require("inquirer");
let todos = [
    new todoItem_1.TodoItem(1, 'Kupić kwiaty'),
    new todoItem_1.TodoItem(2, 'Odebrać buty'),
    new todoItem_1.TodoItem(3, 'Zamówić bilety'),
    new todoItem_1.TodoItem(4, 'Zadzwonić do Janka', true),
];
let collection = new jsonTodoCollection_1.JsonTodoCollection("Piotrek", todos);
let showCompleted = true;
function displayTodoList() {
    console.log(`Lista ${collection.userName}a. Liczba zadań pozostałych do zrobienia: ${collection.getItemCounts().incomplete}`);
    collection.getTodoItems(showCompleted).forEach(item => item.printDetails());
}
var Commands;
(function (Commands) {
    Commands["Add"] = "Dodaj nowe zadanie";
    Commands["Complete"] = "Wykonanie zadania";
    Commands["Toggle"] = "Poka\u017C lub ukryj wykonanie";
    Commands["Purge"] = "Usu\u0144 wykonane zadania";
    Commands["Quit"] = "Koniec";
})(Commands || (Commands = {}));
function promptAdd() {
    console.clear();
    inquirer.prompt({
        type: 'input',
        name: 'add',
        message: 'Podaj zadanie: '
    }).then(answers => {
        if (answers['add'] !== '') {
            collection.addTodo(answers['add']);
        }
        promptUser();
    });
}
function promptComplere() {
    console.clear();
    inquirer.prompt({
        type: "checkbox",
        name: "complete",
        message: "Oznaczenie zadań jako wykonanych",
        choices: collection.getTodoItems(showCompleted).map(item => ({
            name: item.task,
            value: item.id,
            checked: item.complete
        }))
    }).then(answers => {
        let completedTasks = answers['complete'];
        collection.getTodoItems(true).forEach(item => {
            collection.markComplete(item.id, completedTasks.find(id => id === item.id) !== undefined);
            promptUser();
        });
    });
}
function promptUser() {
    console.clear();
    displayTodoList();
    inquirer.prompt({
        type: 'list',
        name: 'command',
        message: 'Wybierz opcję',
        choices: Object.values(Commands),
        // badProperty: true,
    }).then(answers => {
        switch (answers['command']) {
            case Commands.Toggle:
                showCompleted = !showCompleted;
                promptUser();
                break;
            case Commands.Add:
                promptAdd();
                break;
            case Commands.Complete:
                if (collection.getItemCounts().incomplete > 0) {
                    promptComplere();
                }
                else {
                    promptUser();
                }
                break;
            case Commands.Purge:
                collection.removeComplete();
                promptUser();
                break;
        }
    });
}
promptUser();
// collection.removeComplete();
// let newId: number = collection.addTodo('Iść pobiegać');
// let todoItem: TodoItem = collection.getTodoById(newId);
// todoItem.printDetails();
// console.log(JSON.stringify(todoItem));

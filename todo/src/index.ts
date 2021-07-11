import {TodoItem} from './todoItem';
import {TodoCollection} from './todoCollection';
import {JsonTodoCollection} from "./jsonTodoCollection";
import * as inquirer from 'inquirer';

let todos: TodoItem[] = [
    new TodoItem(1, 'Kupić kwiaty'),
    new TodoItem(2, 'Odebrać buty'),
    new TodoItem(3, 'Zamówić bilety'),
    new TodoItem(4, 'Zadzwonić do Janka', true),
];

let collection : TodoCollection = new JsonTodoCollection("Piotrek", todos);
let showCompleted = true;

function displayTodoList(): void {
    console.log(`Lista ${collection.userName}a. Liczba zadań pozostałych do zrobienia: ${collection.getItemCounts().incomplete}`);
    collection.getTodoItems(showCompleted).forEach(item => item.printDetails());
}

enum Commands {
    Add = "Dodaj nowe zadanie",
    Complete = "Wykonanie zadania",
    Toggle = "Pokaż lub ukryj wykonanie",
    Purge = "Usuń wykonane zadania",
    Quit = "Koniec"
}

function promptAdd(): void {
    console.clear();
    inquirer.prompt({
        type: 'input',
        name: 'add',
        message: 'Podaj zadanie: '
    }).then(answers => {
        if (answers['add'] !== '') {
            collection.addTodo(answers['add'])
        }
        promptUser();
    })
}

function promptComplere(): void {
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
        let completedTasks = answers['complete'] as number [];
        collection.getTodoItems(true).forEach(item => {
            collection.markComplete(item.id, completedTasks.find(id => id === item.id) !== undefined);
            promptUser();
        })
    })
}

function promptUser(): void {
    console.clear();
    displayTodoList();
    inquirer.prompt({
        type: 'list',
        name: 'command',
        message: 'Wybierz opcję',
        choices: Object.values(Commands),
        // badProperty: true,
    }).then(answers => {
        switch(answers['command']){
            case Commands.Toggle:
                showCompleted = !showCompleted;
                promptUser();
                break;
            case Commands.Add:
                promptAdd();
                break;
            case Commands.Complete:
                if(collection.getItemCounts().incomplete > 0) {
                    promptComplere()
                } else {
                    promptUser();
                }
                break
            case Commands.Purge:
                collection.removeComplete();
                promptUser();
                break;
        }
    })
}

promptUser();

// collection.removeComplete();

// let newId: number = collection.addTodo('Iść pobiegać');
// let todoItem: TodoItem = collection.getTodoById(newId);
// todoItem.printDetails();
// console.log(JSON.stringify(todoItem));

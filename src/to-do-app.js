const template = document.createElement('template');

// template is cheaper than calling .innerHtml on all instances of the component
template.innerHTML = `
<style>
@import "src/to-do-app.css"
</style>

<h1>To do</h1>

<input type="text" placeholder="Add a new to do"></input>
<button>✅</button>

<ul id="todos"></ul>
`;

class TodoApp extends HTMLElement {
    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ 'mode': 'open'});
        //cloning template to shadowroot
        this._shadowRoot.appendChild(template.content.cloneNode(true));
        this.$todoList = this._shadowRoot.querySelector('ul');
        this.$input = this._shadowRoot.querySelector('input');

        this.$submitButton = this._shadowRoot.querySelector('button');
        this.$submitButton.addEventListener('click', this._addTodo.bind(this))
       
        document.querySelector('to-do-app').todos = [];
    }

    set todos(value) {
        console.log('value in set todos', value)
        this._todos = value;
        this._renderTodoList();
    }

    get todos() {
        return this._todos;
    }

    _addTodo() {
        console.log('input value', this.$input.value)
        console.log('todos', this._todos)
        if(this.$input.value.length > 0) {
            this._todos.push({ text: this.$input.value, checked: false })
            this._renderTodoList();
            this.$input.value = '';
        }
    }

    _toggleTodo(e) {
        const todo = this._todos[e.detail];
       
        this._todos[e.detail] = {...todo, checked: !todo.checked}
        this._renderTodoList();
    }

    _renderTodoList() {
        this.$todoList.innerHTML = '';
        
        this._todos.forEach((todo, index) => {
            let $todoItem = document.createElement('to-do-item');
            $todoItem.setAttribute('text', todo.text);

            if (todo.checked) {
                $todoItem.setAttribute('checked', ''); 
            }

            $todoItem.setAttribute('index', index);

            $todoItem.addEventListener('onRemove', this._removeTodo.bind(this));
            $todoItem.addEventListener('onToggle', this._toggleTodo.bind(this));

            console.log('todo item in render todo list', $todoItem)

            this.$todoList.appendChild($todoItem);
        })
    }

    _removeTodo(e) {
        this._todos.splice(e.detail, 1);
        this._renderTodoList();
    }
}

window.customElements.define('to-do-app', TodoApp);
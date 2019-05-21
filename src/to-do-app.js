const template = document.createElement('template');
const templateTwo = document.createElement('template2');

// template is cheaper than calling .innerHtml on all instances of the component
template.innerHTML = `
<style>
    :host {
    display: block;
    font-family: sans-serif;
    text-align: center;
    }

    button {
    border: none;
    cursor: pointer;
    }

    ul {
    list-style: none;
    padding: 0;
    }
</style>
<slot></slot>
<h1>To do</h1>

<input type="text" placeholder="Add a new to do"></input>
<button>✅</button>
<p>Date</p>


<ul id="todos"></ul>
<slot></slot>
`;

templateTwo.innerHTML = `
<h3>LALALALA</h3>
`;

class TodoApp extends HTMLElement {
    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ 'mode': 'open'});
        //cloning template to shadowroot
        this._shadowRoot.appendChild(template.content.cloneNode(true));
        // this._shadowRoot.appendChild(templateTwo.content.cloneNode(true));
        this.$todoList = this._shadowRoot.querySelector('ul');
        this.$input = this._shadowRoot.querySelector('input');

        console.log('slot query selector', this._shadowRoot.querySelector('slot'));
        console.log('h1 query selector', this._shadowRoot.querySelector('h1'))
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
            // this._todos.push({ text: this.$input.value, checked: false, date: 'today'})
            this._todos.push({ text: this.$input.value, checked: false, date: new Date()})
            this._renderTodoList();
            this.$input.value = '';
        }
    }

    _toggleTodo(e) {
        const todo = this._todos[e.detail];
        console.log('todo in toggle', todo)
        // write this in another way 
        // this._todos[e.detail] = Object.assign({}, todo, {
        //     checked: !todo.checked
        // });

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
            $todoItem.setAttribute('date', todo.date)

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
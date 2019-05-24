const template = document.createElement('template');

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

    h1 {
        color: red;
    }

:host-context(.bluetheme) > h1 {
    color: blue;
}

:host([header]) > h1 {
    color: var(--to-do-app-h1, orange)
}

:host(.yellow) {
    color: yellow;
}

:host(.yellow) > h1 {
    color: yellow;
}

</style>

<h1>Shopping List</h1>
<p>Press enter or click the checkmark to add something to your wishlist!</p>

<input type="text" placeholder="Add a new to do"></input>
<button>✅</button>

<ul id="todos"></ul>

<p>---------------------------</p>
`;

class TodoApp extends HTMLElement {
    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ 'mode': 'open'});
        //cloning template to shadowroot
        this._shadowRoot.appendChild(template.content.cloneNode(true));
        this.$todoList = this._shadowRoot.querySelector('ul');
        this.$input = this._shadowRoot.querySelector('input');
        this.$style = this._shadowRoot.querySelector('style');

        this.$submitButton = this._shadowRoot.querySelector('button');
        this.$submitButton.addEventListener('click', this._addTodo.bind(this));

        this.$input.addEventListener('keydown', (event) => {
            if (event.key === "Enter") {
                this._addTodo();
            }
        })
       
        this._todos = [];
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

            this.$todoList.appendChild($todoItem);
        })
    }

    _removeTodo(e) {
        this._todos.splice(e.detail, 1);
        this._renderTodoList();
    }

    static get observedAttributes() {
        return ['stl'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
       if (name === 'stl') {
           this.$style.innerHTML = `@import "src/${newValue}.css"`;
       }
    }
}

window.customElements.define('to-do-app', TodoApp);
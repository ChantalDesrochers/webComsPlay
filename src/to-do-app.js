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

    .headers {
    display: flex;
    align-items: center;
    justify-content: center;
    }

    .hidden {
        display: none;
        }

</style>

<slot name="title"><h1>Wish List</h1></slot>

<slot name="subtitle"><h3>Fall back</h3></slot>
<slot name="description"></slot>

<slot name="top"></slot>

<div class="headers">
<input type="text" placeholder="Add a new to do"></input>
<button>✅</button>
<p>Date</p>
</div>

<ul id="todos"></ul>

<slot name="selectors"></slot>

<slot name="bottom"></slot>

<slot class="hidden" name="list"></slot>

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
        this._todos = [];
        this.$slots = this._shadowRoot.querySelectorAll('slot')
        // console.log('slots', this.$slots)
        // this.$slots.forEach((slot) => {
        //     console.log('slot name', slot.attributes.name)
        //     // console.log('slot name', slot.attributes.name)
        // })

        console.log('list slots', this._shadowRoot.querySelectorAll("slot[name='list']"))
        console.log('list slot', this._shadowRoot.querySelector("slot[name='list']"))
        console.log('inner html of slot?', this._shadowRoot.querySelector("slot[name='list']").assignedNodes({flatten: true})[0])
        this.$listContent = this._shadowRoot.querySelector("slot[name='list']").assignedNodes({flatten: true})[0];
        // this.lContent = this._shadowRoot.querySelector("slot[name='list']").assignedNodes({flatten: true})[0];
        // this.$listContent = this._shadowRoot.querySelector("slot[name='list']") ? this._shadowRoot.querySelector("slot[name='list']").assignedNodes({flatten: true})[0] : null;
        // console.log('assigned nodes', assignedNodes)
    }

    set todos(value) {
        this._todos = value;
        this._renderTodoList();
    }

    get todos() {
        return this._todos;
    }

    // set lContent(val) {
    //     console.log('in list content', val)
    //     if (val) {
    //         return this.lContent = val.outerHTML;
    //     }   
    // }

    // get lContent() {
    //     return this.lContent;
    // }

    _addTodo() {
        if(this.$input.value.length > 0) {
            this._todos.push({ text: this.$input.value, checked: false, date: new Date()})
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

        // console.log('list content', this.$listContent.outerHTML)
        // console.log('typeof', typeof this.$listContent.outerHTML)
        let customText = this.$listContent ? this.$listContent.outerHTML : '';
        console.log('customText', customText)
        this._todos.forEach((todo, index) => {
            let $todoItem = document.createElement('to-do-item');
            $todoItem.setAttribute('text', todo.text);

            if (todo.checked) {
                $todoItem.setAttribute('checked', ''); 
            }

            if (customText) {
                $todoItem.setAttribute('add', customText)
            }

            $todoItem.setAttribute('index', index);
            $todoItem.setAttribute('date', todo.date)

            $todoItem.addEventListener('onRemove', this._removeTodo.bind(this));
            $todoItem.addEventListener('onToggle', this._toggleTodo.bind(this));

            this.$todoList.appendChild($todoItem);
        })
    }

    _removeTodo(e) {
        this._todos.splice(e.detail, 1);
        this._renderTodoList();
    }
}

window.customElements.define('to-do-app', TodoApp);
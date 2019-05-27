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
</style>
<h1>Shopping List</h1>

<input type="text" placeholder="Add a new item"></input>
<button>✅</button>

<ul id="items"></ul>
`;

class ShoppingList extends HTMLElement {
    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ 'mode': 'open'});
        //cloning template to shadowroot
        this._shadowRoot.appendChild(template.content.cloneNode(true));
        this.$shoppingList = this._shadowRoot.querySelector('ul');
        this.$input = this._shadowRoot.querySelector('input');

        this.$submitButton = this._shadowRoot.querySelector('button');
        this.$submitButton.addEventListener('click', this._addItem.bind(this))
        this.$input.addEventListener('keydown', (event) => {
            if (event.key === "Enter") {
                this._addItem();
            }
        })

        document.querySelector('shopping-list').items = [];
    }

    set items(value) {
        this._items = value;
        this._renderShoppingList();
    }

    get items() {
        return this._items;
    }

    _addItem() {
        if(this.$input.value.length > 0) {
            this._items.push({ text: this.$input.value, checked: false})
            this._renderShoppingList();
            this.$input.value = '';
        }
    }

    _renderShoppingList() {
        this.$shoppingList.innerHTML = '';
        
        this._items.forEach((todo, index) => {
            let $shoppingItem = document.createElement('to-do-item');
            $shoppingItem.setAttribute('text', todo.text);

            if (todo.checked) {
                $shoppingItem.setAttribute('checked', ''); 
            }

            $shoppingItem.setAttribute('index', index);

            $shoppingItem.addEventListener('onRemove', this._removeTodo.bind(this));
            $shoppingItem.addEventListener('onToggle', this._toggleTodo.bind(this));

            this.$shoppingList.appendChild($shoppingItem);
        })
    }

    _removeTodo(e) {
        this._items.splice(e.detail, 1);
        this._renderShoppingList();
    }

    _toggleTodo(e) {
        const todo = this._items[e.detail];
        this._items[e.detail] = {...todo, checked: !todo.checked}
        this._renderShoppingList();
    }
}

window.customElements.define('shopping-list', ShoppingList);
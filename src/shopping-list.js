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

    .hide {
        display: none;
    }

</style>

<slot name="title"><h1>Wish List</h1></slot>

<slot name="subtitle"><h3>Fall back</h3></slot>
<slot name="description"></slot>

<slot name="top"></slot>

<div class="headers">
<input type="text" placeholder="Add a new shopping item"></input>
<button>✅</button>
<p>Date</p>
</div>

<ul id="items"></ul>

<slot name="selectors"></slot>

<slot name="bottom"></slot>

<slot class="hidden" name="list"></slot>

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
        this._items = [];
        this.$slots = this._shadowRoot.querySelectorAll('slot')
  
        this.$listContent = this._shadowRoot.querySelector("slot[name='list']").assignedNodes({flatten: true})[0];
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
            this._items.push({ text: this.$input.value, checked: false, date: new Date()})
            this._renderShoppingList();
            this.$input.value = '';
        }
    }

    _toggleListItems(e) {
        const todo = this._items[e.detail];
        this._items[e.detail] = {...todo, checked: !todo.checked}
        this._renderShoppingList();
    }

    _renderShoppingList() {
        this.$shoppingList.innerHTML = '';
        this._items.forEach((todo, index) => {
            let $shoppingItem = document.createElement('shopping-item');
            $shoppingItem.setAttribute('text', todo.text);

            if (todo.checked) {
                $shoppingItem.setAttribute('checked', ''); 
            }

            if (this.$listContent) {
                $shoppingItem.specialText = this.$listContent;
            }

            $shoppingItem.setAttribute('index', index);
            $shoppingItem.setAttribute('date', todo.date)

            $shoppingItem.addEventListener('onRemove', this._removeShoppingItem.bind(this));
            $shoppingItem.addEventListener('onToggle', this._toggleListItems.bind(this));

            this.$shoppingList.appendChild($shoppingItem);
        })
    }

    _removeShoppingItem(e) {
        this._items.splice(e.detail, 1);
        this._renderShoppingList();
    }
}

window.customElements.define('shopping-list', ShoppingList);
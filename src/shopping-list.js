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
    color: var(--shopping-list-h1, orange)
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

<input type="text" placeholder="Add a new item"></input>
<button>✅</button>

<ul id="items"></ul>

<p>---------------------------</p>
`;

class ShoppingList extends HTMLElement {
    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ 'mode': 'open'});
        //cloning template to shadowroot
        this._shadowRoot.appendChild(template.content.cloneNode(true));
        this.$shopList = this._shadowRoot.querySelector('ul');
        this.$input = this._shadowRoot.querySelector('input');
        this.$style = this._shadowRoot.querySelector('style');

        this.$submitButton = this._shadowRoot.querySelector('button');
        this.$submitButton.addEventListener('click', this._addItem.bind(this));

        this.$input.addEventListener('keydown', (event) => {
            if (event.key === "Enter") {
                this._addItem();
            }
        })
       
        this._items = [];
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
            this._items.push({ text: this.$input.value, checked: false })
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
        this.$shopList.innerHTML = '';
        
        this._items.forEach((todo, index) => {
            let $shoppingItem = document.createElement('shopping-item');
            $shoppingItem.setAttribute('text', todo.text);

            if (todo.checked) {
                $shoppingItem.setAttribute('checked', ''); 
            }

            if (this.hasAttribute('header')) {
                $shoppingItem.setAttribute('header', '')
            }

            $shoppingItem.setAttribute('index', index);

            $shoppingItem.addEventListener('onRemove', this._removeShoppingItem.bind(this));
            $shoppingItem.addEventListener('onToggle', this._toggleListItems.bind(this));

            this.$shopList.appendChild($shoppingItem);
        })
    }

    _removeShoppingItem(e) {
        this._items.splice(e.detail, 1);
        this._renderShoppingList();
    }

    _createThemeStyle(color) {
        console.log('in create theme style', color)
        return `:host([theme="${color}"]) {
            color: ${color};
        }
        
        :host(.yellow) > h1 {
            color: ${color};
        }`
    }

    static get observedAttributes() {
        return ['stl', 'theme'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
       if (name === 'stl') {
           this.$style.innerHTML = `@import "src/${newValue}.css"`;
       }
       if (name === 'theme'){
           console.log('in theme')
           this._createThemeStyle(newValue);
       }
    }
}

window.customElements.define('shopping-list', ShoppingList);
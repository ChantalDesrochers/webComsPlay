const template = document.createElement('template');
template.innerHTML = `
<style>
    :host {
    display: block;
    font-family: sans-serif;
    }

    .completed {
    text-decoration: line-through;
    }

    button {
    border: none;
    cursor: pointer;
    }
</style>
<li class="item">
    <input type="checkbox">
    <label></label>
    <button>❌</button>
    <p></p>
</li>
`;

class ShoppingItem extends HTMLElement {
    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ 'mode': 'open'});
        this._shadowRoot.appendChild(template.content.cloneNode(true));

        this.$item = this._shadowRoot.querySelector('.item');
        this.$removeButton = this._shadowRoot.querySelector('button');
        this.$checkbox = this._shadowRoot.querySelector('input');
        this.$text = this._shadowRoot.querySelector('label');
        this.$date = this._shadowRoot.querySelector('p');

        this.$removeButton.addEventListener('click', (e) => {
            this.dispatchEvent(new CustomEvent('onRemove', {detail: this.index}));
        });

        this.$checkbox.addEventListener('click', (e) => {
            this.dispatchEvent(new CustomEvent('onToggle', {detail: this.index}));
        });
    }

    get index() {
        return this._index;
    }

    set index(val) {
        this.setAttribute('index', val);
    }

    get checked() {
        return this.hasAttribute('checked')
    }

    set checked(val) {
        if (val) {
            this.setAttribute('checked', '')
        } else {
            this.removeAttribute('checked')
        }
    }

    connectedCallback() {
        if(!this.hasAttribute('text')) {
            this['text'] = 'placeholder';
        }

        if (!this.hasAttribute('date')) {
            this['date'] = 'today';
        }

        this._renderShoppingItem();
    }

    _renderShoppingItem() {
        if (this.hasAttribute('checked')) {
            this.$item.classList.add('completed');
            this.$checkbox.setAttribute('checked', '')
        } else {
            this.$item.classList.remove('completed');
            this.$checkbox.removeAttribute('checked')
        }
        this.$text.innerHTML = this._text;
        this.$date.innerHTML = this._date;

        if (this.specialText) {
            this.$date.appendChild(this.specialText)
        }
 
    }

    static get observedAttributes() {
        return ['text', 'checked', 'index', 'date'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch(name){
            case 'text':
                this._text = newValue;
                break;
            case 'checked':
                this._checked = this.hasAttribute('checked');
                break;
            case 'index':
                this._index = parseInt(newValue);
                break;
            case 'date':
                this._date = newValue;
                break;
        }
    }
}

window.customElements.define('shopping-item', ShoppingItem)
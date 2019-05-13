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
</li>
`;

class TodoItem extends  HTMLElement {
    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ 'mode': 'open'});
        this._shadowRoot.appendChild(template.content.cloneNode(true));

        this.$item = this._shadowRoot.querySelector('.item');
        this.$removeButton = this._shadowRoot.querySelector('button');
        this.$checkbox = this._shadowRoot.querySelector('input');
        this.$text = this._shadowRoot.querySelector('label');

        this.$removeButton.addEventListener('click', (e) => {
            this.dispatchEvent(new CustomEvent('onRemove', {detail: this.index}));
        });

        this.$checkbox.addEventListener('click', (e) => {
            this.dispatchEvent(new CustomEvent('onToggle', {detail: this.index}));
        });
    }

    get checked() {
        return this.hasAttribute('checked');
    }

    set checked(val) {
        if (val) {
            this.setAttribute('checked', '')
        } else {
            this.removeAttribute('checked');
        }
    }

    get index() {
        return this._index;
    }

    set index(val) {
        this.setAttribute('index', val);
    }

    connectedCallback() {
        console.log('inConnectedCallback')
        console.log('inConnectedCallback - this', this)
        if(!this.hasAttribute('text')) {
            // this.setAttribute('text', 'placeholder');
            this['text'] = 'placeholder';
        }

        this._renderTodoItem();
    }

    _renderTodoItem() {
        // why are we checking if it has an attribute and setting the same attribute if it does
        if (this.hasAttribute('checked')) {
            this.$item.classList.add('completed');
            this.$checkbox.setAttribute('checked', '')
        } else {
            this.$item.classList.remove('completed');
            this.$checkbox.removeAttribute('checked')
        }
        this.$text.innerHTML = this._text;
    }

    static get observedAttributes() {
        return ['text', 'checked', 'index'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log('oldValue', oldValue)
        console.log('name', name)
        console.log('newValue', newValue)
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
        }
    }
}

window.customElements.define('to-do-item', TodoItem)
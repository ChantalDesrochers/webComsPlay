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

class TodoItem extends HTMLElement {
    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ 'mode': 'open'});
        this._shadowRoot.appendChild(template.content.cloneNode(true));

        this.$item = this._shadowRoot.querySelector('.item');
        this.$removeButton = this._shadowRoot.querySelector('button');
        this.$checkbox = this._shadowRoot.querySelector('input');
        this.$text = this._shadowRoot.querySelector('label');
        this.$date = this._shadowRoot.querySelector('p');

        console.log('date in constructor', this.$date)
        console.log('text in constructor', this.$text)

        this.$removeButton.addEventListener('click', (e) => {
            this.dispatchEvent(new CustomEvent('onRemove', {detail: this.index}));
        });

        this.$checkbox.addEventListener('click', (e) => {
            this.dispatchEvent(new CustomEvent('onToggle', {detail: this.index}));
        });
    }

    // get checked() {
    //     return this.hasAttribute('checked');
    // }

    // set checked(val) {
    //     console.log('in setter', val)
    //     if (val) {
    //         this.setAttribute('checked', '')
    //     } else {
    //         this.removeAttribute('checked');
    //     }
    // }

    get index() {
        return this._index;
    }

    set index(val) {
        this.setAttribute('index', val);
    }

    // get date() {
    //     return this._date;
    // }

    // set date(val) {
    //     console.log('in set date', val)
    //     this.setAttribute('date', val)
    // }

    connectedCallback() {
        console.log('inConnectedCallback')
        console.log('inConnectedCallback - this', this)
        if(!this.hasAttribute('text')) {
            // this.setAttribute('text', 'placeholder');
            this['text'] = 'placeholder';
        }

        if (!this.hasAttribute('date')) {
            console.log('in connected callback...date')
            this['date'] = 'today';
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
        console.log('this.$date in render todo', this.$date)
        console.log('this._date in render todo', this._date)
        this.$date.innerHTML = this._date;
    }

    static get observedAttributes() {
        return ['text', 'checked', 'index', 'date'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log('oldValue', oldValue)
        console.log('name', name)
        console.log('newValue typeof', typeof newValue)
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
        }
    }
}

window.customElements.define('to-do-item', TodoItem)
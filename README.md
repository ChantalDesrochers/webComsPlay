# Inserting Custom Styles

User story --> As a developer I want to be able to externally customize the styling of my custom element in the following ways:
- completely overwrite existing styling and create my own stylesheet
- apply a theme to only the custom element itself
- apply a theme to an entire area (which includes the custom element itself)
- tweak internal styles within the custom element

## Getting Started

1. Clone the repository
2. Checkout to this branch (userInsertedStlye) <-- (yes style is spelled incorrectly)
3. npm install
4. 'npm run start' to start the server
5. Visit http://localhost:8080/

### Background information
- The first custom element instance uses a user generated style sheet to override all component styling and start from scratch
- The second custom element instance only has the user generated styling on the component itself (font-size)
- The third custom element instance uses a user generated class to initiate the 'yellow' styles
- The fourth custom element instance uses a user generated contextual class (on its containing div) to apply the blue theme to the custom element which is also applied to it's neighbouring elements
- The fifth custom element instance uses style hooks to customize the styling of individual elements contained inside the custom element (in this case the h1)

### Experimenting Notes
---StyleSheet---
- pass in the name of the style sheet as an attribute
- in the attributeChangedCallback set the inner html of the style tag to `@import "src/${newValue}.css"`
- likely a better way to do this - have yet to Google best practices when using an external stylesheet in a custom element
---Styling using the element itself---
- easy to do, requires nothing from the webComponent itself - users can do this on their own
- limiting to what can be styled
---User Generated Class---
- useful for using a predefined custom element theme
- can likely make this more dynamic - variables for colors?
---User Generated Theme Pass---
- webcomponent would need be built with the specific overarching theme in mind
- potentially useful if style expectations are defined to user ahead of time and they want to use the class name to style neighbouring elements
---Style Hooks---
- likely that a user will want to style individual elements within the custom element
- would need to provide a style hook for every element?
- if custom elements have many styleable elements could get unwieldy

### Experimenting To Dos
- look into making user passed class theme generation more dynamic
- look into styling elements within a nested custom element (e.g. individual list item)
- look into styling slot elements
- look into ideal way to pass stylesheet to custom element



# Modifying Text Content in Custom Elements

User story --> As a developer I want to be able to modify the text content in the custom elements in the following ways:
- add additional html elements where there are none
- modify default text to something custom
- where there are default tags/text I would like the ability to not just change the text but also the element
- I would like to reach into nested custom elements within the custom element

## Getting Started

1. Clone the repository
2. Checkout to this branch (userInsertedText)
3. npm install
4. 'npm run start' to start the server
5. Visit http://localhost:8080/

### Background information

In the index.html file:
- The first use of the <shopping-list> element uses named slots to overwrite existing elements (content and tag type) as well as add
- The second use of the <shopping-list> element is the default state
- The  <shopping-list> todo uses location of the page to insert custom content (named location slot)
- The fourth <shopping-list> uses slots to pass content through to a nested custom element (this probably isn't performant - look into a better way)

### Experimenting Notes

--- The first <shopping-list> ---
 - named slots useful for the user as they know where they can expect the content/tags
 - ability to add multiple elements for the same slot also useful
 - defaults helpful so users can see where the slot is located
 - if slot has a default set and that slot is used multiple times, default is only used for the first use case
 - could add a display none option if they don't want to display a specific element 
  
--- The third <shopping-list> ---
- same as first but uses a named location for slots - e.g. bottom, top
- adding full divs into a slot
  
--- The fourth <shopping-list> ---
- the named 'list' slot is not displayed on the <shopping-list> custom element itself, but passed to the nested custom element <shopping-item> component and displayed when a customer adds something to the shopping list
- set the slot to display none on the <shopping-list> 
- pulled the inner html from the shadow root and set as an attribute when creating instances of the nested element
- convert back to dom elements in the attributeChangedCallback within the nested <shopping-item> element
  THIS IS LIKELY NOT THE WAY TO GO ABOUT IT - LARGER SLOTS PASSED THROUGH ATTRIBUTES IS NOT IDEAL

### Experimenting To dos

- research better way to pass html through multiple custom elements
- add an experiment that adds ability to hide existing elements contained in the custom element
- research better way to pass html through multiple custom elements

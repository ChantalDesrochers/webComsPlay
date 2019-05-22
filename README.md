# Inserting Additional HTML Elements

User story --> As a developer I want to be able to add additional html elements.

## Getting Started

1. Clone the repository
2. npm install
3. 'npm run start' to start the server
4. server is located at http://localhost:8080/

### Useful information

- The index.html file contains three versions of the custom element <to-do-app> (the <to-do-app> element contains a <to-do-item> custom element.)
- The first use of the <to-do-app> element uses named slots to add optional elements
- The second use of the <to-do-app> element is the default state
- The third ... todo = may need new branch to consider location setup.

### Experimenting

- the <to-do-app> template contains name slots which can receive multiple slots matching that name
- the 'subtitle' slot has a fallback so that if not specified, backup content will be displayed.
- if the 'subtitle' slot is used multiple times, only the first instance of use will have a fallback.
- the 'description' and 'selectors' slots do not have fall back defaults and if the user does not specify content for these slots,
default will be to display nothing.
- the user can define the element to be slotted in themselves. The application will display the desired element.

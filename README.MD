# Berties Books

Sample code for Dynamic Web Applications module.

Uses node.js with Express and EJS.

To install and run:

npm install
node index.js

## API

### GET /api/books
Returns all books as JSON.

Examples:

- `GET /api/books`  
  All books.

- `GET /api/books?search=world`  
  Books whose name contains "world".

- `GET /api/books?minprice=5&max_price=10`  
  Books priced between £5 and £10.

- `GET /api/books?sort=name`  
  Books sorted by name.

- `GET /api/books?sort=price`  
  Books sorted by price.

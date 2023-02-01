# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index: '/products' [GET]
- Show: '/products/:productId' [GET]
- Create [token required]: '/products' [POST]
- [OPTIONAL] Top 5 most popular products: '/most-popular-products' [GET]
- [OPTIONAL] Products by category (args: product category): '/products-by-category/:category' [GET]

#### Users
- Index [token required]: '/users' [GET]
- Show [token required]: '/users/:userId' [GET]
- Create N[token required]: '/users' [POST]

#### Orders
- Current Order by user (args: user id)[token required]: '/current-order-by-user/:userId' [GET]
- [OPTIONAL] Completed Orders by user (args: user id)[token required]: '/completed-orders-by-users/:userId' [GET]

## Data Shapes
#### Product
-  id
- name_prod
- price
- [OPTIONAL] category
Table products (id: serial primary key, name_prod: varchar, price: number, category?: varchar)
#### User
- id
- firstName
- lastName
- password
Table users (id: serial primary key, firstname: varchar, lastname: varchar, password: varchar)
#### Orders
- id
- order_id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)
Table orders (id: serial primary key, order_id: varchar, product_id:string[foreign key to products table], quantity: number, user_id:string[foreign key to users table], status: varchar)

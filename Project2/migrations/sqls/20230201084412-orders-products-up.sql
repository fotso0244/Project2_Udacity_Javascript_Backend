CREATE TABLE orders_products (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR,
    product_id bigint REFERENCES products(id),
    quantity integer
    
);
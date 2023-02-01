CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR,
    product_id bigint REFERENCES products(id),
    quantity integer,
    user_id bigint REFERENCES users(id),
    status VARCHAR(15)
    
);
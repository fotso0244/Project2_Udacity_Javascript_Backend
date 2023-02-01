CREATE TABLE orders_products (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(20) REFERENCES orders(order_id),
    product_id bigint REFERENCES products(id),
    quantity integer
    
);
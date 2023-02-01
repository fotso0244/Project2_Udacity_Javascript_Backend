CREATE TABLE orders (
    id SERIAL,
    order_id VARCHAR(20) PRIMARY KEY,
    user_id bigint REFERENCES users(id),
    status VARCHAR(15)
    
);
CREATE TABLE products(
    product_id INT PRIMARY KEY,
    product_name VARCHAR(255),
    category VARCHAR(50),
    price DECIMAL (10,2)
);

CREATE TABLE inventory(
    inventory_id INT PRIMARY KEY,
    product_id INT,
    quantity INT,
    location VARCHAR(50),
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE orders(
    order_id INT PRIMARY KEY,
    customer_id INT,
    order_date DATE
);

CREATE TABLE orderDetails(
    order_detail_id INT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE RESTRICT
);

INSERT INTO products(product_id, product_name, category, price) VALUES (1, 'Laptop', 'Elektronik', 999.99),
(2, 'Meja Kursi', 'Perabot', 199.99),
(3, 'Printer', 'Elektronik', 299.99),
(4, 'Rak Buku', 'Perabot', 149.99);

SELECT product_name, price FROM products;

INSERT INTO inventory(inventory_id, product_id, quantity, location) VALUES (1, 1, 50, 'Gudang A'),
(2, 2, 30, 'Gudang B'),
(3, 3, 20, 'Gudang A'),
(4, 4, 40, 'Gudang B');

SELECT product_name, quantity, location FROM products JOIN inventory ON products.product_id = inventory.product_id;

UPDATE products SET price = 1099.99 WHERE product_name = 'Laptop';

SELECT inventory.location, SUM(products.price * inventory.quantity) as total_value FROM inventory JOIN products ON inventory.product_id = products.product_id GROUP BY inventory.location;

INSERT INTO orders(order_id, customer_id, order_date) VALUES (1, 101, '2024-08-12'), (2, 102, '2024-08-13');

INSERT INTO orderDetails(order_detail_id, order_id, product_id, quantity) VALUES (1, 1, 1, 2), (2, 1, 3, 1), (3, 2, 2, 1), (4, 2, 4, 2);

SELECT 
    od.order_id, 
    o.order_date, 
    SUM(p.price * od.quantity) AS total_value 
FROM orderDetails od 
JOIN orders o ON od.order_id = o.order_id 
JOIN products p ON od.product_id = p.product_id 
GROUP BY od.order_id, o.order_date;

SELECT 
    p.product_id,
    p.product_name
FROM products p
LEFT JOIN orderDetails od ON p.product_id = od.product_id
WHERE od.product_id IS NULL;

CREATE VIEW product_stocks AS
SELECT 
    p.product_name,
    i.quantity,
    i.location
FROM products p
JOIN inventory i ON p.product_id = i.product_id;
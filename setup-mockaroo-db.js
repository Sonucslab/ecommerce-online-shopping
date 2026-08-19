const mysql = require("mysql2/promise");

async function setup() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
  });

  try {
    console.log("Dropping existing nexus_shop to start fresh...");
    await connection.query("DROP DATABASE IF EXISTS nexus_shop;");
    await connection.query("CREATE DATABASE nexus_shop;");
    await connection.query("USE nexus_shop;");

    console.log("Creating exactly 8 tables as per teacher requirements...");

    await connection.query(`
      CREATE TABLE Category (
          category_id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT
      );
    `);

    await connection.query(`
      CREATE TABLE Product (
          product_id INT AUTO_INCREMENT PRIMARY KEY,
          category_id INT NOT NULL,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          price DECIMAL(10, 2) NOT NULL,
          stock_quantity INT NOT NULL DEFAULT 0,
          image_url VARCHAR(255),
          FOREIGN KEY (category_id) REFERENCES Category(category_id)
      );
    `);

    await connection.query(`
      CREATE TABLE Customer (
          customer_id INT AUTO_INCREMENT PRIMARY KEY,
          first_name VARCHAR(100) NOT NULL,
          last_name VARCHAR(100) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          password_hash VARCHAR(255) NOT NULL,
          phone VARCHAR(20),
          address TEXT,
          role VARCHAR(50) DEFAULT 'customer',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await connection.query(`
      CREATE TABLE Cart (
          cart_id INT AUTO_INCREMENT PRIMARY KEY,
          customer_id INT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (customer_id) REFERENCES Customer(customer_id)
      );
    `);

    await connection.query(`
      CREATE TABLE CartItem (
          cart_item_id INT AUTO_INCREMENT PRIMARY KEY,
          cart_id INT NOT NULL,
          product_id INT NOT NULL,
          quantity INT NOT NULL DEFAULT 1,
          FOREIGN KEY (cart_id) REFERENCES Cart(cart_id),
          FOREIGN KEY (product_id) REFERENCES Product(product_id)
      );
    `);

    await connection.query(`
      CREATE TABLE \`Order\` (
          order_id INT AUTO_INCREMENT PRIMARY KEY,
          customer_id INT NOT NULL,
          order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          total_amount DECIMAL(10, 2) NOT NULL,
          status VARCHAR(50) DEFAULT 'Pending',
          FOREIGN KEY (customer_id) REFERENCES Customer(customer_id)
      );
    `);

    await connection.query(`
      CREATE TABLE OrderItem (
          order_item_id INT AUTO_INCREMENT PRIMARY KEY,
          order_id INT NOT NULL,
          product_id INT NOT NULL,
          quantity INT NOT NULL,
          price_at_purchase DECIMAL(10, 2) NOT NULL,
          FOREIGN KEY (order_id) REFERENCES \`Order\`(order_id),
          FOREIGN KEY (product_id) REFERENCES Product(product_id)
      );
    `);

    await connection.query(`
      CREATE TABLE Payment (
          payment_id INT AUTO_INCREMENT PRIMARY KEY,
          order_id INT NOT NULL,
          payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          amount DECIMAL(10, 2) NOT NULL,
          payment_method VARCHAR(50) NOT NULL,
          status VARCHAR(50) DEFAULT 'Completed',
          FOREIGN KEY (order_id) REFERENCES \`Order\`(order_id)
      );
    `);

    console.log("Tables created successfully. Generating Mockaroo-style realistic data...");

    await connection.query(`
      INSERT INTO Category (name, description) VALUES
      ('Laptops', 'High performance laptops for work and gaming.'),
      ('Smartphones', 'Latest mobile devices and accessories.'),
      ('Audio', 'Headphones, speakers, and audio equipment.'),
      ('Accessories', 'Keyboards, mice, and other computer peripherals.')
    `);

    const products = [
      [1, 'Nexus Quantum Laptop', 'The ultimate developer machine with an M4-class processor and 64GB RAM.', 2499.99, 15, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=400'],
      [3, 'Aura Noise-Cancelling Headphones', 'Immersive sound with industry-leading active noise cancellation.', 349.50, 50, 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=400'],
      [2, 'Vanguard Smartphone Pro', 'Capture the world in 8K. Features a revolutionary camera system.', 999.00, 25, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400'],
      [4, 'Zenith Mechanical Keyboard', 'Tactile, responsive, and incredibly satisfying to type on.', 129.99, 100, 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=400']
    ];
    
    for (const p of products) {
      await connection.query(
        'INSERT INTO Product (category_id, name, description, price, stock_quantity, image_url) VALUES (?, ?, ?, ?, ?, ?)',
        p
      );
    }

    await connection.query(`
      INSERT INTO Customer (first_name, last_name, email, password_hash, role) 
      VALUES 
      ('Admin', 'User', 'admin@example.com', '$2a$10$X8O9r8CjGxk.O1x2.uI2/O6p6.R4V4oXw.2j3aB.R1.t3X6r2y8mC', 'admin'),
      ('John', 'Doe', 'john@example.com', '$2a$10$X8O9r8CjGxk.O1x2.uI2/O6p6.R4V4oXw.2j3aB.R1.t3X6r2y8mC', 'customer')
    `);

    console.log("Mockaroo dummy data inserted successfully!");
    console.log("Database Setup Complete! Next.js can now connect.");
  } catch (error) {
    console.error("Setup failed:", error);
  } finally {
    await connection.end();
  }
}

setup();

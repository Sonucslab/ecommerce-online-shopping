const mysql = require('mysql2/promise');

async function addMoreData() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'nexus_shop'
    });

    console.log("Connected to database. Adding more categories and products...");

    const categories = [
      { name: "Laptops", description: "High-performance laptops for work and gaming" },
      { name: "Smartphones", description: "Latest flagship and budget smartphones" },
      { name: "Audio & Headphones", description: "Premium headphones, earbuds, and speakers" },
      { name: "Wearables", description: "Smartwatches and fitness trackers" },
      { name: "Gaming Console", description: "Next-gen gaming consoles and accessories" },
      { name: "Cameras", description: "Professional DSLRs, mirrorless, and action cameras" },
      { name: "Smart Home", description: "Smart lights, plugs, and home automation" },
      { name: "PC Components", description: "CPUs, GPUs, RAM, and Motherboards" },
      { name: "Monitors", description: "High-refresh rate and 4K displays" },
      { name: "Accessories", description: "Cables, chargers, cases, and peripherals" },
    ];

    let categoryIds = [];

    // Insert Categories
    for (const cat of categories) {
      // Check if it exists
      const [existing] = await connection.execute('SELECT category_id FROM Category WHERE name = ?', [cat.name]);
      if (existing.length === 0) {
        const [result] = await connection.execute(
          'INSERT INTO Category (name, description) VALUES (?, ?)',
          [cat.name, cat.description]
        );
        categoryIds.push(result.insertId);
        console.log(`Added category: ${cat.name}`);
      } else {
        categoryIds.push(existing[0].category_id);
      }
    }

    // Insert some products for these categories
    const adjectives = ["Pro", "Max", "Ultra", "Lite", "Plus", "Elite", "Advanced", "Essential", "Classic", "Smart"];
    const colors = ["Midnight Black", "Space Gray", "Ocean Blue", "Rose Gold", "Pearl White", "Crimson Red"];
    
    let productsAdded = 0;
    
    for (let catId of categoryIds) {
      // Add 6 products per category
      for (let i = 0; i < 6; i++) {
        const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const price = (Math.random() * 900 + 50).toFixed(2);
        
        let productName = `Nexus ${adjective} Device - ${color}`;
        if (catId === categoryIds[0]) productName = `QuantumBook ${adjective} 15" - ${color}`;
        if (catId === categoryIds[1]) productName = `NovaPhone ${adjective} 5G - ${color}`;
        if (catId === categoryIds[2]) productName = `Aura Sound ${adjective} Headphones`;
        
        const description = `The latest ${productName} featuring premium build quality, incredible performance, and all-day battery life.`;
        const stock = Math.floor(Math.random() * 100) + 10;
        
        const imageUrl = `https://picsum.photos/seed/${catId}${i}${Date.now()}/600/400`;

        await connection.execute(
          'INSERT INTO Product (category_id, name, description, price, stock_quantity, image_url) VALUES (?, ?, ?, ?, ?, ?)',
          [catId, productName, description, price, stock, imageUrl]
        );
        productsAdded++;
      }
    }

    console.log(`\nSuccessfully added ${categoryIds.length} categories and ${productsAdded} products!`);
    
  } catch (error) {
    console.error("Error adding data:", error);
  } finally {
    if (connection) await connection.end();
  }
}

addMoreData();

const express = require('express');
const fs = require('fs/promises');
const crypto = require('crypto');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Helper functions
const generateId = () => crypto.randomBytes(4).toString('hex');
const dataPath = path.join(__dirname, 'data.json');

const readData = async () => {
  const data = await fs.readFile(dataPath, 'utf8');
  return JSON.parse(data);
};

const writeData = async (data) => {
  await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
};

// API Endpoints

// GET /customers
app.get('/customers', async (req, res) => {
  try {
    const data = await readData();
    res.json(data.customers);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /customers/:id
app.get('/customers/:id', async (req, res) => {
  try {
    const data = await readData();
    const customer = data.customers.find(c => c.id === req.params.id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /customers/:customerId/orders
app.get('/customers/:customerId/orders', async (req, res) => {
  try {
    const data = await readData();
    const orders = data.orders.filter(o => o.customerId === req.params.customerId);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /orders/highvalue
app.get('/orders/highvalue', async (req, res) => {
  try {
    const data = await readData();
    const highValueOrders = data.orders.filter(o => o.totalPrice > 10000000);
    res.json(highValueOrders);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /products
app.get('/products', async (req, res) => {
  try {
    const { minPrice, maxPrice } = req.query;
    const data = await readData();
    let products = data.products;

    if (minPrice) {
      products = products.filter(p => p.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      products = products.filter(p => p.price <= parseFloat(maxPrice));
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /customers
app.post('/customers', async (req, res) => {
  try {
    const { name, email, age } = req.body;
    const data = await readData();

    // Check if email already exists
    if (data.customers.some(c => c.email === email)) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const newCustomer = {
      id: generateId(),
      name,
      email,
      age: parseInt(age)
    };

    data.customers.push(newCustomer);
    await writeData(data);
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /orders
app.post('/orders', async (req, res) => {
  try {
    const { customerId, productId, quantity } = req.body;
    const data = await readData();

    // Validate customer and product exist
    const customer = data.customers.find(c => c.id === customerId);
    const product = data.products.find(p => p.id === productId);

    if (!customer || !product) {
      return res.status(404).json({ error: 'Customer or product not found' });
    }

    // Check stock
    if (quantity > product.quantity) {
      return res.status(400).json({ error: 'Not enough stock' });
    }

    const newOrder = {
      orderId: generateId(),
      customerId,
      productId,
      quantity,
      totalPrice: product.price * quantity
    };

    // Update product quantity
    product.quantity -= quantity;

    data.orders.push(newOrder);
    await writeData(data);
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /orders/:orderId
app.put('/orders/:orderId', async (req, res) => {
  try {
    const { quantity } = req.body;
    const data = await readData();
    const order = data.orders.find(o => o.orderId === req.params.orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const product = data.products.find(p => p.id === order.productId);
    const availableStock = product.quantity + order.quantity; // Add back the original order quantity

    if (quantity > availableStock) {
      return res.status(400).json({ error: 'Not enough stock' });
    }

    // Update product quantity
    product.quantity = availableStock - quantity;

    // Update order
    order.quantity = quantity;
    order.totalPrice = product.price * quantity;

    await writeData(data);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /customers/:id
app.delete('/customers/:id', async (req, res) => {
  try {
    const data = await readData();
    const customerIndex = data.customers.findIndex(c => c.id === req.params.id);

    if (customerIndex === -1) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Remove customer
    data.customers.splice(customerIndex, 1);

    // Remove associated orders
    data.orders = data.orders.filter(o => o.customerId !== req.params.id);

    await writeData(data);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 
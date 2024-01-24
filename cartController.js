const fs = require('fs');
const path = require('path');
const cartsFilePath = path.join(__dirname, 'carts.json');

const createCart = (req, res) => {
  try {
    const carts = JSON.parse(fs.readFileSync(cartsFilePath, 'utf-8'));

    // Autogenerar ID
    const newCartId = Math.max(...carts.map((c) => c.id), 0) + 1;

    const newCart = {
      id: newCartId,
      products: [],
    };

    carts.push(newCart);

    fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));

    res.json(newCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getCartById = (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const carts = JSON.parse(fs.readFileSync(cartsFilePath, 'utf-8'));
    const cart = carts.find((c) => c.id === cartId);

    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ error: 'Cart not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const addProductToCart = (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const { quantity = 1 } = req.body;

    const carts = JSON.parse(fs.readFileSync(cartsFilePath, 'utf-8'));
    const cartIndex = carts.findIndex((c) => c.id === cartId);

    if (cartIndex !== -1) {
      const productIndex = carts[cartIndex].products.findIndex(
        (p) => p.product_id === productId
      );

      if (productIndex !== -1) {
        // Producto existente en el carrito, incrementar cantidad
        carts[cartIndex].products[productIndex].quantity += quantity;
      } else {
        // Producto no existente en el carrito, agregar nuevo
        carts[cartIndex].products.push({
          product_id: productId,
          quantity,
        });
      }

      fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));

      res.json(carts[cartIndex]);
    } else {
      res.status(404).json({ error: 'Cart not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createCart,
  getCartById,
  addProductToCart,
};

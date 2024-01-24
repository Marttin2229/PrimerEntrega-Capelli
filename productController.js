const fs = require('fs');
const path = require('path');
const productsFilePath = path.join(__dirname, 'products.json');

const getAllProducts = (req, res) => {
  try {
    const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getProductById = (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
    const product = products.find((p) => p.id === productId);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const addProduct = (req, res) => {
  try {
    const {
      title,
      description,
      code,
      price,
      status = true,
      stock,
      category,
      thumbnails = [],
    } = req.body;

    const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

    const newProductId = Math.max(...products.map((p) => p.id), 0) + 1;

    const newProduct = {
      id: newProductId,
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    };

    products.push(newProduct);

    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));

    res.json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateProduct = (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const updatedFields = req.body;

    const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
    const productIndex = products.findIndex((p) => p.id === productId);

    if (productIndex !== -1) {
      // Evitar actualizar el ID
      delete updatedFields.id;

      // Actualizar producto
      products[productIndex] = { ...products[productIndex], ...updatedFields };

      fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));

      res.json(products[productIndex]);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteProduct = (req, res) => {
  try {
    const productId = parseInt(req.params.pid);

    const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
    const updatedProducts = products.filter((p) => p.id !== productId);

    fs.writeFileSync(productsFilePath, JSON.stringify(updatedProducts, null, 2));

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};

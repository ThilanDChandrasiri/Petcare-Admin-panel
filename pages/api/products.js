import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Products";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;

  const uri = process.env.MONGODB_URI;

  await mongooseConnect();
  
  if (method === 'GET') {
    try {
      if (req.query?.id) {
        const product = await Product.findOne({ _id: req.query.id });
        if (!product) {
          return res.status(404).json({ error: "Product not found" });
        }
        return res.json(product);
      } else {
        const products = await Product.find();
        return res.json(products);
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  if (method === 'POST') {
    const { title, description, price, images, category, properties } = req.body;
    try {
      const productDoc = await Product.create({
        title,
        description,
        price,
        images,
        category,
        properties,
      });
      return res.json(productDoc);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  if (method === 'PUT') {
    const { title, description, price, images, category, properties, _id } = req.body;
    try {
      const updatedProduct = await Product.updateOne(
        { _id },
        { title, description, price, images, category, properties }
      );
      return res.json(updatedProduct);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  if (method === 'DELETE') {
    if (req.query?.id) {
      try {
        const deletedProduct = await Product.deleteOne({ _id: req.query?.id });
        if (deletedProduct.deletedCount === 0) {
          return res.status(404).json({ error: "Product not found" });
        }
        return res.json(true);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
  }

  // If the method is not recognized or handled, return a 405 Method Not Allowed response.
  return res.status(405).json({ error: "Method Not Allowed" });
}

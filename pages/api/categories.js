import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";
import { getServerSession } from "next-auth";
import { authOptions, isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req,res){
    const {method} = req;
    await mongooseConnect();
    await isAdminRequest(req,res);

    try {
        console.log(`Received ${method} request to /api/categories`);

    if(method === 'GET') {
        res.json(await Category.find().populate('parent'));

    }
    if(method === 'POST') {
        const {name,parentCategory,properties} = req.body;
        const normalizedParentCategory = parentCategory === "" ? null : parentCategory;
        const categoryDoc = await Category.create({
            name,
            parent:normalizedParentCategory || undefined,
            properties,
        });
        res.json(categoryDoc);
    }

    if (method === 'PUT') {
        const { name, parentCategory,properties, _id } = req.body;
        const normalizedParentCategory = parentCategory === "" ? null : parentCategory;
        const updatedCategory = await Category.findOneAndUpdate(
            { _id },
            { properties,name, parent: normalizedParentCategory || undefined },
            { new: true }
        );
        res.json(updatedCategory);
        }

    if (method === 'DELETE') {
        const {_id} = req.query;
        await Category.deleteOne({_id});
        res.json('ok');
    }
} catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
}
}
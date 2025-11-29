import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 5;
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";

  const query = {};

  if (search) query.name = { $regex: search, $options: "i" };
  if (category) query.category = category;

  const skip = (page - 1) * limit;

  const products = await Product.find(query).skip(skip).limit(limit);
  const total = await Product.countDocuments(query);

  return Response.json({ products, total });
}

export async function POST(req) {
  await connectDB();
  const data = await req.json();
  const product = await Product.create(data);
  return Response.json(product);
}

export async function PUT(req) {
  await connectDB();
  const { id, ...rest } = await req.json();
  const updated = await Product.findByIdAndUpdate(id, rest, { new: true });
  return Response.json(updated);
}

export async function DELETE(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  await Product.findByIdAndDelete(id);
  return Response.json({ message: "Deleted" });
}

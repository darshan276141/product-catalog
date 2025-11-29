"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
}

interface FormState {
  name: string;
  price: string | number;
  category: string;
  stock: string | number;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<FormState>({
    name: "",
    price: "",
    category: "",
    stock: "",
  });

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const limit = 5;

  // indicators (for current page data)
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const avgPrice =
    totalProducts > 0
      ? products.reduce((sum, p) => sum + p.price, 0) / totalProducts
      : 0;

  const fetchProducts = useCallback(async () => {
    const res = await axios.get("/api/products", {
      params: {
        search,
        category: categoryFilter === "all" ? "" : categoryFilter,
        page,
        limit,
      },
    });

    setProducts(res.data.products);
    setTotal(res.data.total);
  }, [search, categoryFilter, page]);

  useEffect(() => {
    const load = async () => {
      await fetchProducts();
    };
    load();
  }, [fetchProducts]);

  const openAdd = () => {
    setForm({ name: "", price: "", category: "", stock: "" });
    setEditId(null);
    setOpen(true);
  };

  const openEdit = (p: Product) => {
    setForm({
      name: p.name,
      price: p.price,
      category: p.category,
      stock: p.stock,
    });
    setEditId(p._id);
    setOpen(true);
  };

  const handleSubmit = async () => {
    const normalizedCategory = String(form.category || "").toLowerCase();

    const payload = {
      ...form,
      category: normalizedCategory,
    };

    if (editId) {
      await axios.put("/api/products", { id: editId, ...payload });
    } else {
      await axios.post("/api/products", payload);
    }

    setOpen(false);
    fetchProducts();
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-10 max-w-6xl mx-auto space-y-8">
      {/* INDICATOR CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-2xl font-semibold">{totalProducts}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Total Stock
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-2xl font-semibold">{totalStock}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Avg. Price
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-2xl font-semibold">₹{avgPrice.toFixed(0)}</p>
          </CardContent>
        </Card>
      </div>

      {/* PAGE HEADER + SEARCH + FILTER + ADD BUTTON */}
      <Card className="shadow-sm border rounded-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-3xl font-bold tracking-tight">
            Product Catalog
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4 pt-0 pb-4">
          <Input
            placeholder="Search product by name..."
            className="w-1/3"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          <Select
            onValueChange={(value) => {
              setCategoryFilter(value);
              setPage(1);
            }}
            defaultValue="all"
            value={categoryFilter}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="clothing">Clothing</SelectItem>
              <SelectItem value="home">Home</SelectItem>
              <SelectItem value="toys">Toys</SelectItem>
              <SelectItem value="pet">Pets</SelectItem>
              <SelectItem value="food">Food</SelectItem>
            </SelectContent>
          </Select>

          <Button className="ml-auto" onClick={openAdd}>
            + Add Product
          </Button>
        </CardContent>
      </Card>

      {/* PRODUCT TABLE */}
      <Card className="shadow-sm border rounded-xl overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 border-b">
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {products.map((p) => (
                <TableRow
                  key={p._id}
                  className="hover:bg-muted/20 transition-colors"
                >
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>₹{p.price}</TableCell>
                  <TableCell className="capitalize">{p.category}</TableCell>
                  <TableCell>{p.stock}</TableCell>

                  <TableCell className="text-right space-x-2 pr-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEdit(p)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={async () => {
                        await axios.delete(`/api/products?id=${p._id}`);
                        fetchProducts();
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {products.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No products found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* PAGINATION */}
      <div className="flex justify-center gap-2">
        {Array.from({ length: totalPages }).map((_, i) => (
          <Button
            key={i}
            variant={page === i + 1 ? "default" : "outline"}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </Button>
        ))}
      </div>

      {/* ADD/EDIT MODAL */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="space-y-4 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {editId ? "Edit Product" : "Add Product"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Price</Label>
              <Input
                type="number"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: Number(e.target.value) })
                }
              />
            </div>

            <div>
              <Label>Category</Label>
              <Input
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                placeholder="electronics / clothing / home / toys / pets / food"
              />
            </div>

            <div>
              <Label>Stock</Label>
              <Input
                type="number"
                value={form.stock}
                onChange={(e) =>
                  setForm({ ...form, stock: Number(e.target.value) })
                }
              />
            </div>

            <Button onClick={handleSubmit} className="w-full">
              {editId ? "Update Product" : "Add Product"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

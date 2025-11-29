// "use client";

// import { useEffect, useState, useCallback } from "react";
// import axios from "axios";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";

// import { Label } from "@/components/ui/label";

// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectItem,
//   SelectContent,
// } from "@/components/ui/select";

// interface Product {
//   _id: string;
//   name: string;
//   price: number;
//   category: string;
//   stock: number;
// }

// interface FormState {
//   name: string;
//   price: string | number;
//   category: string;
//   stock: string | number;
// }

// export default function Home() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [form, setForm] = useState<FormState>({
//     name: "",
//     price: "",
//     category: "",
//     stock: "",
//   });

//   const [open, setOpen] = useState(false);
//   const [editId, setEditId] = useState<string | null>(null);

//   const [search, setSearch] = useState("");
//   const [categoryFilter, setCategoryFilter] = useState("");
//   const [page, setPage] = useState(1);
//   const [total, setTotal] = useState(0);

//   const limit = 5;

//   // ⚡ Fetch products with React-safe callback
//   const fetchProducts = useCallback(async () => {
//     const res = await axios.get("/api/products", {
//       params: {
//   search,
//   category: categoryFilter === "all" ? "" : categoryFilter,
//   page,
//   limit,
// }
// ,
//     });

//     setProducts(res.data.products);
//     setTotal(res.data.total);
//   }, [search, categoryFilter, page]);

//   // ⚡ React-safe effect
//   useEffect(() => {
//     const load = async () => {
//       await fetchProducts();
//     };
//     load();
//   }, [fetchProducts]);

//   // Open add modal
//   const openAdd = () => {
//     setForm({ name: "", price: "", category: "", stock: "" });
//     setEditId(null);
//     setOpen(true);
//   };

//   // Open edit modal
//   const openEdit = (p: Product) => {
//     setForm({
//       name: p.name,
//       price: p.price,
//       category: p.category,
//       stock: p.stock,
//     });
//     setEditId(p._id);
//     setOpen(true);
//   };

//   const handleSubmit = async () => {
//     if (editId) {
//       await axios.put("/api/products", { id: editId, ...form });
//     } else {
//       await axios.post("/api/products", form);
//     }

//     setOpen(false);
//     fetchProducts();
//   };

//   const totalPages = Math.ceil(total / limit);

//   return (
//     <div className="p-10 max-w-5xl mx-auto">
//       <h1 className="text-3xl font-semibold mb-8">Product Catalog</h1>

//       {/* SEARCH + FILTER + ADD BUTTON */}
//       <div className="flex items-center gap-4 mb-6">
//         <Input
//           placeholder="Search product..."
//           className="w-1/3"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />

//         <Select onValueChange={(v) => setCategoryFilter(v)}>
//           <SelectTrigger className="w-40">
//             <SelectValue placeholder="Category" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All</SelectItem>
//             <SelectItem value="electronics">Electronics</SelectItem>
//             <SelectItem value="clothing">Clothing</SelectItem>
//             <SelectItem value="home">Home</SelectItem>
//           </SelectContent>
//         </Select>

//         <Button className="ml-auto" onClick={openAdd}>
//           Add Product
//         </Button>
//       </div>

//       {/* PRODUCT TABLE */}
//       <div className="border rounded-md">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Name</TableHead>
//               <TableHead>Price</TableHead>
//               <TableHead>Category</TableHead>
//               <TableHead>Stock</TableHead>
//               <TableHead className="text-right">Actions</TableHead>
//             </TableRow>
//           </TableHeader>

//           <TableBody>
//             {products.map((p) => (
//               <TableRow key={p._id}>
//                 <TableCell>{p.name}</TableCell>
//                 <TableCell>₹{p.price}</TableCell>
//                 <TableCell>{p.category}</TableCell>
//                 <TableCell>{p.stock}</TableCell>

//                 <TableCell className="text-right">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="mr-2"
//                     onClick={() => openEdit(p)}
//                   >
//                     Edit
//                   </Button>

//                   <Button
//                     variant="destructive"
//                     size="sm"
//                     onClick={async () => {
//                       await axios.delete(`/api/products?id=${p._id}`);
//                       fetchProducts();
//                     }}
//                   >
//                     Delete
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}

//             {products.length === 0 && (
//               <TableRow>
//                 <TableCell colSpan={5} className="text-center py-6">
//                   No products found
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       {/* PAGINATION */}
//       <div className="flex justify-center mt-6 gap-2">
//         {Array.from({ length: totalPages }).map((_, i) => (
//           <Button
//             key={i}
//             variant={page === i + 1 ? "default" : "outline"}
//             onClick={() => setPage(i + 1)}
//           >
//             {i + 1}
//           </Button>
//         ))}
//       </div>

//       {/* MODAL */}
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>{editId ? "Edit Product" : "Add Product"}</DialogTitle>
//           </DialogHeader>

//           <div className="flex flex-col gap-4">
//             <div>
//               <Label>Name</Label>
//               <Input
//                 value={form.name}
//                 onChange={(e) =>
//                   setForm({ ...form, name: e.target.value })
//                 }
//               />
//             </div>

//             <div>
//               <Label>Price</Label>
//               <Input
//                 type="number"
//                 value={form.price}
//                 onChange={(e) =>
//                   setForm({ ...form, price: Number(e.target.value) })
//                 }
//               />
//             </div>

//             <div>
//               <Label>Category</Label>
//               <Input
//                 value={form.category}
//                 onChange={(e) =>
//                   setForm({ ...form, category: e.target.value })
//                 }
//               />
//             </div>

//             <div>
//               <Label>Stock</Label>
//               <Input
//                 type="number"
//                 value={form.stock}
//                 onChange={(e) =>
//                   setForm({ ...form, stock: Number(e.target.value) })
//                 }
//               />
//             </div>

//             <Button onClick={handleSubmit} className="mt-2">
//               {editId ? "Update" : "Add"}
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    const load = async () => await fetchProducts();
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
    if (editId) await axios.put("/api/products", { id: editId, ...form });
    else await axios.post("/api/products", form);

    setOpen(false);
    fetchProducts();
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-10 max-w-6xl mx-auto space-y-8">

      {/* PAGE HEADER */}
      <Card className="shadow-sm border rounded-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-3xl font-bold tracking-tight">
            Product Catalog
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4 pt-0 pb-4">

          <Input
            placeholder="Search product..."
            className="w-1/3"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Select onValueChange={setCategoryFilter} defaultValue="all">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="clothing">Clothing</SelectItem>
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
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
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
                onChange={(e) => setForm({ ...form, name: e.target.value })}
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

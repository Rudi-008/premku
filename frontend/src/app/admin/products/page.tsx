"use client";

import { useEffect, useState } from "react";
import {
  getProducts,
  deleteProduct,
  createProduct,
  updateProduct,
} from "@/services/product";

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
  });

  // ======================
  // MODAL STATES
  // ======================
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [successModal, setSuccessModal] = useState("");

  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const fetchData = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ======================
  // CREATE (UNCHANGED)
  // ======================
  const handleCreate = async () => {
    try {
      await createProduct({
        ...form,
        price: Number(form.price),
      });

      setForm({
        name: "",
        price: "",
        category: "",
        description: "",
      });

      setSuccessModal("Product Created Successfully 🎉");
      fetchData();

      setTimeout(() => setSuccessModal(""), 1500);
    } catch (err: any) {
      console.error("Create product failed", err);
      setSuccessModal(
        err?.response?.data?.message || "Failed to create product"
      );

      setTimeout(() => setSuccessModal(""), 1500);
    }
  };

  // ======================
  // OPEN EDIT
  // ======================
  const openEdit = (product: any) => {
    setSelectedProduct(product);
    setEditModal(true);
  };

  const handleUpdate = async () => {
    if (!selectedProduct) return;

    await updateProduct(selectedProduct._id, {
      name: selectedProduct.name,
      price: Number(selectedProduct.price),
      category: selectedProduct.category,
      description: selectedProduct.description,
    });

    setEditModal(false);
    setSuccessModal("Product Updated Successfully ✨");
    fetchData();

    setTimeout(() => setSuccessModal(""), 1500);
  };

  // ======================
  // DELETE FLOW
  // ======================
  const openDelete = (product: any) => {
    setSelectedProduct(product);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedProduct) return;

    await deleteProduct(selectedProduct._id);

    setDeleteModal(false);
    setSuccessModal("Product Deleted Successfully 🗑️");
    fetchData();

    setTimeout(() => setSuccessModal(""), 1500);
  };

  return (
    <div className="space-y-8">

      <h1 className="text-2xl font-bold">
        Product Management
      </h1>

      {/* ======================
          CREATE (UNCHANGED UI)
      ====================== */}
      <div className="bg-white border rounded-xl p-4 space-y-2">
        <h2 className="font-semibold">Create Product</h2>

        <input
          className="border p-2 w-full"
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          className="border p-2 w-full"
          placeholder="Price"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
        />

        <input
          className="border p-2 w-full"
          placeholder="Category"
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
        />

        <input
          className="border p-2 w-full"
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <button
          onClick={handleCreate}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Create
        </button>
      </div>

      {/* ======================
          TABLE (UPGRADED UX)
      ====================== */}
      <div className="bg-white border rounded-xl overflow-hidden">

        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-t hover:bg-gray-50 transition">

                <td className="p-3 font-medium">
                  {p.name}
                </td>

                <td className="p-3 text-gray-500">
                  {p.category}
                </td>

                <td className="p-3">
                  Rp {p.price?.toLocaleString("id-ID")}
                </td>

                <td className="p-3 text-right space-x-2">

                  <button
                    onClick={() => openEdit(p)}
                    className="text-blue-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => openDelete(p)}
                    className="text-red-500"
                  >
                    Delete
                  </button>

                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* ======================
          EDIT MODAL
      ====================== */}
      {editModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-[420px] p-6 rounded-xl space-y-3">

            <h2 className="font-semibold">Edit Product</h2>

            <input
              className="border p-2 w-full"
              value={selectedProduct.name}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  name: e.target.value,
                })
              }
            />

            <input
              className="border p-2 w-full"
              value={selectedProduct.price}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  price: e.target.value,
                })
              }
            />

            <input
              className="border p-2 w-full"
              value={selectedProduct.category}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  category: e.target.value,
                })
              }
            />

            <input
              className="border p-2 w-full"
              value={selectedProduct.description}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  description: e.target.value,
                })
              }
            />

            <div className="flex gap-2">
              <button
                onClick={() => setEditModal(false)}
                className="w-1/2 border py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="w-1/2 bg-blue-600 text-white py-2 rounded"
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================
          DELETE CONFIRM MODAL
      ====================== */}
      {deleteModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-[380px] p-6 rounded-xl text-center space-y-4">

            <h2 className="font-semibold text-lg">
              Delete Product?
            </h2>

            <p className="text-sm text-gray-500">
              {selectedProduct.name} will be permanently removed.
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setDeleteModal(false)}
                className="w-1/2 border py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="w-1/2 bg-red-600 text-white py-2 rounded"
              >
                Delete
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================
          SUCCESS MODAL
      ====================== */}
      {successModal && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-white shadow-xl px-6 py-4 rounded-xl animate-pulse">
            <p className="text-green-600 font-semibold">
              {successModal}
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
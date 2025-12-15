import React, { useEffect, useState } from "react";
import { getInventory } from "../services/labAssistantService";
import { Plus, Edit, Trash2, AlertTriangle } from "../lib/lucide-react";

type InventoryItem = {
  id: number;
  itemName: string;
  category: string;
  quantity: number;
  minimumStock: number;
  status: string;
};

const InventoryPage: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState<InventoryItem>({
    id: 0,
    itemName: "",
    category: "",
    quantity: 0,
    minimumStock: 0,
    status: "Available",
  });

  // Fetch Items
  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    const data = await getInventory();
    setItems(data as any);
  };

  // Add / Update Item
    // Local fallback for creating an item if the service doesn't export addItem
      // Local fallback for creating an item if the service doesn't export addItem
      const addItemLocal = async (item: InventoryItem) => {
      try {
        // Attempt to dynamically import and call addItem if the service actually exports it
        const svc = await import("../services/labAssistantService");
        // @ts-ignore - runtime check for optional export
        if (svc && typeof svc.addItem === "function") {
          // @ts-ignore
          return svc.addItem(item);
        }
      } catch {
        // ignore dynamic import errors and fall through to fetch fallback
      }
  
      // Fallback: POST to the presumed API endpoint (adjust endpoint if needed)
      await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
    };
  
    // Local fallback for updating an item if the service doesn't export updateItem
    const updateItemLocal = async (item: InventoryItem) => {
      try {
        const svc = await import("../services/labAssistantService");
        // @ts-ignore - runtime check for optional export
        if (svc && typeof svc.updateItem === "function") {
          // @ts-ignore
          return svc.updateItem(item);
        }
      } catch {
        // ignore dynamic import errors and fall through to fetch fallback
      }

      // Fallback: PUT to the presumed API endpoint (adjust endpoint if needed)
      await fetch(`/api/inventory/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
    };
  
      const handleSubmit = async () => {
      if (newItem.id === 0) {
        await addItemLocal(newItem);
      } else {
        await updateItemLocal(newItem);
      }
      setShowModal(false);
      loadInventory();
    };

  // Delete Item
  const handleDelete = async (id: number) => {
    // Try to use exported deleteItem from the service if it exists, otherwise fallback to DELETE fetch
    try {
      const svc = await import("../services/labAssistantService");
      // @ts-ignore - runtime check for optional export
      if (svc && typeof svc.deleteItem === "function") {
        // @ts-ignore
        await svc.deleteItem(id);
      } else {
        await fetch(`/api/inventory/${id}`, { method: "DELETE" });
      }
    } catch {
      // fallback HTTP DELETE
      await fetch(`/api/inventory/${id}`, { method: "DELETE" });
    }
    loadInventory();
  };

  const openModal = (item?: InventoryItem) => {
    if (item) setNewItem(item as InventoryItem);
    else
      setNewItem({
        id: 0,
        itemName: "",
        category: "",
        quantity: 0,
        minimumStock: 0,
        status: "Available",
      });

    setShowModal(true);
  };

  return (
    <div>
      {/* Page Title */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-blue-700">Inventory Management</h2>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-md text-white hover:bg-blue-700"
        >
          <Plus size={18} /> Add Item
        </button>
      </div>

      {/* Inventory Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3">Item Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">Min. Stock</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const lowStock = item.quantity < item.minimumStock;

              return (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{item.itemName}</td>
                  <td className="p-3">{item.category}</td>
                  <td className="p-3">{item.quantity}</td>
                  <td className="p-3">{item.minimumStock}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded text-sm ${
                        lowStock
                          ? "bg-red-100 text-red-700"
                          : item.status === "Available"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {lowStock ? "Low Stock" : item.status}
                    </span>
                  </td>
                  <td className="p-3 text-center flex justify-center gap-3">
                    <button
                      onClick={() => openModal(item)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}

            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center p-6 text-gray-500">
                  No items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-xl font-semibold mb-4">
              {newItem.id === 0 ? "Add New Item" : "Edit Item"}
            </h3>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Item Name"
                className="w-full border p-2 rounded"
                value={newItem.itemName}
                onChange={(e) =>
                  setNewItem({ ...newItem, itemName: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Category"
                className="w-full border p-2 rounded"
                value={newItem.category}
                onChange={(e) =>
                  setNewItem({ ...newItem, category: e.target.value })
                }
              />

              <input
                type="number"
                placeholder="Quantity"
                className="w-full border p-2 rounded"
                value={newItem.quantity}
                onChange={(e) =>
                  setNewItem({ ...newItem, quantity: Number(e.target.value) })
                }
              />

              <input
                type="number"
                placeholder="Minimum Stock"
                className="w-full border p-2 rounded"
                value={newItem.minimumStock}
                onChange={(e) =>
                  setNewItem({ ...newItem, minimumStock: Number(e.target.value) })
                }
              />

              <select
                className="w-full border p-2 rounded"
                value={newItem.status}
                onChange={(e) =>
                  setNewItem({ ...newItem, status: e.target.value })
                }
              >
                <option>Available</option>
                <option>Damaged</option>
                <option>Maintenance</option>
              </select>

              <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;

import React, { useEffect, useState } from "react";
import { getInventory } from "../../services/labAssistantService";
import { Plus, Edit, Trash2, AlertTriangle } from "lucide-react";

const InventoryPage = () => {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState({
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
    setItems(data);
  };

  // Add / Update Item
  const addItemLocal = async (item) => {
    try {
      const svc = await import("../../services/labAssistantService");
      if (svc && typeof svc.addItem === "function") {
        return svc.addItem(item);
      }
    } catch {
      // ignore
    }

    await fetch("http://localhost:5000/api/labassistant/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
  };

  const updateItemLocal = async (item) => {
    try {
      const svc = await import("../../services/labAssistantService");
      if (svc && typeof svc.updateItem === "function") {
        return svc.updateItem(item);
      }
    } catch {
      // ignore
    }

    await fetch(`http://localhost:5000/api/labassistant/inventory/${item.id}`, {
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
  const handleDelete = async (id) => {
    try {
      const svc = await import("../../services/labAssistantService");
      if (svc && typeof svc.deleteItem === "function") {
        await svc.deleteItem(id);
      } else {
         await fetch(`http://localhost:5000/api/labassistant/inventory/${id}`, {
          method: "DELETE",
        });
      }
    } catch {
       await fetch(`http://localhost:5000/api/labassistant/inventory/${id}`, {
          method: "DELETE",
        });
    }
    loadInventory();
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Inventory Management</h2>
        <button
          onClick={() => {
            setNewItem({
              id: 0,
              itemName: "",
              category: "",
              quantity: 0,
              minimumStock: 0,
              status: "Available",
            });
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} /> Add Item
        </button>
      </div>

      {/* Inventory Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-3 border-b">Item Name</th>
              <th className="p-3 border-b">Category</th>
              <th className="p-3 border-b">Quantity</th>
              <th className="p-3 border-b">Status</th>
              <th className="p-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="p-3 border-b">{item.itemName}</td>
                <td className="p-3 border-b">{item.category}</td>
                <td className="p-3 border-b flex items-center gap-2">
                  {item.quantity}
                  {item.quantity < item.minimumStock && (
                    <AlertTriangle size={16} className="text-red-500" />
                  )}
                </td>
                <td className="p-3 border-b">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      item.quantity > 0
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.quantity > 0 ? "Available" : "Out of Stock"}
                  </span>
                </td>
                <td className="p-3 border-b flex gap-3">
                  <button
                    onClick={() => {
                      setNewItem(item);
                      setShowModal(true);
                    }}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h3 className="text-xl font-bold mb-4">
              {newItem.id === 0 ? "Add New Item" : "Edit Item"}
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Item Name"
                className="w-full p-2 border rounded"
                value={newItem.itemName}
                onChange={(e) =>
                  setNewItem({ ...newItem, itemName: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Category"
                className="w-full p-2 border rounded"
                value={newItem.category}
                onChange={(e) =>
                  setNewItem({ ...newItem, category: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Quantity"
                className="w-full p-2 border rounded"
                value={newItem.quantity}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    quantity: parseInt(e.target.value) || 0,
                  })
                }
              />
              <input
                type="number"
                placeholder="Minimum Stock"
                className="w-full p-2 border rounded"
                value={newItem.minimumStock}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    minimumStock: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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

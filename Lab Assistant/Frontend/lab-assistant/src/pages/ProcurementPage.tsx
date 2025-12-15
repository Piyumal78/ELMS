import React, { useEffect, useState } from "react";
import {
  getProcurements,
  createProcurement,
} from "../services/labAssistantService";

import { Plus, Tag, Layers } from "../lib/lucide-react";

interface Procurement {
  id: number;
  itemName: string;
  quantityNeeded: number;
  status: string; // Pending, Approved, Delivered
}

const ProcurementPage: React.FC = () => {
  const [procurements, setProcurements] = useState<Procurement[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newRequest, setNewRequest] = useState({
    itemName: "",
    quantityNeeded: 1,
  });

  // Load procurement requests
  useEffect(() => {
    loadProcurements();
  }, []);

  const loadProcurements = async () => {
    const data = await getProcurements();
    setProcurements(data);
  };

  const handleSubmit = async () => {
    if (!newRequest.itemName.trim()) return;

    await createProcurement(newRequest);
    setShowModal(false);

    setNewRequest({
      itemName: "",
      quantityNeeded: 1,
    });

    loadProcurements();
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Approved":
        return "bg-blue-100 text-blue-700";
      case "Delivered":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-blue-700">Procurement Requests</h2>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-md text-white hover:bg-blue-700"
        >
          <Plus size={18} /> Create Request
        </button>
      </div>

      {/* Procurement Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3">Item Name</th>
              <th className="p-3">Quantity Needed</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {procurements.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="p-3 flex items-center gap-2">
                  <Tag size={16} className="text-gray-600" />
                  {p.itemName}
                </td>

                <td className="p-3 flex items-center gap-2">
                  <Layers size={16} className="text-gray-600" />
                  {p.quantityNeeded}
                </td>

                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded text-sm ${statusBadge(
                      p.status
                    )}`}
                  >
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}

            {procurements.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="p-6 text-center text-gray-500 text-lg"
                >
                  No procurement requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Request Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-xl font-semibold mb-4">Create Procurement Request</h3>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Item Name"
                className="w-full border p-2 rounded"
                value={newRequest.itemName}
                onChange={(e) =>
                  setNewRequest({ ...newRequest, itemName: e.target.value })
                }
              />

              <input
                type="number"
                placeholder="Quantity Needed"
                className="w-full border p-2 rounded"
                value={newRequest.quantityNeeded}
                onChange={(e) =>
                  setNewRequest({
                    ...newRequest,
                    quantityNeeded: Number(e.target.value),
                  })
                }
              />

              <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Submit Request
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-gray-300 text-gray-800 py-2 rounded mt-2 hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcurementPage;

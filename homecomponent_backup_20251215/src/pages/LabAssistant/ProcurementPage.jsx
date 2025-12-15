import React, { useEffect, useState } from "react";
import {
  getProcurements,
  createProcurement,
} from "../../services/labAssistantService";

import { Plus, Tag, Layers } from "lucide-react";

const ProcurementPage = () => {
  const [procurements, setProcurements] = useState([]);
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

  const statusBadge = (status) => {
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
                    className={`px-2 py-1 rounded text-xs font-semibold ${statusBadge(
                      p.status
                    )}`}
                  >
                    {p.status}
                  </span>
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
            <h3 className="text-xl font-bold mb-4">New Procurement Request</h3>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Item Name"
                className="w-full p-2 border rounded"
                value={newRequest.itemName}
                onChange={(e) =>
                  setNewRequest({ ...newRequest, itemName: e.target.value })
                }
              />

              <input
                type="number"
                min="1"
                placeholder="Quantity Needed"
                className="w-full p-2 border rounded"
                value={newRequest.quantityNeeded}
                onChange={(e) =>
                  setNewRequest({
                    ...newRequest,
                    quantityNeeded: parseInt(e.target.value) || 1,
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
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcurementPage;

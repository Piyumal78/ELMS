import React, { useEffect, useState } from "react";
import {
  getRequests,
  approveRequest,
  rejectRequest,
  markIssued,
  markReturned,
} from "../services/labAssistantService";

import {
  CheckCircle,
  XCircle,
  ArrowRightCircle,
  RotateCcw,
} from "../lib/lucide-react";

interface RequestItem {
  id: number;
  requestedBy: string;
  itemName: string;
  quantity: number;
  dateRequested: string;
  status: string; // Pending, Approved, Issued, Returned, Rejected
}

const RequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<RequestItem[]>([]);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    const data = await getRequests();
    setRequests(data);
  };

  const handleApprove = async (id: number) => {
    await approveRequest(id);
    loadRequests();
  };

  const handleReject = async (id: number) => {
    await rejectRequest(id);
    loadRequests();
  };

  const handleIssued = async (id: number) => {
    await markIssued(id);
    loadRequests();
  };

  const handleReturned = async (id: number) => {
    await markReturned(id);
    loadRequests();
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Approved":
        return "bg-blue-100 text-blue-700";
      case "Issued":
        return "bg-purple-100 text-purple-700";
      case "Returned":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-blue-700 mb-6">
        Resource Requests
      </h2>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3">Requested By</th>
              <th className="p-3">Item</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {requests.map((req) => (
              <tr key={req.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{req.requestedBy}</td>
                <td className="p-3">{req.itemName}</td>
                <td className="p-3">{req.quantity}</td>
                <td className="p-3">
                  {new Date(req.dateRequested).toLocaleDateString()}
                </td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded text-sm ${statusBadge(
                      req.status
                    )}`}
                  >
                    {req.status}
                  </span>
                </td>

                <td className="p-3 text-center flex justify-center gap-2">
                  {/* Approve */}
                  {req.status === "Pending" && (
                    <button
                      onClick={() => handleApprove(req.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <CheckCircle size={20} />
                    </button>
                  )}

                  {/* Reject */}
                  {req.status === "Pending" && (
                    <button
                      onClick={() => handleReject(req.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <XCircle size={20} />
                    </button>
                  )}

                  {/* Mark Issued */}
                  {req.status === "Approved" && (
                    <button
                      onClick={() => handleIssued(req.id)}
                      className="text-purple-600 hover:text-purple-800"
                    >
                      <ArrowRightCircle size={20} />
                    </button>
                  )}

                  {/* Mark Returned */}
                  {req.status === "Issued" && (
                    <button
                      onClick={() => handleReturned(req.id)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <RotateCcw size={20} />
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {requests.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="p-6 text-center text-gray-500 text-lg"
                >
                  No requests available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RequestsPage;

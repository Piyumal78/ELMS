import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navbar/navbar.jsx'
import { LabReservationService } from '../../services/api'

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch reservations on mount and tab change
  useEffect(() => {
    fetchReservations();
  }, [activeTab]);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError('');
      let data;
      if (activeTab === 'pending') {
        data = await LabReservationService.getPending();
      } else {
        data = await LabReservationService.getApproved();
      }
      setReservations(data || []);
    } catch (err) {
      console.error('Error fetching reservations:', err);
      setReservations([]);
      setError('Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reservationId) => {
    try {
      await LabReservationService.approve(reservationId);
      setSuccessMessage('Reservation approved successfully!');
      setReservations(reservations.filter(r => r.reservationId !== reservationId));
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to approve reservation');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleReject = async (reservationId) => {
    if (window.confirm('Are you sure you want to reject this reservation?')) {
      try {
        await LabReservationService.reject(reservationId);
        setSuccessMessage('Reservation rejected');
        setReservations(reservations.filter(r => r.reservationId !== reservationId));
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        setError(err.message || 'Failed to reject reservation');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString.substring(0, 5);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-50 text-amber-600 border border-amber-200';
      case 'APPROVED':
        return 'bg-green-50 text-green-600 border border-green-200';
      case 'REJECTED':
        return 'bg-red-50 text-red-600 border border-red-200';
      case 'COMPLETED':
        return 'bg-blue-50 text-blue-600 border border-blue-200';
      default:
        return 'bg-gray-50 text-gray-600 border border-gray-200';
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
          <Sidebar />
        </div>
        
        <div className="flex-1 overflow-y-auto p-8">
          {/* Page Header */}
          <div className="mb-8">
            <p className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-1">Lab Management</p>
            <h1 className="text-2xl font-semibold text-gray-900">Lab Reservations</h1>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'pending'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Pending Approval
            </button>
            <button
              onClick={() => setActiveTab('approved')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'approved'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Approved
            </button>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              {successMessage}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
                  <div className="flex justify-between">
                    <div className="flex-1">
                      <div className="h-5 bg-gray-100 rounded w-1/4 mb-3"></div>
                      <div className="h-4 bg-gray-50 rounded w-1/3 mb-2"></div>
                      <div className="h-4 bg-gray-50 rounded w-1/2"></div>
                    </div>
                    <div className="h-8 bg-gray-100 rounded w-24"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reservations List */}
          {!loading && (
            <div className="space-y-4">
              {reservations.map((reservation) => (
                <div 
                  key={reservation.reservationId} 
                  className="bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        {/* Lab Info */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{reservation.labName || 'Lab Reservation'}</h3>
                            <p className="text-sm text-gray-500">Reservation #{reservation.reservationId}</p>
                          </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Date</p>
                            <p className="text-sm font-medium text-gray-900 mt-1">{formatDate(reservation.date)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Time</p>
                            <p className="text-sm font-medium text-gray-900 mt-1">
                              {formatTime(reservation.startTime)} - {formatTime(reservation.endTime)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Requested By</p>
                            <p className="text-sm font-medium text-gray-900 mt-1">
                              {reservation.demonstrator?.name || reservation.requestedBy || 'Unknown'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Purpose</p>
                            <p className="text-sm font-medium text-gray-900 mt-1">{reservation.purpose || 'Lab Session'}</p>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="mt-4">
                          <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-medium ${getStatusBadge(reservation.reservationStatus)}`}>
                            {reservation.reservationStatus}
                          </span>
                        </div>
                      </div>

                      {/* Actions for Pending */}
                      {activeTab === 'pending' && (
                        <div className="flex flex-col gap-2 ml-6">
                          <button
                            onClick={() => handleApprove(reservation.reservationId)}
                            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(reservation.reservationId)}
                            className="px-4 py-2 text-red-600 border border-red-200 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Empty State */}
              {reservations.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {activeTab === 'pending' ? 'No Pending Reservations' : 'No Approved Reservations'}
                  </h3>
                  <p className="text-gray-500 mt-1">
                    {activeTab === 'pending' 
                      ? 'All lab reservation requests have been processed' 
                      : 'No reservations have been approved yet'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Reservations

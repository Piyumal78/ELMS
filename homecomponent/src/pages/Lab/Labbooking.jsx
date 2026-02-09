import React from 'react';
import { useSelector } from 'react-redux';
import { useGetCurrentUserProfileQuery, useCreateLabReservationMutation, useGetLabReservationsByStudentIdQuery, useDeleteLabReservationMutation } from "@/services/api";
import StudentNavbar from '../Student/StudentNavbar';
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Toaster } from "sonner"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Link } from 'react-router-dom';

// Zod validation schema
const bookingSchema = z.object({
    reservationDate: z.string().min(1, "Reservation date is required"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    purpose: z.string().max(100, "Purpose must be at most 100 characters").optional(),
}).refine((data) => {
    // End time must be after start time
    if (data.startTime && data.endTime) {
        const [startHour, startMin] = data.startTime.split(':').map(Number);
        const [endHour, endMin] = data.endTime.split(':').map(Number);
        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;
        return endMinutes > startMinutes;
    }
    return true;
}, {
    message: "End time must be after start time",
    path: ["endTime"]
});

const LabBooking = () => {
    const user = useSelector((state) => state.auth?.user);
    const { data: profile, isLoading, error } = useGetCurrentUserProfileQuery(
        user?.registrationNumber || user?.username,
        { skip: !user?.registrationNumber && !user?.username }
    );

    const [createLabReservation, { isLoading: isBooking }] = useCreateLabReservationMutation();
    const [deleteLabReservation, { isLoading: isDeleting }] = useDeleteLabReservationMutation();
    const { data: labReservations, isLoading: isLoadingReservations, error: reservationsError, refetch } = useGetLabReservationsByStudentIdQuery(profile?.userId, {
        skip: !profile?.userId,
    });

    // Function to get status badge variant and styling
    const getStatusBadge = (status) => {
        const statusConfig = {
            'PENDING': { variant: 'secondary', className: 'bg-yellow-500 text-white hover:bg-yellow-600', label: 'Pending' },
            'APPROVED': { variant: 'default', className: 'bg-green-500 text-white hover:bg-green-600', label: 'Approved' },
            'COMPLETED': { variant: 'default', className: 'bg-blue-500 text-white hover:bg-blue-600', label: 'Completed' },
            'CANCELLED': { variant: 'destructive', className: 'bg-red-500 text-white hover:bg-red-600', label: 'Cancelled' },
            'REJECTED': { variant: 'destructive', className: 'bg-gray-500 text-white hover:bg-gray-600', label: 'Rejected' },
        };

        return statusConfig[status] || { variant: 'outline', className: 'bg-gray-200 text-gray-800', label: status };
    };

    const form = useForm({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            reservationDate: '',
            startTime: '',
            endTime: '',
            purpose: ''
        }
    });

    const onSubmit = async (data) => {
        try {
            const reservationData = {
                reservationDate: data.reservationDate,
                startTime: data.startTime,
                endTime: data.endTime,
                purpose: data.purpose || 'Lab Session',
                studentId: profile?.userId
            };

            console.log('Sending to backend:', reservationData);

            const result = await createLabReservation(reservationData).unwrap();

            console.log('Booking successful:', result);
            toast.success('Lab booking successful! ✅');
            form.reset();

        } catch (error) {
            console.error('Booking failed:', error);
            toast.error(`Error: ${error?.data?.message || 'Booking failed'}`);
        }
    };

    const handleCancellation = async (reservationId) => {
        try {
            await deleteLabReservation(reservationId).unwrap();
            toast.success('Reservation cancelled successfully! 🗑️');
            refetch(); // Refresh the list
        } catch (error) {
            console.error('Cancellation failed:', error);
            toast.error(`Error: ${error?.data?.message || 'Cancellation failed'}`);
        }
    };

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center">
            <StudentNavbar />
            <div className="text-red-500">Error loading profile: {error.toString()}</div>
        </div>
    );

    if (isLoadingReservations) return (
        <div className="min-h-screen flex items-center justify-center">
            <StudentNavbar />
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading reservations...</p>
            </div>
        </div>
    );
    if (reservationsError) return (
        <div className="min-h-screen bg-gray-50">
            <StudentNavbar />
            <div className="max-w-4xl mx-auto px-4 py-16">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-12 text-center border border-blue-100">
                    <div className="max-w-md mx-auto">
                        <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-md">
                            <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">No Reservations Yet</h3>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            You haven't made any lab reservations yet. Start by booking your first lab session using the form above.
                        </p>
                        <div className="bg-white rounded-lg p-4 border border-blue-200 mb-6">
                            <p className="text-sm text-gray-700">
                                <span className="font-semibold text-blue-600">💡 Quick Tip:</span> Book your lab session at least 24 hours in advance 
                                to ensure availability. Sessions are approved by lab administrators.
                            </p>
                        </div>
                        <Button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md transition-colors"
                        >
                            <Link to="/dashboard" >
                            Book Lab Session
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );

    console.log('Lab Reservations:', labReservations);
    console.log('Reservation ids', labReservations?.map(r => r.reservationId));
    return (
        <div className="min-h-screen bg-gray-50">
            <StudentNavbar />

            <div className="  px-4 py-8  grid grid-cols-2 gap-6">
                <div className='max-w-4xl'>
                    <Card className="shadow-lg ">
                        <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-900 text-white">
                            <CardTitle className="text-2xl">🔬 Lab Booking System</CardTitle>
                            <CardDescription className="text-white">
                                Schedule your lab session by filling out the form below
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="pt-6">
                            {/* User Info Section */}
                            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Student ID</p>
                                        <p className="font-semibold text-blue-700">{profile?.userId}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Name</p>
                                        <p className="font-semibold text-blue-700">{profile?.name}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Booking Form */}
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                {/* Reservation Date */}
                                <div className="space-y-2">
                                    <Label htmlFor="reservationDate" className="text-base font-medium">
                                        Reservation Date *
                                    </Label>
                                    <Input
                                        type="date"
                                        id="reservationDate"
                                        {...form.register('reservationDate')}
                                        className={`w-full ${form.formState.errors.reservationDate ? 'border-red-500' : ''}`}
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                    {form.formState.errors.reservationDate && (
                                        <p className="text-sm text-red-500 flex items-center gap-1">
                                            <span>⚠️</span>
                                            {form.formState.errors.reservationDate.message}
                                        </p>
                                    )}
                                </div>

                                {/* Time Section - Grid Layout */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    {/* Start Time */}
                                    <div className="space-y-2">
                                        <Label htmlFor="startTime" className="text-base font-medium">
                                            Start Time *
                                        </Label>
                                        <Input
                                            type="time"
                                            id="startTime"
                                            {...form.register('startTime')}
                                            className={`w-full ${form.formState.errors.startTime ? 'border-red-500' : ''}`}
                                        />
                                        {form.formState.errors.startTime && (
                                            <p className="text-sm text-red-500 flex items-center gap-1">
                                                <span>⚠️</span>
                                                {form.formState.errors.startTime.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* End Time */}
                                    <div className="space-y-2">
                                        <Label htmlFor="endTime" className="text-base font-medium">
                                            End Time *
                                        </Label>
                                        <Input
                                            type="time"
                                            id="endTime"
                                            {...form.register('endTime')}
                                            className={`w-full ${form.formState.errors.endTime ? 'border-red-500' : ''}`}
                                        />
                                        {form.formState.errors.endTime && (
                                            <p className="text-sm text-red-500 flex items-center gap-1">
                                                <span>⚠️</span>
                                                {form.formState.errors.endTime.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Purpose */}
                                <div className="space-y-2">
                                    <Label htmlFor="purpose" className="text-base font-medium">
                                        Purpose <span className="text-gray-500 text-sm">(Optional)</span>
                                    </Label>
                                    <Input
                                        id="purpose"
                                        placeholder="e.g., Microcontroller programming practice"
                                        {...form.register('purpose')}
                                        className={`w-full ${form.formState.errors.purpose ? 'border-red-500' : ''}`}
                                    />
                                    {form.formState.errors.purpose && (
                                        <p className="text-sm text-red-500 flex items-center gap-1">
                                            <span>⚠️</span>
                                            {form.formState.errors.purpose.message}
                                        </p>
                                    )}
                                    <p className="text-xs text-gray-500">
                                        Maximum 100 characters
                                    </p>
                                </div>

                                {/* Submit Button */}
                                <div className="pt-4">
                                    <Button
                                        type="submit"
                                        disabled={isBooking}
                                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-6 text-lg"
                                    >
                                        {isBooking ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                                                Booking...
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center gap-2">
                                                <span>✅</span>
                                                Confirm Booking
                                            </span>
                                        )}
                                    </Button>
                                </div>

                                {/* Help Text */}
                                <div className="text-center text-sm text-gray-500 pt-2">
                                    <p>* Required fields</p>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card className="mt-6 shadow-md bg-slate-900 text-white">
                        <CardContent className="pt-6 bg-slate-900 rounded-xl">
                            <h3 className="font-semibold text-gray-100 mb-3">📋 Booking Guidelines</h3>
                            <ul className="space-y-2 text-sm text-gray-100">
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600 mt-0.5">•</span>
                                    <span>Bookings must be made at least 24 hours in advance</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600 mt-0.5">•</span>
                                    <span>Maximum booking duration is 3 hours</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600 mt-0.5">•</span>
                                    <span>Lab sessions are available from 8:00 AM to 6:00 PM</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600 mt-0.5">•</span>
                                    <span>Cancel at least 2 hours before your session starts</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                    <div className='mt-6'>
                        <Table className="">
                            <TableCaption style={{ color: "black", fontSize: "1.2rem", marginBottom: "1rem", fontWeight: "bold" }}>All Reservations</TableCaption>
                            <TableHeader>
                                <TableRow >
                                    <TableHead className="w-[100px]">Reservation ID</TableHead>
                                    <TableHead>Reservation Date</TableHead>
                                    <TableHead>Start Time</TableHead>
                                    <TableHead >End Time</TableHead>
                                    <TableHead>Purpose</TableHead>
                                    <TableHead >Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {labReservations?.map((reservation) => (
                                    <TableRow key={reservation.reservationId}>
                                        <TableCell className="font-medium">{reservation.reservationId}</TableCell>
                                        <TableCell>{reservation.reservationDate}</TableCell>
                                        <TableCell>{reservation.startTime}</TableCell>
                                        <TableCell >{reservation.endTime}</TableCell>
                                        <TableCell>{reservation.purpose}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={getStatusBadge(reservation.reservationStatus).variant}
                                                className={getStatusBadge(reservation.reservationStatus).className}
                                            >
                                                {getStatusBadge(reservation.reservationStatus).label}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="link"
                                                className="text-white hover:underline bg-red-600 hover:bg-red-700"
                                                onClick={() => handleCancellation(reservation.reservationId)}
                                                disabled={isDeleting || reservation.reservationStatus === 'CANCELLED'}
                                            >
                                                {isDeleting ? 'Cancelling...' : 'Cancellation'}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
                {/* Additional Info Card */}
            </div>

            {/* Toast Notifications */}
            <Toaster position="top-center" richColors />
        </div>
    );
};

export default LabBooking;
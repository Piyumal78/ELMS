import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

/**
 * දෙකක් පිහිටුවන්න උදව් කිරීම සඳහා මෙම component එක use කරන්න:
 * 1. Login status බලන්න
 * 2. Token තියෙනවද බලන්න
 * 3. Token expire වෙලා නැද්ද බලන්න
 * 
 * Usage: Layout.jsx එකේ හෝ Lab submission page එකේ මේක import කරන්න
 */
export default function AuthDebugger() {
    const [debugInfo, setDebugInfo] = useState({});
    const token = useSelector(state => state.auth?.token);
    const user = useSelector(state => state.auth?.user);

    useEffect(() => {
        const localToken = localStorage.getItem('token');
        const localUser = localStorage.getItem('user');

        let decodedToken = null;
        let isExpired = false;
        let roles = [];

        if (localToken) {
            try {
                const parts = localToken.split('.');
                if (parts.length === 3) {
                    decodedToken = JSON.parse(atob(parts[1]));
                    const expiryDate = new Date(decodedToken.exp * 1000);
                    isExpired = new Date() > expiryDate;
                    roles = decodedToken.roles || decodedToken.authorities || [];
                }
            } catch (error) {
                console.error('Token decode error:', error);
            }
        }

        setDebugInfo({
            hasReduxToken: !!token,
            hasLocalStorageToken: !!localToken,
            hasUser: !!user || !!localUser,
            tokenExpired: isExpired,
            roles: roles,
            decodedToken: decodedToken,
            tokenMatch: token === localToken,
        });

        console.log('🔍 Auth Debug Info:', {
            'Redux Token': token ? 'EXISTS' : 'MISSING',
            'LocalStorage Token': localToken ? 'EXISTS' : 'MISSING',
            'User': user || localUser || 'MISSING',
            'Token Expired': isExpired,
            'Roles': roles,
            'Token Expiry': decodedToken ? new Date(decodedToken.exp * 1000).toLocaleString() : 'N/A',
        });
    }, [token, user]);

    // Dev mode එකේ විතරක් show වෙන එකක්
    if (process.env.NODE_ENV !== 'development') return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 bg-gray-900 text-white p-4 rounded-lg shadow-lg max-w-sm text-xs">
            <div className="font-bold mb-2 border-b border-gray-700 pb-2">🔐 Auth Status</div>
            
            <div className="space-y-1">
                <div className="flex justify-between">
                    <span>Redux Token:</span>
                    <span className={debugInfo.hasReduxToken ? 'text-green-400' : 'text-red-400'}>
                        {debugInfo.hasReduxToken ? '✅ Yes' : '❌ No'}
                    </span>
                </div>

                <div className="flex justify-between">
                    <span>LocalStorage:</span>
                    <span className={debugInfo.hasLocalStorageToken ? 'text-green-400' : 'text-red-400'}>
                        {debugInfo.hasLocalStorageToken ? '✅ Yes' : '❌ No'}
                    </span>
                </div>

                <div className="flex justify-between">
                    <span>Logged In:</span>
                    <span className={debugInfo.hasUser ? 'text-green-400' : 'text-red-400'}>
                        {debugInfo.hasUser ? '✅ Yes' : '❌ No'}
                    </span>
                </div>

                <div className="flex justify-between">
                    <span>Token Expired:</span>
                    <span className={debugInfo.tokenExpired ? 'text-red-400' : 'text-green-400'}>
                        {debugInfo.hasLocalStorageToken 
                            ? (debugInfo.tokenExpired ? '❌ Yes' : '✅ No')
                            : 'N/A'
                        }
                    </span>
                </div>

                {debugInfo.roles && debugInfo.roles.length > 0 && (
                    <div className="flex justify-between">
                        <span>Roles:</span>
                        <span className="text-blue-400">{debugInfo.roles.join(', ')}</span>
                    </div>
                )}

                {debugInfo.decodedToken && (
                    <div className="mt-2 pt-2 border-t border-gray-700 text-[10px]">
                        <div>Expires: {new Date(debugInfo.decodedToken.exp * 1000).toLocaleString()}</div>
                    </div>
                )}
            </div>

            {!debugInfo.hasLocalStorageToken && (
                <div className="mt-3 p-2 bg-red-900/50 rounded text-yellow-300 text-[10px]">
                    ⚠️ No token found! Please login first at /signin
                </div>
            )}

            {debugInfo.tokenExpired && (
                <div className="mt-3 p-2 bg-red-900/50 rounded text-yellow-300 text-[10px]">
                    ⚠️ Token expired! Please login again
                </div>
            )}
        </div>
    );
}

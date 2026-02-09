import React, { useState } from 'react';
import { useLoginMutation, useActivateAccountMutation } from '../services/api';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../lib/redux/store';

const LoginExample = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isActivating, setIsActivating] = useState(false);
  
  const dispatch = useDispatch();
  const [login, { isLoading: isLoggingIn, error: loginError }] = useLoginMutation();
  const [activateAccount, { isLoading: isActivatingAccount, error: activateError }] = useActivateAccountMutation();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await login({ username, password }).unwrap();
      // Store the token in Redux and localStorage
      dispatch(setCredentials({ token: result.token, user: { username } }));
      console.log('Login successful:', result);
      // You can navigate to dashboard here
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const handleActivate = async (e) => {
    e.preventDefault();
    try {
      const result = await activateAccount({ username, password }).unwrap();
      console.log('Account activated:', result);
      // Switch to login mode after activation
      setIsActivating(false);
    } catch (err) {
      console.error('Activation failed:', err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">
        {isActivating ? 'Activate Account' : 'Login'}
      </h2>
      
      <form onSubmit={isActivating ? handleActivate : handleLogin}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Registration Number
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="EC/2021/002"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="********"
            required
          />
        </div>

        {(loginError || activateError) && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {loginError?.data?.message || activateError?.data?.message || 'An error occurred'}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoggingIn || isActivatingAccount}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400"
        >
          {isLoggingIn || isActivatingAccount ? 'Processing...' : isActivating ? 'Activate Account' : 'Login'}
        </button>
      </form>

      <button
        onClick={() => setIsActivating(!isActivating)}
        className="mt-4 w-full text-blue-500 hover:text-blue-700 font-semibold"
      >
        {isActivating ? 'Already activated? Login' : 'Need to activate account?'}
      </button>
    </div>
  );
};

export default LoginExample;

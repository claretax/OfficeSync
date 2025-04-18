import React, { useState } from 'react';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Login form submitted:', formData);
    alert('Login successful!');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Log In</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-emerald-500"
            placeholder="Enter your email"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-emerald-500"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 text-white font-semibold py-2 rounded-md hover:bg-emerald-700 transition"
        >
          Log In
        </button>

        <div className="mt-4 text-center">
          <a href="#" className="text-sm text-emerald-600 hover:underline">Forgot your password?</a>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
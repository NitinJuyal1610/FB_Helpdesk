'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPending, setIsPending] = useState(false);

  const router = useRouter();

  const { status } = useSession();

  if (status === 'authenticated') {
    router.push('/');
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault(); // Prevent default form submission

    setIsPending(true);
    if (password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Set content type
      },
      body: JSON.stringify({
        name, // Include name
        email, // Include email
        password, // Include password
      }),
    });

    const message = (await response.json()).message;
    if (!response.ok) {
      // Handle errors gracefully
      console.error('Error registering user:', response.statusText);
      alert(`${message}. Please try again.`);
      return;
    }

    console.log('User registered successfully!');
    setIsPending(false);
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24 bg-[#1E4D91]">
      <div className="w-[30rem] bg-white rounded-xl">
        <div className="w-full flex flex-col gap-6 p-[4rem] pb-[2rem] items-center justify-between mt-3">
          <p className="text-xl text-black w-full text-center font-semibold">
            Create Account
          </p>

          <form
            className="w-full flex flex-col gap-4 text-black"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col">
              <label htmlFor="name">Name</label>
              <input
                className="border-2 border-[#E3E3E3] p-2 rounded-lg"
                type="text"
                id="name"
                placeholder="Name"
                name="name"
                value={name} // Set initial value
                onChange={(e) => setName(e.target.value)} // Update state on change
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                className="border-2 border-[#E3E3E3] p-2 rounded-lg"
                placeholder="richpanel@gmail.com"
                name="email"
                value={email} // Set initial value
                onChange={(e) => setEmail(e.target.value)} // Update state on change
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="border-2 border-[#E3E3E3] p-2 rounded-lg"
                placeholder="********"
                id="password"
                name="password"
                value={password} // Set initial value
                onChange={(e) => setPassword(e.target.value)} // Update state on change
              />
            </div>

            <div className="flex gap-2 p-1">
              <input type="checkbox" id="remember" name="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>

            <button
              type="submit"
              className="bg-[#204A96] p-3 rounded-lg text-white w-full self-center mt-2"
            >
              {isPending ? 'Loading...' : 'Sign Up'}
            </button>
          </form>

          <p className="text-black w-full text-center mt-5">
            Already have an account?{' '}
            <a className="text-[#204A96]" href="/login">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;

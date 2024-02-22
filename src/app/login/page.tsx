'use client';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPending, setIsPending] = useState(false);
  const { status } = useSession();

  if (status === 'authenticated') {
    router.push('/');
  }
  const handleSubmit = async (event: any) => {
    try {
      console.log(email, password);
      setIsPending(true);
      event.preventDefault(); // Prevent the default form submission
      const res = await signIn('username-login', {
        email,
        password,
        redirect: false,
      });

      setIsPending(false);
      console.log(res);
      if (res && res.error) {
        alert('Invalid Credentials');
        return;
      }
      // router.push('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24  bg-[#1E4D91]">
      <div className="w-[30rem] bg-white rounded-xl">
        <div className="w-full flex flex-col gap-6 p-[4rem] pb-[2rem]  items-center justify-between mt-3 ">
          <p className="text-xl text-black w-full text-center font-semibold ">
            Login to your Account
          </p>

          <form
            className="w-full flex flex-col gap-4 text-black"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                className="border-2 border-[#E3E3E3] p-2 rounded-lg"
                placeholder="richpanel@gmail.com"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex gap-2 p-1">
              <input type="checkbox" id="remember" name="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <button
              type="submit"
              className=" bg-[#204A96] p-3 rounded-lg text-white w-full self-center mt-2"
            >
              {isPending ? 'Loading...' : 'Login'}
            </button>
          </form>

          <p className="text-black w-full text-center mt-5">
            New to MyApp ?{' '}
            <a className="text-[#204A96]" href="/register">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;

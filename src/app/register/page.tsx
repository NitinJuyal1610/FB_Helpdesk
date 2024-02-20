import React from 'react';

function Register() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24  bg-[#1E4D91]">
      <div className="w-1/3 bg-white rounded-xl">
        <div className="w-full flex flex-col gap-6 p-[4rem] pb-[2rem]  items-center justify-between mt-3 ">
          <p className="text-xl text-black w-full text-center font-semibold ">
            Create Account
          </p>

          <form className="w-full flex flex-col gap-4 text-black">
            <div className="flex flex-col">
              <label htmlFor="name">Name</label>
              <input
                className="border-2 border-[#E3E3E3] p-2 rounded-lg"
                type="text"
                id="name"
                placeholder="Name"
                name="name"
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
              Sign Up
            </button>
          </form>

          <p className="text-black w-full text-center mt-5">
            {' '}
            Already have an account ?{' '}
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

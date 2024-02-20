'use client';
import { useState } from 'react';
export default function Home() {
  const [connected, setConnected] = useState(true);
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24  bg-[#1E4D91]">
      <div className="w-1/3 bg-white rounded-xl p-[4rem] flex flex-col gap-6">
        <p className="text-xl text-black text-center font-semibold">
          Facebook Page Integration
        </p>
        {connected ? (
          <div className="flex flex-col gap-2">
            <button
              type="submit"
              className=" bg-[#DF523F] p-3 rounded-lg text-white w-full self-center mt-2"
            >
              Delete Integration
            </button>

            <button
              type="submit"
              className=" bg-[#204A96] p-3 rounded-lg text-white w-full self-center mt-2"
            >
              Reply to Messages
            </button>
          </div>
        ) : (
          <div>
            <button
              type="submit"
              className=" bg-[#204A96] p-3 rounded-lg text-white w-full self-center mt-2"
            >
              Connect Page
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

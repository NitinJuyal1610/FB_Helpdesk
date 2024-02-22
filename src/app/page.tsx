'use client';
import Head from 'next/head';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import {
  fbLogin,
  getFacebookLoginStatus,
  initFacebookSdk,
} from '@/lib/facebookSdk';
export default function Home() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    (async () => {
      await initFacebookSdk();
      const response = await getFacebookLoginStatus();
      console.log(response);
      if (response.status === 'connected') {
        setConnected(true);
      }
    })();
  }, []);
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24  bg-[#1E4D91]">
      <Script
        src="https://connect.facebook.net/en_US/sdk.js"
        strategy="lazyOnload"
        onLoad={() =>
          console.log(`script loaded correctly, window.FB has been populated`)
        }
      />

      <div className="w-[30rem] bg-white rounded-xl p-[4rem] flex flex-col gap-6">
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
              <a href="/dashboard">Reply to Messages</a>
            </button>
          </div>
        ) : (
          <div>
            <button
              onClick={async () => {
                await fbLogin();
              }}
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

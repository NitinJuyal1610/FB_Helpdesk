'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import ConversationElement from '@/components/ConversationElement';
import Message from '@/components/Message';
import {
  getFacebookLoginStatus,
  getUserProfile,
  initFacebookSdk,
} from '@/lib/facebookSdk';
import Script from 'next/script';
import Pusher from 'pusher-js';

import { sendMessage } from '@/lib/facebookSdk';

function Dashboard() {
  const [activeSender, setActiveSender] = useState<any>(null);
  const [conversations, setConversations] = useState<any>([]);
  const [message, setMessage] = useState<any>(null);
  const [profiles, setProfiles] = useState<any>([]);

  useEffect(() => {
    (async () => {
      await initFacebookSdk();
      const res = await getFacebookLoginStatus();

      const conv = await fetch(
        `/api/conversation?access_token=${res.authResponse.accessToken}`,
      );
      const data = await conv.json();

      //profile info
      const profiles = await Promise.all(
        data.map(async (conversation: any) => {
          const val: any = await getUserProfile(
            conversation.senderId,
            conversation.pageId,
            res.authResponse.accessToken,
          );

          val['message'] =
            conversation.messages[conversation.messages.length - 1].message;

          return val;
        }),
      );

      setConversations(data);
      setProfiles(profiles);
    })();
  }, []);

  useEffect(() => {
    const pusher = new Pusher('67ba1292813492d9a757', {
      cluster: 'ap2',
    });

    const channel = pusher.subscribe('webhook');

    channel.bind('message', (data: any) => {
      // Handle incoming event data

      const newSender = {
        ...activeSender,
      };

      newSender['messages'].push(data);
      setActiveSender({ ...newSender });
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [activeSender]);
  const processConv = (profile: any) => {
    const conversation = conversations.find((conversation: any) => {
      return conversation.senderId === profile.id;
    });

    const activeSender: any = {
      id: profile.id,
      first_name: profile.first_name,
      last_name: profile.last_name,
      profile_pic: profile.profile_pic,
      pageId: conversation.pageId,
    };
    activeSender['messages'] = conversation.messages;
    setActiveSender(activeSender);
  };

  const handleMessage = async (message: any) => {
    const res = await getFacebookLoginStatus();

    await sendMessage(
      activeSender.id,
      activeSender.pageId,
      res.authResponse.accessToken,
      message,
    );

    const msg = {
      senderId: activeSender.pageId,
      recipientId: activeSender.id,
      message,
      timestamp: Date.now(),
      messageId: Date.now(),
    };

    const newSender = {
      ...activeSender,
    };

    newSender['messages'].push(msg);
    setActiveSender({ ...newSender });
    console.log('sent');
  };

  return (
    <div className="flex min-h-screen items-center justify-start bg-white ">
      <Script
        src="https://connect.facebook.net/en_US/sdk.js"
        strategy="lazyOnload"
        onLoad={() =>
          console.log(`script loaded correctly, window.FB has been populated`)
        }
      />
      <div className="grid grid-cols-1 md:grid-cols-12 h-[100vh] w-full">
        <div className="col-span-1 bg-[#1E4D91] h-full w-2/3 flex flex-col justify-between ">
          <div className="flex flex-col gap-8 items-center justify-center mt-4">
            <div className="w-full">
              <Image
                src="logo.svg"
                width={400}
                height={100}
                className="w-12 p-2 m-auto "
                alt="Picture of the author"
              />
            </div>

            <div className="w-full">
              <Image
                src="archive.svg"
                width={500}
                height={500}
                className="w-12 p-2 m-auto "
                alt="Picture of the author"
              />
            </div>

            <div className="w-full">
              <Image
                src="users.svg"
                width={500}
                height={500}
                className="w-12 p-2 m-auto "
                alt="Picture of the author"
              />
            </div>

            <div className="w-full">
              <Image
                src="trends.svg"
                width={500}
                height={500}
                className="w-12 p-2 m-auto "
                alt="Picture of the author"
              />
            </div>
          </div>
          <div className="flex flex-col gap-4 items-center justify-center">
            <Image
              src="p1.svg"
              width={500}
              height={500}
              className="w-8 "
              alt="Picture of the author"
            />
          </div>
        </div>
        <div className="col-span-2 ms-[-2.3rem] border-r-2 border-[#E3E3E3]">
          <div className="flex flex-col border-b-2 border-[#E3E3E3] text-black">
            <div className="flex gap-4 p-4 items-center ">
              <div>
                <Image
                  src="graph.svg"
                  width={500}
                  height={500}
                  className="w-5 rotate-90"
                  alt="Picture of the author"
                />
              </div>
              <div className="text-2xl font-bold">Conversations</div>
              <div className="ms-auto">
                <Image
                  src="restart.svg"
                  width={500}
                  height={500}
                  className="w-5"
                  alt="Picture of the author"
                />
              </div>
            </div>
          </div>

          <div className="text-black">
            {profiles.map((profile: any) => {
              return (
                <ConversationElement
                  key={profile.id}
                  name={`${profile.first_name} ${profile.last_name}`}
                  description={profile.message}
                  isSelected={profile.id == activeSender?.id}
                  showConv={() => processConv(profile)}
                />
              );
            })}
          </div>
        </div>
        <div className="col-span-6 border-r-2 border-[#E3E3E3] overflow-scroll">
          <div className="flex flex-col h-full">
            <div className="flex gap-4 p-4 px-5 items-center border-b-2 border-[#E3E3E3] ">
              <div className="text-2xl text-black font-bold">
                {activeSender
                  ? `${activeSender?.first_name} ${activeSender?.last_name}`
                  : 'No User Selected'}
              </div>
            </div>

            <div className="bg-[#F6F6F6] grow ">
              <div className="flex flex-col justify-between h-full">
                <div>
                  <div className="flex flex-col w-full gap-2 p-4">
                    {activeSender &&
                      activeSender.messages.map((message: any) => {
                        return (
                          <Message
                            key={message.messageId}
                            message={message.message}
                            sender={message.senderId == activeSender?.id}
                          />
                        );
                      })}
                  </div>
                </div>
                <div className="p-4  text-black">
                  <form
                    onSubmit={(e: any) => {
                      e.preventDefault();
                      if (activeSender) handleMessage(e.target[0].value);
                      setMessage('');
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Message"
                      onChange={(e) => setMessage(e.target.value)}
                      value={message}
                      className="border-2 border-[#42A5F5] rounded-lg p-3 w-full"
                    />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        {activeSender && (
          <div className="col-span-3">
            <div className="flex flex-col h-full justify-start items-center">
              <div className="h-[45%] flex flex-col p-5 items-center">
                <div className="bg-white">
                  <Image
                    src={`${activeSender?.profile_pic}`}
                    width={500}
                    height={500}
                    className="w-[5rem]"
                    alt="Picture of the author"
                  />
                </div>

                <p className="text-xl text-black font-semibold mt-5">
                  {activeSender?.first_name} {activeSender?.last_name}
                </p>
                <div className="flex gap-1 items-center text-[#6C6C6C]">
                  <p className="text-xl">•</p>
                  <p className="text-sm">Offline</p>
                </div>

                <div className="flex text-black gap-4 mt-4 font-medium ">
                  <button>
                    <p className="flex items-center gap-2 border-2 border-[#E3E3E3] px-4 py-1  rounded-lg">
                      <Image
                        src="call.svg"
                        width={500}
                        height={500}
                        className="w-8 rotate-90"
                        alt="Picture of the author"
                      />
                      Call
                    </p>
                  </button>
                  <button>
                    <p className="flex items-center  gap-2 border-2 border-[#E3E3E3] px-4 py-2  rounded-lg">
                      <Image
                        src="profile.svg"
                        width={400}
                        height={400}
                        className="w-5"
                        alt="Picture of the author"
                      />
                      Profile
                    </p>
                  </button>
                </div>
              </div>

              <div className="bg-[#EFF2F7] p-4 w-full h-[100%] text-black">
                <div className=" flex flex-col bg-white gap-4 p-4 rounded-lg">
                  <p className="font-semibold text-lg ">Customer details</p>

                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <b className="text-[#90A4AE] font-normal">Email</b>{' '}
                      <p>estu4040@gmail.com</p>
                    </div>

                    <div className="flex justify-between items-center">
                      <b className="text-[#90A4AE] font-normal">First Name</b>{' '}
                      <p>{activeSender?.first_name}</p>
                    </div>

                    <div className="flex justify-between items-center">
                      <b className="text-[#90A4AE] font-normal">Last Name</b>{' '}
                      <p>{activeSender?.last_name}</p>
                    </div>

                    <a href="" className="text-[#4D78CC] text-sm mt-2">
                      View more details
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

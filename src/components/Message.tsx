import React from 'react';

function Message({ message, sender }: any) {
  return (
    <div>
      {sender ? (
        <p className="text-black  text-sm bg-white rounded-lg p-2 w-max">
          {message}
        </p>
      ) : (
        <p className="text-white  text-sm bg-[#42A5F5] rounded-lg p-2 w-max ml-auto">
          {message}
        </p>
      )}
    </div>
  );
}

export default Message;

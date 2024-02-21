import React from 'react';

function Message({ message }: any) {
  return (
    <div>
      <p className="text-black  text-sm bg-white rounded-lg p-2 w-max">
        {message}
      </p>
    </div>
  );
}

export default Message;

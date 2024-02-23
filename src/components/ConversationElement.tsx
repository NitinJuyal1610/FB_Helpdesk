import React from 'react';

function ConversationElement({ name, description, isSelected, showConv }: any) {
  return (
    <div
      style={
        isSelected
          ? { backgroundColor: '#EDEEF0' }
          : { backgroundColor: 'white' }
      }
    >
      <div className="w-full  flex flex-col p-4 gap-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <input type="checkbox" className="w-5" onClick={() => showConv()} />
            <div className="flex flex-col ">
              <p className="text-lg text-black w-full font-semibold">{name}</p>
              <p className="text-sm text-black w-full  ">Facebook Pages</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-black w-full text-[#90A4AE] ">
          {description}
        </p>
      </div>
    </div>
  );
}

export default ConversationElement;

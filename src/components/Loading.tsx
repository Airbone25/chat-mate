import React from 'react'

function Loading() {
  return (
    <div className="flex justify-center items-center h-full">
      <span className="flex items-center text-lg font-medium">
        <span className="ml-1 flex">
          <span className="animate-bounce [animation-delay:0s]">.</span>
          <span className="animate-bounce [animation-delay:0.2s]">.</span>
          <span className="animate-bounce [animation-delay:0.4s]">.</span>
        </span>
      </span>
    </div>
  )
}

export default Loading
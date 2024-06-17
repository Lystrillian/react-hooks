'use client';

import { useState } from 'react';

import { useArrayJoin } from './useArrayJoin';

export default function ArrayJoinDemo() {
  const [inputValue, setInputValue] = useState('');
  const [separator, setSeparator] = useState(',');
  const items = inputValue.split(',').map(item => item.trim());
  const joinedItems = useArrayJoin(items, separator);

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="mb-4">
            <label
              htmlFor="input"
              className="block text-gray-700 font-bold mb-2"
            >
              Enter items (comma-separated):
            </label>
            <input
              id="input"
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="separator"
              className="block text-gray-700 font-bold mb-2"
            >
              Enter separator:
            </label>
            <input
              id="separator"
              type="text"
              value={separator}
              onChange={e => setSeparator(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="bg-gray-100 p-4 rounded-md">
            <p className="text-lg font-semibold mb-2">Joined items:</p>
            <p className="text-gray-800">{joinedItems}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

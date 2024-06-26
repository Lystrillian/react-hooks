'use client';

import { useState } from 'react';
import { useList } from './use-list';

export default function UseListDemo() {
  const [list, { push, removeAt, insertAt, updateAt, clear }] = useList<number>(
    [1, 2, 3],
  );
  const [inputValue, setInputValue] = useState('');

  const handleAddItem = () => {
    if (inputValue.trim() !== '') {
      push(Number(inputValue));
      setInputValue('');
    }
  };

  return (
    <div className="relative mb-[10px] rounded-lg border p-[2em] transition-colors">
      <div className="mb-4">
        <label
          htmlFor="inputItem"
          className="mb-2 block font-bold text-gray-700"
        >
          Add Item:
        </label>
        <div className="flex">
          <input
            type="text"
            id="inputItem"
            className="flex-1 rounded-l-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
          />
          <button
            className="rounded-r-md bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
            onClick={handleAddItem}
          >
            Add
          </button>
        </div>
      </div>
      <ul className="space-y-2">
        {list.map((item, index) => (
          <li key={index} className="flex items-center justify-between">
            <span>{item}</span>
            <div>
              <button
                className="px-2 py-1 font-bold text-blue-500 hover:text-blue-600"
                onClick={() => {
                  removeAt(index);
                }}
              >
                Remove
              </button>
              <button
                className="px-2 py-1 font-bold text-blue-500 hover:text-blue-600"
                onClick={() => {
                  updateAt(index, Number(`${item}`));
                }}
              >
                Update
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <button
          className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600"
          onClick={clear}
        >
          Clear List
        </button>
      </div>
    </div>
  );
}

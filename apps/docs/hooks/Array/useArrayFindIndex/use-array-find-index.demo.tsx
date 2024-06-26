'use client';

import { useState } from 'react';
import { useArrayFindIndex } from './use-array-find-index';

export default function ArrayFindIndexDemo() {
  const [users, setUsers] = useState([
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' },
  ]);
  const [searchId, setSearchId] = useState('');

  const findUserIndexById = (user: { id: number }) =>
    user.id === parseInt(searchId);
  const userIndex = useArrayFindIndex(users, findUserIndexById);

  return (
    <div className="relative mb-[10px] rounded-lg border p-[2em] transition-colors">
      <div className="mb-6">
        <label htmlFor="users" className="mb-2 block font-bold">
          Users:
        </label>
        <textarea
          id="users"
          value={JSON.stringify(users, null, 2)}
          onChange={(e) => { setUsers(JSON.parse(e.target.value)); }}
          className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
          rows={6}
        />
      </div>
      <div className="mb-6">
        <label htmlFor="searchId" className="mb-2 block font-bold">
          Search User ID:
        </label>
        <input
          type="text"
          id="searchId"
          value={searchId}
          onChange={(e) => { setSearchId(e.target.value); }}
          className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
      </div>
      <div>
        <p className="mb-2 font-bold">User Index:</p>
        {userIndex !== -1 ? <p>{userIndex}</p> : <p>User not found.</p>}
      </div>
    </div>
  );
}

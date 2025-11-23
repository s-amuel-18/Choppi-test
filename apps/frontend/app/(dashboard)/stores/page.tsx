'use client';

import { useState } from 'react';

export default function StoresPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data for the table
  const stores = [
    {
      id: 1,
      name: 'Downtown Store',
      address: 'Main St 123',
      phone: '555-0101',
      status: 'Active',
    },
    {
      id: 2,
      name: 'North Store',
      address: 'North Ave 456',
      phone: '555-0102',
      status: 'Active',
    },
    {
      id: 3,
      name: 'South Store',
      address: 'South Blvd 789',
      phone: '555-0103',
      status: 'Inactive',
    },
  ];

  // Filter stores based on search term
  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.phone.includes(searchTerm)
  );

  const handleCreateStore = () => {
    // TODO: Implement create store logic
    console.log('Create new store');
  };

  return (
    <div className="w-full">
      {/* Title and Create Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Stores</h1>
        <button onClick={handleCreateStore} className="btn btn-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2"
            fill="none"
            stroke="currentColor"
            className="size-5"
          >
            <path d="M12 5v14"></path>
            <path d="M5 12h14"></path>
          </svg>
          Create Store
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2"
            fill="none"
            stroke="currentColor"
            className="size-4 opacity-70"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
          <input
            type="text"
            className="grow"
            placeholder="Search by name, address or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </label>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStores.length > 0 ? (
              filteredStores.map((store) => (
                <tr key={store.id}>
                  <td>{store.id}</td>
                  <td className="font-medium">{store.name}</td>
                  <td>{store.address}</td>
                  <td>{store.phone}</td>
                  <td>
                    <div
                      className={`badge ${
                        store.status === 'Active'
                          ? 'badge-success'
                          : 'badge-error'
                      }`}
                    >
                      {store.status}
                    </div>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-sm btn-ghost">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          strokeLinejoin="round"
                          strokeLinecap="round"
                          strokeWidth="2"
                          fill="none"
                          stroke="currentColor"
                          className="size-4"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button className="btn btn-sm btn-ghost">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          strokeLinejoin="round"
                          strokeLinecap="round"
                          strokeWidth="2"
                          fill="none"
                          stroke="currentColor"
                          className="size-4"
                        >
                          <path d="M3 6h18"></path>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-8">
                  <p className="text-base-content/60">
                    No stores found matching the search term
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

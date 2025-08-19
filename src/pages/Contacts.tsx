import { useState } from 'react';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

function normalizePhone(phone: string) {
  // Simple E.164 normalization (assumes +countrycode...)
  return phone.replace(/[^+\d]/g, '');
}


const fetchContacts = async ({ queryKey }: { queryKey: [string, string] }) => {
  const [_key, query] = queryKey;
  const res = await axios.get('/api/contacts', { params: { query } });
  return res.data;
};

type UserItem = { id: string; firstName?: string | null; lastName?: string | null; email: string; phone?: string | null; avatarUrl?: string | null };
type UsersResponse = { items: UserItem[]; total: number; page?: number; pageSize?: number };

const fetchUsers = async (q: string, page: number, pageSize: number): Promise<UsersResponse> => {
  const res = await axios.get('/api/users/search', { params: { q, page, pageSize } });
  return res.data as UsersResponse;
};

export default function Contacts() {
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', emails: [''], phones: [''] });
  const [userSearch, setUserSearch] = useState('');
  const [userPage, setUserPage] = useState(1);
  const queryClient = useQueryClient();


  const { data, isLoading } = useQuery({
    queryKey: ['contacts', search],
    queryFn: fetchContacts
  });

  const { data: userResults, isLoading: usersLoading } = useQuery<UsersResponse, Error>({
    queryKey: ['users', userSearch, userPage, 20],
    queryFn: () => fetchUsers(userSearch, userPage, 20),
    enabled: userSearch.length > 0,
  });

  const addContact = useMutation({
    mutationFn: async (body: any) => {
      return axios.post('/api/contacts', body);
    },
    onSuccess: () => {
      setShowAdd(false);
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });

  const addUserAsContact = useMutation({
    mutationFn: async (userId: string) => {
      return axios.post('/api/contacts', { userId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Contacts</h1>
      <input
        className="border p-2 mb-4 w-full"
        placeholder="Search contacts..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="flex gap-2 mb-4">
        <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={() => setShowAdd(true)}>
          Add Contact
        </button>
        <input className="border p-2 w-full" placeholder="Find users to add..." value={userSearch} onChange={e => { setUserSearch(e.target.value); setUserPage(1); }} />
      </div>

      {userSearch.length > 0 ? (
        <div className="mb-4">
          {usersLoading ? <div>Searching...</div> : (
            <div>
              {(userResults as any)?.items?.map((u: any) => (
                <div key={u.id} className="flex items-center justify-between border p-2 mb-2">
                  <div>
                    <div className="font-semibold">{u.firstName} {u.lastName}</div>
                    <div className="text-sm text-gray-600">{u.email} {u.phone ? `• ${u.phone}` : ''}</div>
                  </div>
                  <div>
                    <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={() => addUserAsContact.mutate(u.id)}>Add</button>
                  </div>
                </div>
              ))}
              <div className="flex gap-2 mt-2">
                <button disabled={userPage <= 1} onClick={() => setUserPage(p => Math.max(1, p - 1))} className="px-3 py-1 bg-gray-200 rounded">Prev</button>
                <button disabled={(userResults?.total ?? 0) <= userPage * 20} onClick={() => setUserPage(p => p + 1)} className="px-3 py-1 bg-gray-200 rounded">Next</button>
              </div>
            </div>
          )}
        </div>
      ) : null}

      {isLoading ? <div>Loading...</div> : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Phone</th>
            </tr>
          </thead>
          <tbody>
            {(data as any)?.items?.map((c: any) => (
              <tr key={c.id} className="border-t">
                <td className="p-2">{c.firstName} {c.lastName}</td>
                <td className="p-2">{c.emails?.[0]?.email || ''}</td>
                <td className="p-2">{c.phones?.[0]?.e164 || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {showAdd && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl mb-2">Add Contact</h2>
            <input className="border p-2 mb-2 w-full" placeholder="First Name" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} />
            <input className="border p-2 mb-2 w-full" placeholder="Last Name" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} />
            <input className="border p-2 mb-2 w-full" placeholder="Email" value={form.emails[0]} onChange={e => setForm(f => ({ ...f, emails: [e.target.value] }))} />
            <input className="border p-2 mb-2 w-full" placeholder="Phone (+E.164)" value={form.phones[0]} onChange={e => setForm(f => ({ ...f, phones: [normalizePhone(e.target.value)] }))} />
            <div className="flex gap-2 mt-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={() => addContact.mutate({ ...form, phones: [{ e164: normalizePhone(form.phones[0]) }] })}>Save</button>
              <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setShowAdd(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

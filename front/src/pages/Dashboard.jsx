import { useAuthStore } from "../store/auth.store"

export default function Dashboard() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  return (
    <div className="h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-xl shadow-md max-w-md">
        <h1 className="text-xl mb-4">Dashboard</h1>

        {user ? (
          <>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>

            <button
              onClick={logout}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  )
}
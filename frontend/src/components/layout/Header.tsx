import { useAuthStore } from "../../stores/authStore";

interface HeaderProps {
  onAuthClick: () => void;
}

export function Header({ onAuthClick }: HeaderProps) {
  const { isAuthenticated, user, logout } = useAuthStore();

  return (
    <header className="bg-gray-50 border-b border-gray-200 px-4 py-3 shadow-sm">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 8h10M7 12h10M7 16h10M3 3h18a2 2 0 012 2v14a2 2 0 01-2 2H3a2 2 0 01-2-2V5a2 2 0 012-2z"
            ></path>
          
          <h1 className="text-xl font-semibold text-gray-800">
            Markdown Editor
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              {user && (
                <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  {user.email}
                </span>
              )}
              <button
                onClick={logout}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-100 text-gray-700 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div>
              <button
                onClick={onAuthClick}
                className="px-4 py-2 text-sm bg-gray-700 text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                Login
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

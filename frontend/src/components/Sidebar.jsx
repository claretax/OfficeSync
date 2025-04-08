import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="w-64 bg-gray-800 text-white h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-4 text-xl font-bold border-b border-gray-700">SMS Dashboard</div>
      <nav className="mt-4">
        <ul>
          <li>
            <Link to="/stats" className="flex items-center p-4 hover:bg-gray-700 transition-colors duration-200">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 012-2h2a2 2 0 012 2v12a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Stats</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
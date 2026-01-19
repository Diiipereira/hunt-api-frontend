import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function DashboardLayout() {
    return (
        <div className="flex min-h-screen bg-hunt-dark-500 font-sans text-hunt-light-300">
            <Sidebar />
            <main className="ml-64 flex-1 p-8">
                <Outlet />
            </main>
        </div>
    );
}

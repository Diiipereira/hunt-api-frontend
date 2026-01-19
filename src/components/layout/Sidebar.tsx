import { NavLink, useNavigate } from 'react-router-dom';
import {
    GearIcon,
    SignOutIcon,
    SquaresFourIcon,
    UserCircleIcon,
    GameControllerIcon,
    CoinsIcon
} from '@phosphor-icons/react';
import { useAuthStore } from '../../stores/auth';
import { useUserStore } from '../../stores/user';
import clsx from 'clsx';

export function Sidebar() {
    const navigate = useNavigate();
    const { logout } = useAuthStore();
    const { user, loading, clear } = useUserStore();



    function handleLogout() {
        logout();
        clear();
        navigate('/signin');
    }

    return (
        <aside className="bg-hunt-dark-400/20 border-hunt-light-900/10 fixed top-0 left-0 z-40 flex h-screen w-64 flex-col border-r px-4">
            <div className="border-hunt-light-300/5 flex items-center gap-3 border-b py-6">
                <div className="bg-hunt-dark-500 ring-hunt-purple-400 relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full ring-2">
                    {loading ? (
                        <div className="bg-hunt-dark-500 absolute inset-0 flex items-center justify-center">
                            <div className="border-hunt-purple-500 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                        </div>
                    ) : user?.avatar ? (
                        <img src={user.avatar} alt="User Avatar" className="h-full w-full object-cover" />
                    ) : user?.username ? (
                        <span className="text-hunt-light-300 text-lg font-bold">
                            {user.username[0].toUpperCase()}
                        </span>
                    ) : (
                        <UserCircleIcon size={32} className="text-hunt-light-700" weight="fill" />
                    )}
                </div>

                <div className="flex flex-col gap-0.5 overflow-hidden">
                    {loading && !user ? (
                        <>
                            <div className="bg-hunt-light-900/10 h-4 w-24 animate-pulse rounded"></div>
                            <div className="bg-hunt-light-900/10 mt-1 h-3 w-32 animate-pulse rounded"></div>
                        </>
                    ) : user ? (
                        <>
                            <h3 className="text-hunt-light-300 truncate text-sm font-bold">
                                {user.username}
                            </h3>
                            <p className="text-hunt-light-700 truncate text-xs font-semibold" title={user.email}>
                                {user.email}
                            </p>
                        </>
                    ) : (
                        <div className="bg-hunt-light-900/10 h-4 w-20 rounded opacity-20"></div>
                    )}
                </div>
            </div>

            <nav className="flex-1 space-y-2 py-6">
                <NavLink
                    to="/dashboard"
                    end
                    className={({ isActive }) =>
                        clsx(
                            "group text-md flex items-center gap-3 rounded-md px-3 py-2.5 font-bold transition-colors",
                            isActive
                                ? "bg-hunt-purple-500 text-hunt-light-300"
                                : "text-hunt-light-600 hover:text-hunt-light-300 hover:bg-hunt-dark-300/15"
                        )
                    }
                >
                    <SquaresFourIcon size={24} weight="bold" />
                    Painel
                </NavLink>
                <NavLink
                    to="/dashboard/slots"
                    className={({ isActive }) =>
                        clsx(
                            "group text-md flex items-center gap-3 rounded-md px-3 py-2.5 font-bold transition-colors",
                            isActive
                                ? "bg-hunt-purple-500 text-hunt-light-300"
                                : "text-hunt-light-600 hover:text-hunt-light-300 hover:bg-hunt-dark-300/15"
                        )
                    }
                >
                    <CoinsIcon size={24} weight="bold" />
                    Slots
                </NavLink>
                <NavLink
                    to="/dashboard/providers"
                    className={({ isActive }) =>
                        clsx(
                            "group text-md flex items-center gap-3 rounded-md px-3 py-2.5 font-bold transition-colors",
                            isActive
                                ? "bg-hunt-purple-500 text-hunt-light-300"
                                : "text-hunt-light-600 hover:text-hunt-light-300 hover:bg-hunt-dark-300/15"
                        )
                    }
                >
                    <GameControllerIcon size={24} weight="bold" />
                    Provedoras
                </NavLink>
                <NavLink
                    to="/dashboard/profile"
                    className={({ isActive }) =>
                        clsx(
                            "group text-md flex items-center gap-3 rounded-md px-3 py-2.5 font-bold transition-colors",
                            isActive
                                ? "bg-hunt-purple-500 text-hunt-light-300"
                                : "text-hunt-light-600 hover:text-hunt-light-300 hover:bg-hunt-dark-300/15"
                        )
                    }
                >
                    <UserCircleIcon size={24} weight="bold" />
                    Perfil
                </NavLink>
                <NavLink
                    to="/dashboard/settings"
                    className={({ isActive }) =>
                        clsx(
                            "group text-md flex items-center gap-3 rounded-md px-3 py-2.5 font-bold transition-colors",
                            isActive
                                ? "bg-hunt-purple-500 text-hunt-light-300"
                                : "text-hunt-light-600 hover:text-hunt-light-300 hover:bg-hunt-dark-300/15"
                        )
                    }
                >
                    <GearIcon size={24} weight="bold" />
                    Configurações
                </NavLink>
            </nav>

            <div className="border-hunt-light-300/5 border-t py-6">
                <button
                    onClick={handleLogout}
                    className="text-md text-hunt-red-200 hover:bg-hunt-red-300/10 flex w-full items-center gap-3 rounded-md px-3 py-2.5 font-bold transition-colors"
                >
                    <SignOutIcon size={24} weight="bold" />
                    Sair
                </button>
            </div>
        </aside>
    );
}

import { PlusIcon, FunnelIcon, ArrowRightIcon, LightningIcon, DiceFiveIcon, PiggyBankIcon, CaretDownIcon } from '@phosphor-icons/react';
import clsx from 'clsx';

const activeHunts = [
    {
        id: 1,
        title: 'Ganhos Épicos 2024',
        isFeatured: true,
        progress: 72,
        totalBonuses: 25,
        slotsOpened: 18,
        totalSlots: 25,
        currentWin: 8950,
        targetWin: 10000,
        status: 'active'
    },
    {
        id: 2,
        title: 'Altas Apostas',
        isFeatured: false,
        progress: 50,
        totalBonuses: 10,
        slotsOpened: 5,
        totalSlots: 10,
        currentWin: 53100,
        targetWin: 50000,
        status: 'active'
    },
    {
        id: 3,
        title: 'Especial Nolimit City',
        isFeatured: false,
        progress: 70,
        totalBonuses: 10,
        slotsOpened: 7,
        totalSlots: 10,
        currentWin: 2310,
        targetWin: 5000,
        status: 'active'
    },
    {
        id: 4,
        title: 'Sorteio Pragmatic Play',
        isFeatured: false,
        progress: 25,
        totalBonuses: 20,
        slotsOpened: 5,
        totalSlots: 20,
        currentWin: 4310,
        targetWin: 5000,
        status: 'active'
    },
    {
        id: 5,
        title: 'Caçada de Natal',
        isFeatured: false,
        progress: 100,
        totalBonuses: 30,
        slotsOpened: 30,
        totalSlots: 30,
        currentWin: 25000,
        targetWin: 5000,
        status: 'active'
    }
];

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export function Dashboard() {
    return (
        <div className="mx-auto max-w-7xl p-6">
            <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-hunt-light-300 text-3xl font-extrabold">Dashboard</h1>
                    <p className="text-hunt-light-600 mt-1 font-medium">
                        Bem-vindo de volta, vamos rastrear algumas vitórias!
                    </p>
                </div>

                <button className="bg-hunt-purple-500 hover:bg-hunt-purple-400 shadow-hunt-purple-500/20 flex items-center gap-2 rounded-lg px-6 py-3 font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0">
                    <PlusIcon size={20} weight="bold" />
                    Nova Caçada
                </button>
            </div>

            <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                <h2 className="text-hunt-light-300 text-xl font-bold">Caçadas Ativas</h2>

                <div className="flex flex-wrap items-center gap-3">
                    <button className="bg-hunt-dark-400 border-hunt-light-900/10 text-hunt-light-500 hover:text-hunt-light-300 hover:bg-hunt-dark-300 flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-bold transition-colors">
                        <FunnelIcon size={16} />
                        Filtrar
                    </button>

                    <div className="bg-hunt-dark-400 border-hunt-light-900/10 flex items-center rounded-lg border p-1">
                        <button className="bg-hunt-purple-500 text-hunt-light-300 rounded px-4 py-1.5 text-xs font-bold shadow-md transition-all">
                            Tudo
                        </button>
                        <button className="text-hunt-light-600 hover:text-hunt-light-300 hover:bg-hunt-light-900/5 rounded px-4 py-1.5 text-xs font-bold transition-colors">
                            Apostas Altas
                        </button>
                        <button className="text-hunt-light-600 hover:text-hunt-light-300 hover:bg-hunt-light-900/5 rounded px-4 py-1.5 text-xs font-bold transition-colors">
                            Apostas Baixas
                        </button>
                    </div>

                    <button className="bg-hunt-dark-400 border-hunt-light-900/10 text-hunt-light-500 hover:text-hunt-light-300 hover:bg-hunt-dark-300 flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-bold transition-colors">
                        Classificar por
                        <CaretDownIcon size={16} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {activeHunts.map((hunt) => (
                    <div
                        key={hunt.id}
                        className={clsx(
                            "relative flex flex-col justify-between rounded-2xl border p-6 shadow-xl transition-all",
                            hunt.isFeatured
                                ? "bg-hunt-dark-400/20 border-hunt-purple-500/30 shadow-hunt-purple-500/5 md:col-span-2"
                                : "bg-hunt-dark-400/20 border-hunt-light-900/5 hover:border-hunt-light-900/20"
                        )}
                    >
                        <div>
                            <div className="mb-6 flex items-start justify-between">
                                <div>
                                    {hunt.isFeatured && (
                                        <span className="text-hunt-purple-300 mb-2 block text-xs font-extrabold tracking-wider uppercase">
                                            MAIS RECENTE
                                        </span>
                                    )}
                                    <h3 className="text-hunt-light-300 text-xl font-bold">{hunt.title}</h3>
                                </div>

                                {hunt.isFeatured && (
                                    <div className="bg-hunt-purple-500/10 flex h-10 w-10 items-center justify-center rounded-lg">
                                        <LightningIcon className="text-hunt-purple-400" size={20} weight="fill" />
                                    </div>
                                )}
                            </div>

                            <div className="mb-8 space-y-2">
                                <div className="bg-hunt-light-900/10 h-3 w-full overflow-hidden rounded-full">
                                    <div
                                        className="bg-hunt-purple-500 h-full rounded-full transition-all duration-500 ease-out"
                                        style={{ width: `${hunt.progress}%` }}
                                    ></div>
                                </div>
                                <div className="mt-1 flex justify-between text-xs font-bold">
                                    <span className="text-hunt-light-600">Progresso</span>
                                    <span className="text-hunt-light-300">{hunt.progress}%</span>
                                </div>
                            </div>

                            <div className="mb-8 grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <div className="text-hunt-light-600 flex items-center gap-2">
                                        <DiceFiveIcon size={20} className="text-hunt-blue-200" />
                                        <span className="text-xs font-bold uppercase">Slots:</span>
                                    </div>
                                    <p className="text-hunt-light-300 ml-6 text-sm font-bold">
                                        {hunt.slotsOpened}/{hunt.totalSlots}
                                        <span className="text-xs font-normal opacity-70"> Aberto</span>
                                    </p>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <div className="text-hunt-light-600 flex items-center gap-2">
                                        <PiggyBankIcon size={20} className="text-hunt-yellow-300" />
                                        <span className="text-xs font-bold uppercase">GANHO:</span>
                                    </div>
                                    <p className="text-hunt-light-300 ml-6 font-mono text-sm font-bold">
                                        <span
                                            className={
                                                hunt.currentWin >= hunt.targetWin
                                                    ? "text-hunt-green-300"
                                                    : "text-hunt-red-200"
                                            }
                                        >
                                            {formatCurrency(hunt.currentWin)}
                                        </span>
                                        <span className="text-hunt-light-700 text-xs"> / {formatCurrency(hunt.targetWin)}</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {hunt.isFeatured ? (
                            <button className="bg-hunt-purple-500 hover:bg-hunt-purple-400 shadow-hunt-purple-500/20 text-hunt-light-300 flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold shadow-lg transition-all hover:-translate-y-0.5">
                                Continuar Caçada
                                <ArrowRightIcon size={18} />
                            </button>
                        ) : (
                            <button className="bg-hunt-light-900/5 hover:bg-hunt-light-900/10 text-hunt-light-600 hover:text-hunt-light-300 hover:border-hunt-light-900/10 flex w-full items-center justify-center gap-2 rounded-lg border border-transparent py-3 text-sm font-bold transition-all">
                                Continuar Caçada
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

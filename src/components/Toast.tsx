import { CheckCircleIcon, XCircleIcon, WarningCircleIcon, InfoIcon, XIcon } from '@phosphor-icons/react';
import { useToastStore, type ToastType } from '../stores/toast';

const variants = {
    success: {
        bg: 'bg-hunt-dark-500',
        border: 'border-hunt-green-100',
        highlight: 'text-hunt-green-100',
        text: 'text-hunt-light-300',
        icon: CheckCircleIcon
    },
    error: {
        bg: 'bg-hunt-dark-500',
        border: 'border-hunt-red-200',
        highlight: 'text-hunt-red-200',
        text: 'text-hunt-light-300',
        icon: XCircleIcon
    },
    warning: {
        bg: 'bg-hunt-dark-500',
        border: 'border-hunt-yellow-500',
        highlight: 'text-hunt-yellow-500',
        text: 'text-hunt-light-300',
        icon: WarningCircleIcon
    },
    info: {
        bg: 'bg-hunt-dark-500',
        border: 'border-hunt-blue-200',
        highlight: 'text-hunt-blue-200',
        text: 'text-hunt-light-300',
        icon: InfoIcon
    }
};

function getTitle(type: ToastType) {
    const titles: Record<string, string> = {
        info: 'Informação',
        error: 'Erro',
        success: 'Sucesso',
        warning: 'Atenção'
    };
    return titles[type] || 'Atenção';
}

export function ToastContainer() {
    const { toasts, remove } = useToastStore();

    return (
        <div className="pointer-events-none fixed top-0 right-0 z-50 flex max-h-screen w-full flex-col items-end gap-2 p-6">
            {toasts.map((toast) => {
                const style = variants[toast.type];
                const Icon = style.icon;

                return (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto relative flex w-full max-w-sm items-start gap-4 rounded-xl border p-4 shadow-2xl ${style.bg} ${style.border} animate-in slide-in-from-right fade-in duration-300`}
                    >
                        <Icon size={24} weight="bold" className={`${style.highlight} mt-0.5 shrink-0`} />

                        <div className="flex-1 pr-6">
                            <h4 className={`text-md font-bold capitalize ${style.highlight}`}>
                                {getTitle(toast.type)}
                            </h4>
                            <p className={`mt-1 text-sm font-medium opacity-90 ${style.text}`}>{toast.message}</p>
                        </div>

                        <button
                            onClick={() => remove(toast.id)}
                            className={`absolute top-4 right-4 ${style.text} opacity-70 transition-opacity hover:opacity-100`}
                        >
                            <XIcon size={18} weight="bold" />
                        </button>
                    </div>
                );
            })}
        </div>
    );
}

import { type ComponentProps, type ReactNode, forwardRef, useState } from 'react';
import { EyeIcon, WarningCircleIcon, EyeSlashIcon } from '@phosphor-icons/react';
import type { FieldError } from 'react-hook-form';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface InputProps extends ComponentProps<'input'> {
    label?: string;
    error?: string | FieldError;
    icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, icon, className, type = 'text', disabled, ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);

        const errorMessage = typeof error === 'string' ? error : error?.message;
        const isPassword = type === 'password';
        const inputType = isPassword && showPassword ? 'text' : type;

        return (
            <div className="relative w-full">
                {label && (
                    <label
                        htmlFor={props.id || props.name}
                        className={clsx(
                            "text-hunt-light-600 mb-1 block text-sm font-bold",
                            disabled && "opacity-50"
                        )}
                    >
                        {label}
                    </label>
                )}

                <div className="relative">
                    {icon && (
                        <div className="text-hunt-light-600/50 pointer-events-none absolute top-1/2 left-3 flex -translate-y-1/2 items-center">
                            {icon}
                        </div>
                    )}

                    <input
                        ref={ref}
                        type={inputType}
                        disabled={disabled}
                        className={twMerge(
                            clsx(
                                "bg-hunt-dark-500 text-hunt-light-300 placeholder:text-hunt-light-700",
                                "disabled:border-hunt-light-900/10 w-full rounded-md border py-2.5 transition-colors",
                                "outline-none disabled:cursor-not-allowed disabled:opacity-50",
                                icon ? "pr-4 pl-10" : "px-4",
                                errorMessage
                                    ? "border-hunt-red-300 focus:ring-hunt-red-400 focus:ring-1"
                                    : "border-hunt-light-900/10 focus:border-hunt-purple-500 focus:ring-hunt-purple-500 focus:ring-1",
                                className
                            )
                        )}
                        {...props}
                    />

                    {isPassword && !disabled && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-hunt-light-600 hover:text-hunt-light-300 absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
                            tabIndex={-1}
                        >
                            {showPassword ? (
                                <EyeSlashIcon size={20} />
                            ) : (
                                <EyeIcon size={20} />
                            )}
                        </button>
                    )}

                    {errorMessage && !disabled && (
                        <div className="text-hunt-red-200 absolute -bottom-5 left-0 z-10 flex items-center gap-1.5 text-xs font-medium whitespace-nowrap">
                            <WarningCircleIcon className="h-3.5 w-3.5" />
                            <span>{errorMessage}</span>
                        </div>
                    )}
                </div>
            </div>
        );
    }
);

Input.displayName = 'Input';

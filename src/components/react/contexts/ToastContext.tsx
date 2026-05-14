import { X } from "lucide-react";
import React, { createContext, useContext, useRef, useState } from "react";

type ToastType = "success" | "error";

interface Toast {
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast must be used within a ToastProvider");
    return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toast, setToast] = useState<Toast | null>(null);
    const [visible, setVisible] = useState(false);
    const [animationKey, setAnimationKey] = useState(0);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const showToast = (message: string, type: ToastType = "success") => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        setToast({ message, type });
        setVisible(true);
        setAnimationKey(prev => prev + 1);

        timeoutRef.current = setTimeout(() => {
            setVisible(false);
        }, 4000);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {visible && toast && (
                <div
                    className="fixed top-6 right-6 z-50 px-6 py-4 max-w-sm"
                    style={{
                        borderRadius: 'var(--radius-md)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                        backdropFilter: 'blur(16px)',
                        backgroundColor: toast.type === "success"
                            ? 'var(--color-success)'
                            : 'var(--color-error)',
                        color: '#ffffff',
                        fontFamily: 'var(--font-body)',
                        fontSize: '14px',
                        animation: 'slideIn 0.3s ease-out',
                    }}
                >
                    <div className="flex justify-between items-center gap-4">
                        <span>{toast.message}</span>
                        <button
                            onClick={() => setVisible(false)}
                            className="cursor-pointer"
                            style={{ color: 'rgba(255,255,255,0.8)' }}
                        >
                            <X size={18} />
                        </button>
                    </div>
                    <div
                        className="absolute bottom-0 left-0 w-full overflow-hidden"
                        style={{
                            height: '4px',
                            backgroundColor: 'rgba(255,255,255,0.3)',
                            borderRadius: '0 0 var(--radius-md) var(--radius-md)',
                        }}
                    >
                        <div
                            key={animationKey}
                            style={{
                                height: '100%',
                                backgroundColor: toast.type === "success"
                                    ? 'rgba(0,0,0,0.3)'
                                    : 'rgba(0,0,0,0.3)',
                                animation: 'progressBar 4s linear forwards',
                            }}
                        />
                    </div>
                </div>
            )}
            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes progressBar {
                    from { width: 100%; }
                    to { width: 0%; }
                }
            `}</style>
        </ToastContext.Provider>
    );
};

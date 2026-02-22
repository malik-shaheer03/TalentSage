import { create } from 'zustand';
import { ToastProps, ToastType } from './Toast';

interface ToastState {
  toasts: ToastProps[];
  addToast: (message: string, type: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

export const useToast = create<ToastState>((set) => ({
  toasts: [],
  addToast: (message, type, duration) => {
    const id = Math.random().toString(36).substring(2, 9);
    const toast: ToastProps = {
      id,
      message,
      type,
      duration,
      onClose: (id) => set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      })),
    };
    set((state) => ({
      toasts: [...state.toasts, toast],
    }));
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

// Convenience functions
export const toast = {
  success: (message: string, duration?: number) => 
    useToast.getState().addToast(message, 'success', duration),
  error: (message: string, duration?: number) => 
    useToast.getState().addToast(message, 'error', duration),
  warning: (message: string, duration?: number) => 
    useToast.getState().addToast(message, 'warning', duration),
  info: (message: string, duration?: number) => 
    useToast.getState().addToast(message, 'info', duration),
};

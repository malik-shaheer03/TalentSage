import { StateCreator } from 'zustand';
import { AuditLog } from '../../types';

export interface AuditSlice {
  auditLogs: AuditLog[];
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
  getLogsByEntity: (entityType: string, entityId: string) => AuditLog[];
  clearLogs: () => void;
}

const generateId = () => `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const createAuditSlice: StateCreator<
  AuditSlice,
  [],
  [],
  AuditSlice
> = (set, get) => ({
  auditLogs: [],

  addAuditLog: (log) =>
    set((state) => ({
      auditLogs: [
        ...state.auditLogs,
        {
          ...log,
          id: generateId(),
          timestamp: Date.now()
        }
      ]
    })),

  getLogsByEntity: (entityType, entityId) =>
    get()
      .auditLogs.filter(
        (log) => log.entityType === entityType && log.entityId === entityId
      )
      .sort((a, b) => b.timestamp - a.timestamp),

  clearLogs: () => set({ auditLogs: [] })
});

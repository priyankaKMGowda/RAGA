import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Patient, PatientStatus, ViewMode } from '@/types';
import { mockPatients } from './patientsData';

const STORAGE_VIEW_KEY = 'medicore.patients.view';

function readSavedView(): ViewMode {
  const saved = (typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_VIEW_KEY)) as ViewMode | null;
  return saved === 'list' || saved === 'grid' ? saved : 'grid';
}

export interface PatientsState {
  items: Patient[];
  view: ViewMode;
  search: string;
  statusFilter: PatientStatus | 'All';
  selectedId: string | null;
}

const initialState: PatientsState = {
  items: mockPatients,
  view: readSavedView(),
  search: '',
  statusFilter: 'All',
  selectedId: null,
};

const patientsSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    setView(state, action: PayloadAction<ViewMode>) {
      state.view = action.payload;
      try {
        localStorage.setItem(STORAGE_VIEW_KEY, action.payload);
      } catch {
        /* ignore storage errors */
      }
    },
    toggleView(state) {
      state.view = state.view === 'grid' ? 'list' : 'grid';
      try {
        localStorage.setItem(STORAGE_VIEW_KEY, state.view);
      } catch {
        /* ignore */
      }
    },
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setStatusFilter(state, action: PayloadAction<PatientStatus | 'All'>) {
      state.statusFilter = action.payload;
    },
    selectPatient(state, action: PayloadAction<string | null>) {
      state.selectedId = action.payload;
    },
  },
});

export const { setView, toggleView, setSearch, setStatusFilter, selectPatient } =
  patientsSlice.actions;
export default patientsSlice.reducer;

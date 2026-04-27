export type Role = 'admin' | 'doctor' | 'nurse';

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: Role;
  photoURL?: string | null;
}

export type Gender = 'Male' | 'Female' | 'Other';
export type PatientStatus = 'Stable' | 'Critical' | 'Recovering' | 'Discharged';

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  condition: string;
  status: PatientStatus;
  doctor: string;
  admittedOn: string; // ISO date
  bloodGroup: string;
  contact: string;
  avatarColor: string;
}

export type ViewMode = 'grid' | 'list';

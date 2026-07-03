export type Role = 'elderly' | 'volunteer' | 'admin';

export interface User {
  id: string;
  email: string;
  role: Role;
  name: string;
  surname: string;
  phone: string;
  profileImage?: string;
}

export interface ElderlyProfile extends User {
  age: number;
  gender: string;
  address: string;
  gps: { lat: number; lng: number };
  chronicDiseases: string[];
  regularMedications: string[];
  bloodGroup: string;
  emergencyContact: string;
  emergencyPhone: string;
}

export interface VolunteerProfile extends User {
  age: number;
  address: string;
  gps: { lat: number; lng: number };
  organization: string;
  capabilities: string[];
  availableTime: string;
  idCardUploaded: boolean;
  rating: number;
  reviewCount: number;
}

export interface HealthRecord {
  id: string;
  elderlyId: string;
  date: string;
  time: string;
  systolic: number; // blood pressure high
  diastolic: number; // blood pressure low
  heartRate: number;
  bloodSugar?: number;
  weight?: number;
  status: 'normal' | 'warning' | 'danger';
}

export interface PillReminder {
  id: string;
  elderlyId: string;
  name: string;
  time: string;
  dosage: string;
  taken: boolean;
}

export interface DoctorAppointment {
  id: string;
  elderlyId: string;
  doctorName: string;
  hospital: string;
  date: string;
  time: string;
  note?: string;
}

export type SOSStatus = 'searching' | 'accepted' | 'on_the_way' | 'completed';

export interface SOSRequest {
  id: string;
  elderlyId: string;
  elderlyName: string;
  elderlyPhone: string;
  elderlyGps: { lat: number; lng: number };
  elderlyAddress: string;
  volunteerId?: string;
  volunteerName?: string;
  volunteerPhone?: string;
  time: string;
  date: string;
  status: SOSStatus;
  rating?: number;
  reviewComment?: string;
}

export interface Notification {
  id: string;
  userId: string; // recipient
  title: string;
  message: string;
  time: string;
  type: 'pill' | 'appointment' | 'sos' | 'accepted' | 'review' | 'system';
  read: boolean;
}

export interface ChatMessage {
  id: string;
  sosId: string;
  senderId: string;
  senderRole: Role;
  message: string;
  time: string;
}

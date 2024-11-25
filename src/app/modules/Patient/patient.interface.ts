import { BloodGroup, Gender, MaritalStatus } from "@prisma/client";

export type IPatientFilterRequest = {
  name?: string | undefined;
  email?: string | undefined;
  contactNumber?: string | undefined;
  searchTerm?: string | undefined;
};

export interface IPatientUpdate {
  name: string;
  email: string;
  profilePhoto: string;
  contactNumber: string;
  address: string;
  patientHealthData?: IPatientHealthData;
  medicalReport?: IMedicalReport;
}

export interface IPatientHealthData {
  gender: Gender;
  dateOfBirth: string;
  bloodGroup: BloodGroup;
  hasAllergies?: boolean;
  hasDiabetes?: boolean;
  height: string;
  weight: string;
  smokingStatus?: boolean;
  dietaryPreferences?: any;
  pregnancyStatus?: boolean;
  mentalHealthHistory?: any;
  immunizationStatus?: any;
  hasPastSurgeries?: boolean;
  recentAnxiety?: boolean;
  recentDepression?: boolean;
  maritalStatus?: MaritalStatus;
}

export interface IMedicalReport {
  reportName: string;
  reportLine: string;
}

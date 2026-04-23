/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Robot {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'error';
  battery: number;
  lastActive: string;
  externalLink: string;
}

export interface KnowledgeItem {
  id: string;
  title: string;
  category: 'health' | 'security' | 'exercise' | 'emotion';
  updatedAt: string;
  externalLink: string;
}

export interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
}

export interface MedicalOrder {
  id: string;
  type: 'medication' | 'diet' | 'rehab' | 'checkup';
  content: string;
  frequency: string;
}

export interface HealthArchive {
  id: string;
  robotId: string;
  name: string;
  gender: 'male' | 'female';
  age: number;
  bloodType: string;
  height: number;
  weight: number;
  conditions: string[]; // 疾病标签
  diagnoses: string[]; // 诊断信息
  medications: { name: string; dosage: string; frequency: string }[];
  emergencyContacts: EmergencyContact[];
  medicalOrders: MedicalOrder[];
  lastExamDate: string;
}

export interface AlertRule {
  id: string;
  level: 'info' | 'warning' | 'critical';
  event: 'fall' | 'sudden_illness' | 'vital_anomaly';
  notifyPersons: string[];
  description: string;
}

export interface IndicatorThreshold {
  id: string;
  name: string;
  type: 'vital' | 'lab';
  unit: string;
  minVal: number;
  maxVal: number;
  templateName?: string;
}

export interface CareTask {
  id: string;
  patientName: string;
  type: 'medication' | 'measurement' | 'exercise' | 'emotion';
  status: 'pending' | 'completed' | 'failed';
  scheduledTime: string;
  robotName: string;
  content: string;
}

export interface SmartDevice {
  id: string;
  name: string;
  type: 'sensor' | 'gateway' | 'camera' | 'scale' | 'blood_pressure';
  status: 'online' | 'offline';
  lastSync: string;
  battery?: number;
}

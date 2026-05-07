/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Robot {
  id: string;
  sn: string; // SN码
  name: string;
  model: string; // 机器人型号
  status: 'online' | 'offline' | 'error' | 'standby' | 'working'; // 在线 / 离线 / 故障 / 待机 / 作业中
  enabled: boolean;
  battery: number;
  location: string; // 定位
  institutionType: 'hospital' | 'community' | 'home'; // 绑定机构类型
  institutionName: string; // 绑定机构名称 (科室/站点/姓名)
  onboardingMethod: 'auto' | 'qrcode' | 'batch'; // 入网方式: WiFi/4G/5G 自动配网、扫码绑定、批量导入
  lastActive: string;
  externalLink?: string;
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
  status?: 'active' | 'inactive';
}

export interface AlertRule {
  id: string;
  level: 'info' | 'warning' | 'critical';
  event: 'fall' | 'sudden_illness' | 'vital_anomaly' | 'routine_notice';
  notifyPersons: string[];
  description: string;
  enabled: boolean;
}

export interface IndicatorThreshold {
  id: string;
  name: string;
  type: 'vital' | 'lab';
  unit: string;
  minVal: number;
  maxVal: number;
  templateName?: string;
  enabled: boolean;
}

export interface CareTask {
  id: string;
  patientName: string;
  type: 'medication' | 'measurement' | 'exercise' | 'emotion';
  status: 'pending' | 'completed' | 'failed';
  scheduledTime: string;
  robotName: string;
  content: string;
  enabled: boolean;
}

export interface SmartDevice {
  id: string;
  name: string;
  type: 'sensor' | 'gateway' | 'camera' | 'scale' | 'blood_pressure';
  status: 'online' | 'offline';
  enabled: boolean;
  lastSync: string;
  battery?: number;
  sn?: string;
  robotId?: string;
  firmware?: string;
  readings?: {
    time: string;
    value: string;
    unit: string;
  }[];
  config?: {
    reportingInterval: number; // minutes
    sensitivity: string;
    mode: string;
  };
}

import { Robot, HealthArchive, AlertRule, IndicatorThreshold, CareTask, SmartDevice, SecurityEvent, NotificationRecord, RehabGuidance } from './types';

export const DISEASE_TAGS = ['高血压', '糖尿病', '冠心病', '高血脂', '心律不齐', '阿尔兹海默症', '帕金森', '哮喘'];
export const COMMON_DIAGNOSES = ['原发性高血压', '2型糖尿病', '骨质疏松', '慢性阻塞性肺疾病', '白内障', '类风湿性关节炎'];

export const MOCK_TASKS: CareTask[] = [
  { 
    id: 'T1', 
    patientName: '张大爷', 
    type: 'medication', 
    status: 'pending', 
    scheduledTime: '2026-04-20 10:30', 
    frequency: 'daily',
    robotName: '智护-A01', 
    content: '口服氨氯地平 5mg', 
    enabled: true,
    history: [
      { time: '2026-04-19 10:30', status: 'completed', remark: '服药顺利' },
      { time: '2026-04-18 10:30', status: 'completed' },
      { time: '2026-04-17 10:30', status: 'failed', remark: '老人外出' },
      { time: '2026-04-16 10:30', status: 'completed' }
    ]
  },
  { 
    id: 'T2', 
    patientName: '李奶奶', 
    type: 'measurement', 
    status: 'completed', 
    scheduledTime: '2026-04-20 09:00', 
    frequency: 'daily',
    robotName: '智护-A02', 
    content: '餐后血糖测量', 
    enabled: true,
    history: [
      { time: '2026-04-20 09:00', status: 'completed', remark: '测量值: 6.8 mmol/L' },
      { time: '2026-04-19 21:00', status: 'completed', remark: '睡前常规测量' },
      { time: '2026-04-19 09:00', status: 'completed', remark: '测量值: 7.2 mmol/L' },
      { time: '2026-04-18 09:00', status: 'completed', remark: '正常' }
    ]
  },
  { 
    id: 'T3', 
    patientName: '张大爷', 
    type: 'exercise', 
    status: 'failed', 
    scheduledTime: '2026-04-20 08:30', 
    frequency: 'weekly',
    robotName: '智护-A01', 
    content: '坐站平衡训练', 
    enabled: true,
    history: [
      { time: '2026-04-20 08:30', status: 'failed', remark: '老人身体不适，取消训练' },
      { time: '2026-04-13 08:30', status: 'completed', remark: '完成良好，坚持了15分钟' },
      { time: '2026-04-06 08:30', status: 'completed' }
    ]
  },
  { 
    id: 'T4', 
    patientName: '王五', 
    type: 'medication', 
    status: 'pending', 
    scheduledTime: '2026-04-20 12:00', 
    frequency: 'daily',
    robotName: '智护-B05', 
    content: '胰岛素注射 10U', 
    enabled: true,
    history: [
      { time: '2026-04-19 12:00', status: 'completed' }
    ]
  },
  { 
    id: 'T5', 
    patientName: '赵老师', 
    type: 'measurement', 
    status: 'pending', 
    scheduledTime: '2026-04-20 14:00', 
    frequency: 'daily',
    robotName: '智护-A01', 
    content: '血氧饱和度监测', 
    enabled: true,
    history: [
      { time: '2026-04-19 14:00', status: 'completed', remark: '监测值 98%' }
    ]
  },
  { 
    id: 'T6', 
    patientName: '孙奶奶', 
    type: 'exercise', 
    status: 'completed', 
    scheduledTime: '2026-04-20 15:30', 
    frequency: 'weekly',
    robotName: '智护-A03', 
    content: '认知功能康复游戏', 
    enabled: true,
    history: [
      { time: '2026-04-13 15:30', status: 'skipped', remark: '医生建议休息' },
      { time: '2026-04-06 15:30', status: 'completed' }
    ]
  },
  {
    id: 'T7',
    patientName: '张大爷',
    type: 'medication',
    status: 'pending',
    scheduledTime: '2026-04-21 08:00',
    frequency: 'three_times_daily',
    robotName: '智护-A01',
    content: '餐后助消化药 (早/中/晚)',
    enabled: true,
    history: [
      { time: '2026-04-20 18:30', status: 'completed', remark: '晚间服药，状态良好' },
      { time: '2026-04-20 12:30', status: 'completed', remark: '午间服药' },
      { time: '2026-04-20 07:30', status: 'completed', remark: '早起服药' }
    ]
  },
  {
    id: 'T8',
    patientName: '孙奶奶',
    type: 'measurement',
    status: 'pending',
    scheduledTime: '2026-04-21 09:00',
    frequency: 'three_times_daily',
    robotName: '智护-A03',
    content: '关节活动度监测 (三测/日)',
    enabled: true,
    history: [
      { time: '2026-04-20 16:00', status: 'completed', remark: '下午测量值正常' },
      { time: '2026-04-20 11:00', status: 'failed', remark: '设备连接失败' }
    ]
  },
  {
    id: 'T9',
    patientName: '李奶奶',
    type: 'medication',
    status: 'pending',
    scheduledTime: '2026-04-21 12:00',
    frequency: 'daily',
    robotName: '智护-A02',
    content: '口服阿司匹林 100mg',
    enabled: true,
    history: [
      { time: '2026-04-20 12:00', status: 'completed', remark: '餐后按时服用' },
      { time: '2026-04-19 12:00', status: 'completed' }
    ]
  }
];

export const MOCK_DEVICES: SmartDevice[] = [
  { 
    id: 'D1', 
    name: '客厅毫米波雷达', 
    type: 'sensor', 
    status: 'online', 
    enabled: true, 
    lastSync: '1分钟前', 
    battery: 92,
    sn: 'SN-RADAR-001',
    robotId: '1',
    firmware: 'v2.4.1',
    readings: [
      { time: '10:00', value: '1', unit: '人' },
      { time: '10:05', value: '1', unit: '人' },
      { time: '10:10', value: '0', unit: '人' },
      { time: '10:15', value: '1', unit: '人' },
    ],
    config: { reportingInterval: 5, sensitivity: '高', mode: '实时监测' }
  },
  { 
    id: 'D2', 
    name: '智能网关-A1', 
    type: 'gateway', 
    status: 'online', 
    enabled: true, 
    lastSync: '实时',
    sn: 'SN-GW-882',
    robotId: '1',
    firmware: 'v5.0.2',
    config: { reportingInterval: 1, sensitivity: '中', mode: '网关模式' }
  },
  { 
    id: 'D3', 
    name: '卧室高清摄像头', 
    type: 'camera', 
    status: 'offline', 
    enabled: true, 
    lastSync: '1小时前',
    sn: 'SN-CAM-991',
    robotId: '2',
    firmware: 'v1.2.0',
    config: { reportingInterval: 0, sensitivity: '智能', mode: '移动侦测' }
  },
  { 
    id: 'D4', 
    name: '蓝牙体重秤', 
    type: 'scale', 
    status: 'online', 
    enabled: false, 
    lastSync: '昨日', 
    battery: 15,
    sn: 'SN-SCALE-332',
    robotId: '2',
    firmware: 'v1.0.1',
    readings: [
      { time: '昨日 08:00', value: '72.5', unit: 'kg' },
      { time: '04-18 08:30', value: '72.8', unit: 'kg' },
    ],
    config: { reportingInterval: 0, sensitivity: '高', mode: '自动同步' }
  },
  { 
    id: 'D5', 
    name: '欧姆龙血压计', 
    type: 'blood_pressure', 
    status: 'online', 
    enabled: true, 
    lastSync: '3小时前',
    sn: 'SN-BP-112',
    robotId: '1',
    firmware: 'v3.1.4',
    readings: [
      { time: '14:00', value: '120/80', unit: 'mmHg' },
      { time: '前日 15:30', value: '125/82', unit: 'mmHg' },
    ],
    config: { reportingInterval: 0, sensitivity: '医疗级', mode: '双人模式' }
  },
];

export const MOCK_ROBOTS: Robot[] = [
  { 
    id: '1', 
    sn: 'JH-SN-8801', 
    name: '智护-A01', 
    model: 'JH-Alpha V1',
    status: 'online', 
    enabled: true,
    battery: 85, 
    location: '张大爷家-客厅', 
    institutionType: 'home', 
    institutionName: '张大爷家中',
    onboardingMethod: 'auto',
    lastActive: '1分钟前' 
  },
  { 
    id: '2', 
    sn: 'JH-SN-8802', 
    name: '智护-A02', 
    model: 'JH-Alpha V1',
    status: 'working', 
    enabled: true,
    battery: 42, 
    location: '康复中心-走廊', 
    institutionType: 'hospital', 
    institutionName: '中心医院康复科',
    onboardingMethod: 'batch',
    lastActive: '实时' 
  },
  { 
    id: '3', 
    sn: 'JH-SN-9201', 
    name: '智护-B05', 
    model: 'JH-Beta V2',
    status: 'error', 
    enabled: false,
    battery: 12, 
    location: '社区站-充电位', 
    institutionType: 'community', 
    institutionName: '幸福里社区站点',
    onboardingMethod: 'qrcode',
    lastActive: '2小时前' 
  },
  { 
    id: '4', 
    sn: 'JH-SN-2023', 
    name: '智护-A03', 
    model: 'JH-Alpha V2',
    status: 'online', 
    enabled: true,
    battery: 98, 
    location: '赵老师家-卧室', 
    institutionType: 'home', 
    institutionName: '赵老师家中',
    onboardingMethod: 'auto',
    lastActive: '刚刚' 
  },
  { 
    id: '5', 
    sn: 'JH-SN-1024', 
    name: '智护-C01', 
    model: 'JH-Eco V1',
    status: 'offline', 
    enabled: true,
    battery: 100, 
    location: '陈伯家-餐厅', 
    institutionType: 'home', 
    institutionName: '陈伯家中',
    onboardingMethod: 'auto',
    lastActive: '昨日' 
  },
];

export const MOCK_ARCHIVES: HealthArchive[] = [
  { 
    id: '1', 
    robotId: '1', 
    name: '张大爷', 
    gender: 'male', 
    age: 78, 
    bloodType: 'A+', 
    height: 172, 
    weight: 68, 
    conditions: ['高血压', '糖尿病'],
    diagnoses: ['原发性高血压 III级', '2型糖尿病 (稳定期)'],
    medications: [
      { name: '氨氯地平', dosage: '5mg', frequency: '1次/日' },
      { name: '二甲双胍', dosage: '0.5g', frequency: '2次/日' }
    ],
    emergencyContacts: [
      { name: '张远', relation: '长子', phone: '13812345678' },
      { name: '居委会小王', relation: '社区网格员', phone: '13566667777' }
    ],
    medicalOrders: [
      { id: 'O1', type: 'medication', content: '规律服用降压药', frequency: '1次/日' },
      { id: 'O2', type: 'checkup', content: '心电图复查', frequency: '1次/月' }
    ],
    lastExamDate: '2026-03-20',
    status: 'active',
    updatedAt: { seconds: 1713580800, nanoseconds: 0 } // 2024-04-20
  },
  { 
    id: '2', 
    robotId: '2', 
    name: '李奶奶', 
    gender: 'female', 
    age: 82, 
    bloodType: 'O', 
    height: 158, 
    weight: 52, 
    conditions: ['心律不齐'],
    diagnoses: ['阵发性心房颤动', '双膝骨关节炎'],
    medications: [
      { name: '阿司匹林', dosage: '100mg', frequency: '1次/日' }
    ],
    emergencyContacts: [
      { name: '李梅', relation: '女儿', phone: '13987654321' }
    ],
    medicalOrders: [
      { id: 'O3', type: 'rehab', content: '膝关节屈伸训练', frequency: '2次/日' }
    ],
    lastExamDate: '2026-04-05',
    status: 'active',
    updatedAt: { seconds: 1713667200, nanoseconds: 0 } // 2024-04-21
  },
  { 
    id: '3', 
    robotId: '4', 
    name: '赵老师', 
    gender: 'male', 
    age: 72, 
    bloodType: 'B-', 
    height: 168, 
    weight: 75, 
    conditions: ['阿尔兹海默症'],
    diagnoses: ['阿尔兹海默症初期', '慢性胃炎'],
    medications: [
      { name: '多奈哌齐', dosage: '5mg', frequency: '1次/日' },
      { name: '铝碳酸镁', dosage: '1g', frequency: '3次/日' }
    ],
    emergencyContacts: [
      { name: '赵大兵', relation: '长子', phone: '13700008888' }
    ],
    medicalOrders: [
      { id: 'O4', type: 'checkup', content: '胃镜检查', frequency: '其他' }
    ],
    lastExamDate: '2026-01-12',
    status: 'active',
    updatedAt: { seconds: 1712803200, nanoseconds: 0 } // 2024-04-11
  },
  { 
    id: '4', 
    robotId: '1', 
    name: '孙奶奶', 
    gender: 'female', 
    age: 75, 
    bloodType: 'AB+', 
    height: 162, 
    weight: 58, 
    conditions: ['冠心病', '骨质疏松'],
    diagnoses: ['冠状动脉支架置入术后', '原发性骨质疏松症'],
    medications: [
      { name: '氯吡格雷', dosage: '75mg', frequency: '1次/日' },
      { name: '阿仑膦酸钠', dosage: '70mg', frequency: '1次/周' }
    ],
    emergencyContacts: [
      { name: '孙志刚', relation: '养子', phone: '13611112222' }
    ],
    medicalOrders: [
      { id: 'O5', type: 'diet', content: '高钙低糖饮食', frequency: '3次/日' }
    ],
    lastExamDate: '2026-05-02',
    status: 'active',
    updatedAt: { seconds: 1714656000, nanoseconds: 0 } // 2024-05-02
  },
  { 
    id: '5', 
    robotId: '5', 
    name: '陈伯', 
    gender: 'male', 
    age: 80, 
    bloodType: 'A', 
    height: 175, 
    weight: 82, 
    conditions: ['帕金森', '高血脂'],
    diagnoses: ['帕金森病 (中晚期)', '高脂血症'],
    medications: [
      { name: '多巴丝肼', dosage: '125mg', frequency: '3次/日' },
      { name: '阿托伐他汀', dosage: '20mg', frequency: '1次/日' }
    ],
    emergencyContacts: [
      { name: '陈美丽', relation: '孙女', phone: '13599990000' }
    ],
    medicalOrders: [
      { id: 'O6', type: 'rehab', content: '手部精细动作训练', frequency: '2次/日' }
    ],
    lastExamDate: '2026-04-20',
    status: 'active',
    updatedAt: { seconds: 1713580800, nanoseconds: 0 } // 2024-04-20
  }
];

export const MOCK_ALERTS: AlertRule[] = [
  { id: '1', level: 'critical', event: 'fall', notifyPersons: ['长子', '社区网格员'], description: '雷达监测到老人跌倒，语音交互无应答，已启动紧急预案', enabled: true },
  { id: '2', level: 'critical', event: 'sudden_illness', notifyPersons: ['女儿', '120急救'], description: '监测到突发性剧烈疼痛报警，疑似急性心脏病发作', enabled: true },
  { id: '3', level: 'critical', event: 'sudden_illness', notifyPersons: ['老伴', '社区医院'], description: '红外光电传感器监测到意识水平下降，生命体征波动剧烈', enabled: true },
  { id: '4', level: 'warning', event: 'vital_anomaly', notifyPersons: ['子女'], description: '收缩压超过160mmHg，持续3次测量未见下降', enabled: true },
  { id: '5', level: 'warning', event: 'vital_anomaly', notifyPersons: ['医生'], description: '静息心率超过110次/分，触发长期房颤监测预警', enabled: true },
  { id: '6', level: 'warning', event: 'vital_anomaly', notifyPersons: ['子女', '医生'], description: '血氧饱和度持续低于90%，建议立即进行吸氧处理', enabled: true },
  { id: '7', level: 'info', event: 'routine_notice', notifyPersons: ['子女'], description: '早晨8:00降压药服用任务已按时完成', enabled: true },
  { id: '8', level: 'info', event: 'routine_notice', notifyPersons: ['长子'], description: '康复训练目标（每日3000步）已于16:00提前达成', enabled: true },
  { id: '9', level: 'info', event: 'routine_notice', notifyPersons: ['家人'], description: '晚间睡前洗漱及环境安防检查任务已完成确认', enabled: true },
];

export const MOCK_SECURITY_EVENTS: SecurityEvent[] = [
  { id: 'SE1', type: 'fall', patientName: '张大爷', location: '客厅', time: '2026-04-20 10:30', status: 'resolved', description: '雷达监测到跌倒事件人员，姿态异常且无应答', deviceId: 'RADAR-001' },
  { id: 'SE2', type: 'vital_anomaly', patientName: '李奶奶', location: '卧室', time: '2026-04-20 11:15', status: 'active', description: '心率异常：115 bpm' },
  { id: 'SE3', type: 'environment', patientName: '王五', location: '厨房', time: '2026-04-20 08:45', status: 'resolved', description: '烟雾预警触发' },
  { id: 'SE4', type: 'fall', patientName: '陈伯', location: '浴室', time: '2026-04-21 21:00', status: 'active', description: '毫米波雷达监测到在浴室内长时间静止且姿态降低' },
  { id: 'SE5', type: 'vital_anomaly', patientName: '赵老师', location: '卧室', time: '2026-05-01 02:30', status: 'resolved', description: '夜间呼吸道阻塞风险预警，血氧降至88%' },
];

export const MOCK_NOTIFICATIONS: NotificationRecord[] = [
  { id: 'N1', eventId: 'SE1', recipient: '张晓刚', relation: '儿子', method: 'phone', level: 'L3', sentTime: '10:30:05', confirmed: true, confirmTime: '10:31:20', remark: '已通过电话确认安全' },
  { id: 'N2', eventId: 'SE1', recipient: '王主任', relation: '网格员', method: 'app', level: 'L3', sentTime: '10:30:10', confirmed: true, confirmTime: '10:35:00', remark: '上门走访中' },
  { id: 'N3', eventId: 'SE2', recipient: '李敏', relation: '女儿', method: 'sms', level: 'L2', sentTime: '11:15:20', confirmed: false, remark: '未读' },
  { id: 'N4', eventId: 'SE2', recipient: '张医生', relation: '签约医生', method: 'app', level: 'L2', sentTime: '11:15:25', confirmed: true, confirmTime: '11:20:00', remark: '建议老人休息并复测' },
  { id: 'N5', eventId: 'SE3', recipient: '王五', relation: '本人', method: 'speaker', level: 'L1', sentTime: '08:45:10', confirmed: true, confirmTime: '08:45:30', remark: '已回应，误报' },
];

export const MOCK_REHAB_GUIDANCE: RehabGuidance[] = [
  { 
    id: 'RG1', 
    category: 'medication', 
    diseaseType: '高血压', 
    title: '降压药服用指导', 
    content: '按时服用长效降压药，避免漏服，建议早晨固定时间服用。', 
    frequency: '1次/日',
    targetAudience: '高血压患者',
    isEnabled: true,
    updatedAt: '2026-05-01'
  },
  { 
    id: 'RG2', 
    category: 'exercise', 
    diseaseType: '冠心病', 
    title: '适度有氧运动方案', 
    content: '推荐散步、太极拳等中低强度运动，心率不宜过快。', 
    frequency: '3-4次/周',
    targetAudience: '心脏病康复期',
    isEnabled: true,
    updatedAt: '2026-05-03'
  },
  { 
    id: 'RG3', 
    category: 'diet', 
    diseaseType: '糖尿病', 
    title: '低糖膳食原则', 
    content: '控制碳水化合物摄入，多食粗粮和蔬菜，少量多餐。', 
    frequency: '每餐',
    targetAudience: '糖尿病患者',
    isEnabled: true,
    updatedAt: '2026-04-28'
  },
  { 
    id: 'RG4', 
    category: 'nursing', 
    diseaseType: '骨关节炎', 
    title: '居家关节护理', 
    content: '注意关节保暖，避免剧烈上下楼梯，适度按摩舒缓。', 
    frequency: '早晚',
    targetAudience: '膝关节炎老人',
    isEnabled: true,
    updatedAt: '2026-05-05'
  },
  { 
    id: 'RG5', 
    category: 'followup', 
    diseaseType: '普遍慢性病', 
    title: '定期健康档案复查', 
    content: '每季度进行一次生命体征全项检查，更新健康档案记录。', 
    frequency: '每季度',
    targetAudience: '所有签约老人',
    isEnabled: true,
    updatedAt: '2026-05-06'
  },
];

export const MOCK_THRESHOLDS: IndicatorThreshold[] = [
  { id: '1', name: '收缩压(SBP)', type: 'vital', unit: 'mmHg', minVal: 90, maxVal: 140, templateName: '标准成人', enabled: true },
  { id: '2', name: '舒张压(DBP)', type: 'vital', unit: 'mmHg', minVal: 60, maxVal: 90, templateName: '标准成人', enabled: true },
  { id: '3', name: '空腹血糖', type: 'lab', unit: 'mmol/L', minVal: 3.9, maxVal: 6.1, templateName: '标准成人', enabled: true },
  { id: '4', name: '静息心率', type: 'vital', unit: '次/分', minVal: 60, maxVal: 100, templateName: '标准成人', enabled: true },
  { id: '5', name: '血氧饱和度(SpO2)', type: 'vital', unit: '%', minVal: 95, maxVal: 100, templateName: '标准成人', enabled: true },
  { id: '6', name: '体温', type: 'vital', unit: '℃', minVal: 36.1, maxVal: 37.2, templateName: '标准成人', enabled: true },
];

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Bot, 
  UserCircle, 
  BellRing, 
  Activity, 
  ChevronRight, 
  Plus, 
  Settings,
  ExternalLink,
  Shield,
  AlertCircle,
  FileText,
  Heart,
  Brain,
  Trash2,
  PlusCircle,
  UserPlus,
  Pause,
  RotateCcw,
  Edit3,
  ChevronDown,
  LayoutDashboard,
  Library,
  Settings2
} from 'lucide-react';
import { 
  motion, 
  AnimatePresence 
} from 'motion/react';
import { cn } from './lib/utils';
import { Robot, HealthArchive, AlertRule, IndicatorThreshold, CareTask, SmartDevice, MedicalOrder } from './types';
import { 
  ClipboardList,
  Cpu,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Wifi,
  BatteryMedium,
  Smartphone,
  Video,
  Scale
} from 'lucide-react';

// Mock Data Constants
const DISEASE_TAGS = ['高血压', '糖尿病', '冠心病', '高血脂', '心律不齐', '阿尔兹海默症', '帕金森', '哮喘'];
const COMMON_DIAGNOSES = ['原发性高血压', '2型糖尿病', '骨质疏松', '慢性阻塞性肺疾病', '白内障', '类风湿性关节炎'];

const MOCK_TASKS: CareTask[] = [
  { id: 'T1', patientName: '张大爷', type: 'medication', status: 'pending', scheduledTime: '2026-04-20 10:30', robotName: '智护-A01', content: '口服氨氯地平 5mg' },
  { id: 'T2', patientName: '李奶奶', type: 'measurement', status: 'completed', scheduledTime: '2026-04-20 09:00', robotName: '智护-A02', content: '餐后血糖测量' },
  { id: 'T3', patientName: '张大爷', type: 'exercise', status: 'failed', scheduledTime: '2026-04-20 08:30', robotName: '智护-A01', content: '坐站平衡训练' },
];

const MOCK_DEVICES: SmartDevice[] = [
  { id: 'D1', name: '客厅毫米波雷达', type: 'sensor', status: 'online', lastSync: '1分钟前', battery: 92 },
  { id: 'D2', name: '智能网关-A1', type: 'gateway', status: 'online', lastSync: '实时' },
  { id: 'D3', name: '卧室高清摄像头', type: 'camera', status: 'offline', lastSync: '1小时前' },
  { id: 'D4', name: '蓝牙体重秤', type: 'scale', status: 'online', lastSync: '昨日', battery: 15 },
  { id: 'D5', name: '欧姆龙血压计', type: 'blood_pressure', status: 'online', lastSync: '3小时前' },
];

const MOCK_ROBOTS: Robot[] = [
  { id: '1', name: '智护-A01', status: 'online', battery: 85, lastActive: '2026-04-20 09:30', externalLink: 'https://robot-cloud.jiahe.com/device/1' },
  { id: '2', name: '智护-A02', status: 'online', battery: 42, lastActive: '2026-04-20 09:28', externalLink: 'https://robot-cloud.jiahe.com/device/2' },
  { id: '3', name: '智护-B05', status: 'error', battery: 12, lastActive: '2026-04-19 22:15', externalLink: 'https://robot-cloud.jiahe.com/device/3' },
];

const MOCK_ARCHIVES: HealthArchive[] = [
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
      { id: 'O1', type: 'medication', content: '规律服用降压药', frequency: '每日早8点' },
      { id: 'O2', type: 'checkup', content: '心电图复查', frequency: '每季度一次' }
    ],
    lastExamDate: '2026-03-20'
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
      { id: 'O3', type: 'rehab', content: '膝关节屈伸训练', frequency: '每日两次' }
    ],
    lastExamDate: '2026-04-05'
  }
];

const MOCK_ALERTS: AlertRule[] = [
  { id: '1', level: 'critical', event: 'fall', notifyPersons: ['子女', '社区物业'], description: '雷达监测跌倒且语音确认无应答' },
  { id: '2', level: 'warning', event: 'vital_anomaly', notifyPersons: ['子女'], description: '静息心率超过100次/分或血氧低于92%' },
];

const MOCK_THRESHOLDS: IndicatorThreshold[] = [
  { id: '1', name: '收缩压(SBP)', type: 'vital', unit: 'mmHg', minVal: 90, maxVal: 140, templateName: '标准成人' },
  { id: '2', name: '空腹血糖', type: 'lab', unit: 'mmol/L', minVal: 3.9, maxVal: 6.1, templateName: '标准成人' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('archives');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['care', 'device', 'config']);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) ? prev.filter(g => g !== groupId) : [...prev, groupId]
    );
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col z-50 shadow-xl",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          {sidebarOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 font-bold text-lg text-white tracking-tight"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Bot size={20} className="text-white" />
              </div>
              <span className="truncate">嘉和智健 <span className="text-blue-400">OS</span></span>
            </motion.div>
          )}
          {!sidebarOpen && <Bot className="w-8 h-8 text-blue-400 mx-auto" />}
        </div>

        <nav className="flex-1 py-4 space-y-2 px-3 overflow-y-auto custom-scrollbar">
          <NavSubGroup 
            icon={<Shield size={18} />} 
            label="精细化看护" 
            id="care" 
            isOpen={expandedGroups.includes('care')} 
            onToggle={() => toggleGroup('care')}
            collapsed={!sidebarOpen}
          >
            <NavItem label="健康档案管理" id="archives" active={activeTab === 'archives'} onClick={() => setActiveTab('archives')} collapsed={!sidebarOpen} />
            <NavItem label="计划任务管理" id="tasks" active={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} collapsed={!sidebarOpen} />
          </NavSubGroup>

          <NavSubGroup 
            icon={<Cpu size={18} />} 
            label="物联设备网" 
            id="device" 
            isOpen={expandedGroups.includes('device')} 
            onToggle={() => toggleGroup('device')}
            collapsed={!sidebarOpen}
          >
            <NavItem label="智能设备管理" id="devices" active={activeTab === 'devices'} onClick={() => setActiveTab('devices')} collapsed={!sidebarOpen} />
          </NavSubGroup>

          <NavSubGroup 
            icon={<Settings size={18} />} 
            label="策略与规则" 
            id="config" 
            isOpen={expandedGroups.includes('config')} 
            onToggle={() => toggleGroup('config')}
            collapsed={!sidebarOpen}
          >
            <NavItem label="预警规则管理" id="alerts" active={activeTab === 'alerts'} onClick={() => setActiveTab('alerts')} collapsed={!sidebarOpen} />
            <NavItem label="指标阈值管理" id="thresholds" active={activeTab === 'thresholds'} onClick={() => setActiveTab('thresholds')} collapsed={!sidebarOpen} />
          </NavSubGroup>

          {sidebarOpen && (
            <div className="pt-4 mt-4 border-t border-slate-800/50">
              <div className="text-[10px] text-slate-500 font-bold px-3 py-2 uppercase tracking-widest">外部跳转</div>
              <a 
                href="#" 
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all"
              >
                <LayoutDashboard size={18} />
                <span>机器人管理后台</span>
                <ExternalLink size={12} className="ml-auto opacity-40" />
              </a>
              <a 
                href="#" 
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all"
              >
                <Library size={18} />
                <span>医疗知识库</span>
                <ExternalLink size={12} className="ml-auto opacity-40" />
              </a>
            </div>
          )}
        </nav>

        <div className="p-4 border-t border-slate-800">
          {sidebarOpen && (
            <div className="mb-4 px-3 text-[10px] text-slate-500 uppercase tracking-widest leading-loose">
              <div className="flex justify-between"><span>版本号</span><span className="text-slate-400">v1.0.2</span></div>
              <div className="flex justify-between"><span>发布日期</span><span className="text-slate-400">2026-04-18</span></div>
            </div>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full h-10 flex items-center justify-center rounded-lg hover:bg-slate-800 text-slate-400 transition-colors"
          >
            {sidebarOpen ? <ChevronRight className="rotate-180" /> : <ChevronRight />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-40">
          <div className="flex items-center gap-4 text-sm font-medium">
            <span className="text-slate-400">工作台</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-bold">
              {activeTab === 'archives' && '健康档案管理'}
              {activeTab === 'devices' && '智能设备管理'}
              {activeTab === 'tasks' && '计划任务管理'}
              {activeTab === 'alerts' && '预警规则管理'}
              {activeTab === 'thresholds' && '指标阈值管理'}
            </span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-slate-600 font-medium">看护引擎运行中</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-600 font-bold text-xs shadow-inner">
                Z
              </div>
              <span className="text-sm font-semibold text-slate-700">管理员 张三</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'tasks' && <TaskMgmtView key="tasks" />}
            {activeTab === 'devices' && <SmartDeviceMgmtView key="devices" />}
            {activeTab === 'archives' && <ArchivesView key="archives" />}
            {activeTab === 'alerts' && <AlertsView key="alerts" />}
            {activeTab === 'thresholds' && <ThresholdsView key="thresholds" />}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function NavItem({ label, active, onClick, collapsed, icon }: { label: string, id: string, active: boolean, onClick: () => void, collapsed: boolean, icon?: React.ReactNode }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 rounded-lg text-sm font-medium transition-all group relative",
        collapsed ? "px-3 py-2.5" : "px-4 py-2 pl-10",
        active 
          ? "text-blue-400 bg-blue-600/5" 
          : "text-slate-400 hover:text-slate-200"
      )}
    >
      {icon && (
        <div className={cn("transition-transform", active ? "scale-105" : "group-hover:scale-105")}>
          {icon}
        </div>
      )}
      {!collapsed && <span>{label}</span>}
      {collapsed && (
        <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-[100] border border-slate-700">
          {label}
        </div>
      )}
    </button>
  );
}

function NavSubGroup({ 
  icon, 
  label, 
  isOpen, 
  onToggle, 
  children, 
  collapsed 
}: { 
  icon: React.ReactNode, 
  label: string, 
  id: string, 
  isOpen: boolean, 
  onToggle: () => void, 
  children: React.ReactNode,
  collapsed: boolean
}) {
  return (
    <div className="space-y-1">
      <button 
        onClick={onToggle}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all group relative",
          isOpen ? "text-slate-100" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
        )}
      >
        <div className="transition-transform group-hover:scale-110">
          {icon}
        </div>
        {!collapsed && (
          <>
            <span>{label}</span>
            <ChevronDown 
              size={14} 
              className={cn("ml-auto transition-transform duration-300", isOpen ? "" : "-rotate-90 opacity-40")} 
            />
          </>
        )}
      </button>
      
      {isOpen && !collapsed && (
        <div className="space-y-1">
          {children}
        </div>
      )}
    </div>
  );
}

// --- Views ---

function TaskMgmtView() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h3 className="font-bold text-lg text-slate-800">实时计划任务</h3>
          <p className="text-xs text-slate-400">基于医嘱生成的自动化看护任务执行状态</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200">导出报表</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center gap-2">
            <Plus size={18} /> 手动派发任务
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">开始执行时间</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">看护对象</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">任务内容</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">执行机器人</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">状态</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MOCK_TASKS.map((task) => (
              <tr key={task.id} className="hover:bg-slate-50/50 transition-colors group text-sm">
                <td className="px-6 py-4 font-mono text-slate-500">{task.scheduledTime}</td>
                <td className="px-6 py-4 font-bold text-slate-700">{task.patientName}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "p-1.5 rounded-lg",
                      task.type === 'medication' ? 'bg-blue-50 text-blue-600' :
                      task.type === 'measurement' ? 'bg-green-50 text-green-600' :
                      task.type === 'exercise' ? 'bg-purple-50 text-purple-600' : 'bg-pink-50 text-pink-600'
                    )}>
                      {task.type === 'medication' && <CheckCircle2 size={14} />}
                      {task.type === 'measurement' && <Activity size={14} />}
                      {task.type === 'exercise' && <Activity size={14} />}
                    </span>
                    {task.content}
                  </div>
                </td>
                <td className="px-6 py-4 flex items-center gap-2">
                  <Bot size={14} className="text-slate-400" />
                  {task.robotName}
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase",
                    task.status === 'completed' ? 'bg-green-100 text-green-700' : 
                    task.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  )}>
                    {task.status === 'completed' ? '已完成' : task.status === 'failed' ? '执行失败' : '排队中'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button title="暂停" className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors">
                      <Pause size={16} />
                    </button>
                    <button title="编辑" className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit3 size={16} />
                    </button>
                    <button title="重启" className="p-1.5 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors">
                      <RotateCcw size={16} />
                    </button>
                    <button title="删除" className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function SmartDeviceMgmtView() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-4">
          <h3 className="font-bold text-lg">全屋智能传感器与外设</h3>
          <div className="flex gap-2">
            <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 bg-green-50 text-green-600 rounded-full font-bold">4 在线</span>
            <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 bg-red-50 text-red-600 rounded-full font-bold">1 离线</span>
          </div>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
          <Wifi size={18} /> 搜索新设备
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_DEVICES.map((device) => (
          <div key={device.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 group relative text-sm">
            <div className="flex items-start justify-between mb-4">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center",
                device.status === 'online' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'
              )}>
                {device.type === 'sensor' && <Wifi size={24} />}
                {device.type === 'gateway' && <Smartphone size={24} />}
                {device.type === 'camera' && <Video size={24} />}
                {device.type === 'scale' && <Scale size={24} />}
                {device.type === 'blood_pressure' && <Activity size={24} />}
              </div>
              <div className="text-right">
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest",
                  device.status === 'online' ? 'text-green-500' : 'text-slate-300'
                )}>
                  {device.status === 'online' ? 'Online' : 'Offline'}
                </span>
                <p className="text-[10px] text-slate-400 mt-1">SN: {device.id}</p>
              </div>
            </div>

            <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{device.name}</h4>
            <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">最后同步</span>
                  <span className="text-xs font-semibold text-slate-600">{device.lastSync}</span>
                </div>
                {device.battery !== undefined && (
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">电量</span>
                    <div className="flex items-center gap-1">
                      <BatteryMedium size={12} className={cn(device.battery < 20 ? 'text-red-500' : 'text-green-500')} />
                      <span className="text-xs font-semibold text-slate-600">{device.battery}%</span>
                    </div>
                  </div>
                )}
              </div>
              <button className="p-2 text-slate-300 hover:text-blue-600 transition-colors">
                <Settings size={18} />
              </button>
            </div>
          </div>
        ))}
        <div className="border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-8 text-slate-400 hover:text-blue-500 hover:border-blue-300 transition-all cursor-pointer bg-slate-50/30">
          <Plus size={32} className="mb-2" />
          <span className="text-sm font-bold uppercase tracking-widest">添加蓝牙/Zigbee设备</span>
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({ title, value, sub, icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-start justify-between">
      <div>
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">{title}</p>
        <h4 className="text-2xl font-bold text-slate-900 mb-1 leading-none">{value}</h4>
        <p className="text-[10px] text-slate-400 font-medium">{sub}</p>
      </div>
      <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 shadow-sm">
        {icon}
      </div>
    </div>
  );
}

function ArchivesView() {
  const [archives, setArchives] = useState<HealthArchive[]>(MOCK_ARCHIVES);
  const [selectedArchive, setSelectedArchive] = useState<HealthArchive | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<HealthArchive | null>(null);

  const startEdit = (archive: HealthArchive) => {
    setEditForm({ ...archive });
    setIsEditing(true);
    setSelectedArchive(archive);
  };

  const saveEdit = () => {
    if (editForm) {
      setArchives(prev => prev.map(a => a.id === editForm.id ? editForm : a));
      setSelectedArchive(editForm);
      setIsEditing(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    if (!selectedArchive) setEditForm(null);
  };

  const handleTagToggle = (tag: string) => {
    if (!editForm) return;
    const tags = editForm.conditions.includes(tag)
      ? editForm.conditions.filter(t => t !== tag)
      : [...editForm.conditions, tag];
    setEditForm({ ...editForm, conditions: tags });
  };

  const addEmergencyContact = () => {
    if (!editForm) return;
    const newContacts = [...editForm.emergencyContacts, { name: '', relation: '', phone: '' }];
    setEditForm({ ...editForm, emergencyContacts: newContacts });
  };

  const removeEmergencyContact = (index: number) => {
    if (!editForm) return;
    const newContacts = editForm.emergencyContacts.filter((_, i) => i !== index);
    setEditForm({ ...editForm, emergencyContacts: newContacts });
  };

  const addDiagnosis = () => {
    if (!editForm) return;
    setEditForm({ ...editForm, diagnoses: [...editForm.diagnoses, ''] });
  };

  const removeDiagnosis = (index: number) => {
    if (!editForm) return;
    setEditForm({ ...editForm, diagnoses: editForm.diagnoses.filter((_, i) => i !== index) });
  };

  const addMedicalOrder = () => {
    if (!editForm) return;
    const newOrder: MedicalOrder = { id: `O${Date.now()}`, type: 'medication', content: '', frequency: '' };
    setEditForm({ ...editForm, medicalOrders: [...editForm.medicalOrders, newOrder] });
  };

  const removeMedicalOrder = (id: string) => {
    if (!editForm) return;
    setEditForm({ ...editForm, medicalOrders: editForm.medicalOrders.filter(o => o.id !== id) });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="space-y-4 h-full"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-slate-500 text-sm">共有 {archives.length} 条健康档案数据</h3>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-transform hover:scale-105 active:scale-95">
          <Plus size={18} /> 新建档案
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {archives.map((person) => (
          <div 
            key={person.id} 
            className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex gap-6 hover:border-blue-400 transition-all hover:shadow-md cursor-pointer group"
            onClick={() => { setSelectedArchive(person); setIsEditing(false); }}
          >
            <div className="w-24 h-24 rounded-xl bg-slate-50 border border-slate-100 flex-shrink-0 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 transition-colors">
              <UserCircle size={48} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xl font-bold text-slate-800">{person.name} <span className="text-sm font-normal text-slate-400 ml-2">{person.age}岁 / {person.gender === 'male' ? '男' : '女'}</span></h4>
                <div className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded">ID: {person.id}</div>
              </div>
              <div className="grid grid-cols-2 gap-y-3 mb-4">
                <div className="text-xs col-span-2">
                  <span className="text-slate-400">疾病标签:</span> 
                  <div className="flex flex-wrap gap-1 mt-1.5 font-medium">
                    {person.conditions.map(c => <span key={c} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px]">{c}</span>)}
                    {person.conditions.length === 0 && <span className="text-slate-300 italic">暂无标签</span>}
                  </div>
                </div>
                <div className="text-xs">
                  <span className="text-slate-400">主要诊断:</span> 
                  <span className="ml-2 font-semibold text-slate-700 truncate block mt-1">{person.diagnoses[0] || '暂无临床诊断'}</span>
                </div>
                <div className="text-xs">
                  <span className="text-slate-400">第一联系人:</span> 
                  <span className="ml-2 font-semibold text-slate-700 block mt-1">{person.emergencyContacts[0]?.name || '未填'} ({person.emergencyContacts[0]?.phone || '-'})</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-50">
                <span>绑定机器人: {MOCK_ROBOTS.find(r => r.id === person.robotId)?.name || '未绑定'}</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); startEdit(person); }}
                  className="text-blue-500 font-bold hover:text-blue-600 transition-colors"
                >
                  编辑档案 →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail & Edit Modal */}
      {selectedArchive && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[95vh]"
          >
            <div className={cn(
              "p-8 text-white flex items-center justify-between transition-colors",
              isEditing ? "bg-indigo-600" : "bg-blue-600"
            )}>
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                  <UserCircle size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{isEditing ? `正在编辑: ${editForm?.name}` : `${selectedArchive.name} 健康档案`}</h3>
                  <p className="text-white/70 text-sm font-medium">档案编号: {selectedArchive.id} | 最后更新: 2026-04-20</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {!isEditing && (
                  <button 
                    onClick={() => startEdit(selectedArchive)}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-sm font-bold border border-white/20 transition-all"
                  >
                    切换至编辑模式
                  </button>
                )}
                <button 
                  onClick={() => { setSelectedArchive(null); setIsEditing(false); }}
                  className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors font-bold text-xl"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
              {/* Basic Info (Read Only in this demo for simplicity, or simple inputs) */}
              <section>
                <div className="flex items-center gap-2 text-slate-800 mb-6 border-l-4 border-blue-500 pl-4">
                  <h5 className="font-bold uppercase tracking-widest text-sm">基础健康指标</h5>
                </div>
                {isEditing ? (
                  <div className="grid grid-cols-4 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">身高 (cm)</label>
                       <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold" value={editForm?.height} onChange={e => editForm && setEditForm({...editForm, height: Number(e.target.value)})} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">体重 (kg)</label>
                       <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold" value={editForm?.weight} onChange={e => editForm && setEditForm({...editForm, weight: Number(e.target.value)})} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">血型</label>
                       <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold" value={editForm?.bloodType} onChange={e => editForm && setEditForm({...editForm, bloodType: e.target.value})} />
                    </div>
                    <MetricBox label="BMI" value={(editForm! && editForm.weight / ((editForm.height/100)**2)).toFixed(1)} />
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-4">
                    <MetricBox label="身高" value={`${selectedArchive.height}cm`} />
                    <MetricBox label="体重" value={`${selectedArchive.weight}kg`} />
                    <MetricBox label="血型" value={selectedArchive.bloodType} />
                    <MetricBox label="BMI" value={(selectedArchive.weight / ((selectedArchive.height/100)**2)).toFixed(1)} />
                  </div>
                )}
              </section>

              {/* Disease Tags Section */}
              <section>
                <div className="flex items-center gap-2 text-slate-800 mb-6 border-l-4 border-indigo-500 pl-4">
                  <h5 className="font-bold uppercase tracking-widest text-sm">疾病标签 (选择)</h5>
                </div>
                <div className="flex flex-wrap gap-2">
                  {DISEASE_TAGS.map(tag => {
                    const active = isEditing ? editForm?.conditions.includes(tag) : selectedArchive.conditions.includes(tag);
                    return (
                      <button
                        key={tag}
                        disabled={!isEditing}
                        onClick={() => handleTagToggle(tag)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                          active 
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100" 
                            : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                        )}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Diagnoses Section */}
              <section>
                <div className="flex items-center justify-between mb-6 border-l-4 border-purple-500 pl-4">
                  <h5 className="font-bold uppercase tracking-widest text-sm text-slate-800">临床诊断信息</h5>
                  {isEditing && (
                    <button onClick={addDiagnosis} className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1 text-xs font-bold">
                      <PlusCircle size={14} /> 添加诊断
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  <datalist id="diagnosis-suggestions">
                    {COMMON_DIAGNOSES.map(d => <option key={d} value={d} />)}
                  </datalist>
                  {(isEditing ? editForm?.diagnoses : selectedArchive.diagnoses)?.map((diag, i) => (
                    <div key={i} className="flex gap-2">
                      <div className="relative flex-1 group">
                        <FileText size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                        <input
                          disabled={!isEditing}
                          value={diag}
                          list="diagnosis-suggestions"
                          onChange={e => {
                            if (!editForm) return;
                            const newDiagnoses = [...editForm.diagnoses];
                            newDiagnoses[i] = e.target.value;
                            setEditForm({ ...editForm, diagnoses: newDiagnoses });
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:outline-none disabled:opacity-75 disabled:cursor-default"
                          placeholder="输入临床诊断结论..."
                        />
                      </div>
                      {isEditing && (
                        <button onClick={() => removeDiagnosis(i)} className="p-2.5 text-slate-300 hover:text-red-500 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                  {(isEditing ? editForm?.diagnoses : selectedArchive.diagnoses)?.length === 0 && (
                    <p className="text-center py-8 text-slate-400 font-medium italic bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100">暂无录入的诊断信息</p>
                  )}
                </div>
              </section>

              {/* Medical Orders Section */}
              <section>
                <div className="flex items-center justify-between mb-6 border-l-4 border-amber-500 pl-4">
                  <h5 className="font-bold uppercase tracking-widest text-sm text-slate-800">医嘱信息管理</h5>
                  {isEditing && (
                    <button onClick={addMedicalOrder} className="text-amber-600 hover:text-amber-700 flex items-center gap-1 text-xs font-bold">
                      <PlusCircle size={14} /> 新增医嘱
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  {(isEditing ? editForm?.medicalOrders : selectedArchive.medicalOrders)?.map((order) => (
                    <div key={order.id} className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                      {isEditing ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <select 
                              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold"
                              value={order.type}
                              onChange={e => {
                                if (!editForm) return;
                                const newOrders = editForm.medicalOrders.map(o => o.id === order.id ? {...o, type: e.target.value as any} : o);
                                setEditForm({ ...editForm, medicalOrders: newOrders });
                              }}
                            >
                              <option value="medication">用药医嘱</option>
                              <option value="diet">饮食建议</option>
                              <option value="rehab">康复训练</option>
                              <option value="checkup">复查计划</option>
                            </select>
                            <input 
                              placeholder="执行频率 (如: 1次/日)"
                              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold"
                              value={order.frequency}
                              onChange={e => {
                                if (!editForm) return;
                                const newOrders = editForm.medicalOrders.map(o => o.id === order.id ? {...o, frequency: e.target.value} : o);
                                setEditForm({ ...editForm, medicalOrders: newOrders });
                              }}
                            />
                          </div>
                          <textarea 
                            rows={2}
                            placeholder="具体的医嘱建议内容..."
                            className="w-full bg-slate-100/50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none"
                            value={order.content}
                            onChange={e => {
                              if (!editForm) return;
                              const newOrders = editForm.medicalOrders.map(o => o.id === order.id ? {...o, content: e.target.value} : o);
                              setEditForm({ ...editForm, medicalOrders: newOrders });
                            }}
                          />
                          <div className="flex justify-end">
                            <button onClick={() => removeMedicalOrder(order.id)} className="text-red-500 hover:text-red-600 flex items-center gap-1 text-[10px] font-black uppercase">
                              <Trash2 size={12} /> 移除此项
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-start gap-4">
                            <div className={cn(
                              "p-3 rounded-xl",
                              order.type === 'medication' ? 'bg-blue-50 text-blue-600' :
                              order.type === 'rehab' ? 'bg-purple-50 text-purple-600' : 'bg-amber-50 text-amber-600'
                            )}>
                              {order.type === 'medication' && <CheckCircle2 size={20} />}
                              {order.type === 'rehab' && <Activity size={20} />}
                              {(order.type === 'diet' || order.type === 'checkup') && <FileText size={20} />}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800">{order.content}</p>
                              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">频率: {order.frequency}</p>
                            </div>
                          </div>
                          <span className="px-3 py-1 bg-slate-50 text-slate-500 rounded-lg text-[10px] font-bold border border-slate-100">
                            {order.type === 'medication' ? '用药' : order.type === 'rehab' ? '康复' : order.type === 'diet' ? '饮食' : '检查'}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Emergency Contacts Section */}
              <section>
                <div className="flex items-center justify-between mb-6 border-l-4 border-red-500 pl-4">
                  <h5 className="font-bold uppercase tracking-widest text-sm text-slate-800">紧急联系人 (多位)</h5>
                  {isEditing && (
                    <button onClick={addEmergencyContact} className="text-red-600 hover:text-red-700 flex items-center gap-1 text-xs font-bold">
                      <UserPlus size={14} /> 添加联系人
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(isEditing ? editForm?.emergencyContacts : selectedArchive.emergencyContacts)?.map((contact, i) => (
                    <div key={i} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 relative group">
                      <div className="flex items-center gap-4 mb-4">
                         <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 shadow-sm">
                           <UserCircle size={24} />
                         </div>
                         <div className="flex-1">
                            {isEditing ? (
                              <input 
                                className="w-full bg-transparent border-b border-indigo-200 focus:border-indigo-500 focus:outline-none font-bold text-slate-800 text-sm py-0.5" 
                                value={contact.name} 
                                placeholder="姓名"
                                onChange={e => {
                                  if (!editForm) return;
                                  const newContacts = [...editForm.emergencyContacts];
                                  newContacts[i].name = e.target.value;
                                  setEditForm({ ...editForm, emergencyContacts: newContacts });
                                }}
                              />
                            ) : (
                              <p className="font-bold text-slate-800">{contact.name}</p>
                            )}
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">联系关系</p>
                         </div>
                      </div>
                      <div className="space-y-3">
                         <div className="flex justify-between items-center bg-white/50 px-3 py-2 rounded-lg border border-slate-100">
                           <span className="text-[10px] uppercase text-slate-400 font-bold">称呼</span>
                           {isEditing ? (
                              <input 
                                className="text-xs font-bold text-slate-700 text-right bg-transparent focus:outline-none" 
                                value={contact.relation} 
                                placeholder="如: 长子"
                                onChange={e => {
                                  if (!editForm) return;
                                  const newContacts = [...editForm.emergencyContacts];
                                  newContacts[i].relation = e.target.value;
                                  setEditForm({ ...editForm, emergencyContacts: newContacts });
                                }}
                              />
                           ) : (
                              <span className="text-xs font-bold text-slate-700">{contact.relation}</span>
                           )}
                         </div>
                         <div className="flex justify-between items-center bg-white/50 px-3 py-2 rounded-lg border border-slate-100">
                           <span className="text-[10px] uppercase text-slate-400 font-bold">电话</span>
                           {isEditing ? (
                              <input 
                                className="text-xs font-bold text-indigo-600 text-right bg-transparent focus:outline-none" 
                                value={contact.phone} 
                                placeholder="联系电话"
                                onChange={e => {
                                  if (!editForm) return;
                                  const newContacts = [...editForm.emergencyContacts];
                                  newContacts[i].phone = e.target.value;
                                  setEditForm({ ...editForm, emergencyContacts: newContacts });
                                }}
                              />
                           ) : (
                              <span className="text-xs font-bold text-red-500">{contact.phone}</span>
                           )}
                         </div>
                      </div>
                      {isEditing && (
                        <button onClick={() => removeEmergencyContact(i)} className="absolute top-2 right-2 p-1.5 bg-white shadow-sm rounded-lg opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </div>
            
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
              {isEditing ? (
                <>
                  <button onClick={cancelEdit} className="px-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors">取消修改</button>
                  <button onClick={saveEdit} className="px-10 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">提交保存此档案</button>
                </>
              ) : (
                <button 
                  onClick={() => startEdit(selectedArchive)}
                  className="px-8 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
                >
                  进入编辑模式
                </button>
              )}
              {!isEditing && <button onClick={() => setSelectedArchive(null)} className="px-8 py-2.5 bg-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-300">退出查看</button>}
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

function MetricBox({ label, value }: { label: string, value: string }) {
  return (
    <div className="p-4 rounded-xl bg-slate-50 text-center border border-slate-200 shadow-sm transition-all hover:bg-white hover:shadow-md cursor-default">
      <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">{label}</p>
      <p className="text-lg font-mono font-bold text-blue-600 leading-none">{value}</p>
    </div>
  );
}

function AlertsView() {
  const [alerts, setAlerts] = useState<AlertRule[]>(MOCK_ALERTS);
  const [selectedAlert, setSelectedAlert] = useState<AlertRule | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<Partial<AlertRule>>({});

  const openModal = (alert?: AlertRule) => {
    if (alert) {
      setSelectedAlert(alert);
      setForm({ ...alert });
    } else {
      setSelectedAlert(null);
      setForm({
        level: 'warning',
        event: '',
        description: '',
        notifyPersons: ['子女']
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!form.event || !form.description) return;
    
    if (selectedAlert) {
      setAlerts(prev => prev.map(a => a.id === selectedAlert.id ? (form as AlertRule) : a));
    } else {
      const newAlert: AlertRule = {
        ...form as any,
        id: Math.random().toString(36).substr(2, 9)
      };
      setAlerts(prev => [...prev, newAlert]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('确认删除此告警规则？')) {
      setAlerts(prev => prev.filter(a => a.id !== id));
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm text-slate-500">配置机器人检测到异常时的响应流程与分级告警机制</p>
        <button 
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-lg active:scale-95"
        >
          + 新增规则
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {alerts.map((alert) => (
          <div key={alert.id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className={cn(
              "absolute top-0 right-0 px-4 py-1 text-[10px] font-black uppercase text-white rounded-bl-xl shadow-sm",
              alert.level === 'critical' ? 'bg-red-500' : 'bg-amber-500'
            )}>
              {alert.level === 'critical' ? '紧急 L3' : '警告 L2'}
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner",
                alert.level === 'critical' ? 'bg-red-50' : 'bg-amber-50'
              )}>
                {alert.event === 'fall' ? (
                  <AlertCircle className="text-red-500" />
                ) : alert.event === 'vital_anomaly' ? (
                  <Activity className="text-amber-500" />
                ) : (
                  <AlertTriangle className={alert.level === 'critical' ? 'text-red-500' : 'text-amber-500'} />
                )}
              </div>
              <div>
                <h4 className="font-bold text-slate-800">{
                  alert.event === 'fall' ? '跌倒实时监测' : 
                  alert.event === 'vital_anomaly' ? '生命体征异常' : alert.event
                }</h4>
                <p className="text-xs text-slate-400">{alert.description}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">推送通知人</p>
                <div className="flex flex-wrap gap-2">
                  {alert.notifyPersons.map(p => (
                    <span key={p} className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 shadow-sm">{p}</span>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-xs text-slate-400 font-medium">已激活</span>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => openModal(alert)}
                    className="text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest"
                  >
                    编辑
                  </button>
                  <button 
                    onClick={() => handleDelete(alert.id)}
                    className="text-xs font-bold text-slate-400 hover:text-red-600 transition-colors uppercase tracking-widest"
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alert Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative overflow-hidden"
            >
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">{selectedAlert ? '编辑告警规则' : '新增告警规则'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <Plus className="rotate-45" size={24} />
                </button>
              </div>

              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">告警事件名称</label>
                  <input
                    type="text"
                    value={form.event}
                    onChange={e => setForm({ ...form, event: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    placeholder="例如: 环境温度异常"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">规则描述</label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                    placeholder="详细说明触发条件"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">告警级别</label>
                    <select
                      value={form.level}
                      onChange={e => setForm({ ...form, level: e.target.value as any })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    >
                      <option value="warning">警告 L2 (Amber)</option>
                      <option value="critical">紧急 L3 (Red)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">通知机制</label>
                    <div className="flex h-[46px] items-center px-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 text-sm">
                      系统推送 + 语音外呼
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">推送通知人</label>
                    <button 
                      onClick={() => setForm({ ...form, notifyPersons: [...(form.notifyPersons || []), ''] })}
                      className="text-[10px] text-blue-600 font-bold uppercase tracking-widest hover:underline"
                    >
                      + 添加人员
                    </button>
                  </div>
                  <div className="space-y-2">
                    {form.notifyPersons?.map((person, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={person}
                          onChange={e => {
                            const newPersons = [...(form.notifyPersons || [])];
                            newPersons[index] = e.target.value;
                            setForm({ ...form, notifyPersons: newPersons });
                          }}
                          className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none"
                          placeholder="姓名/角色"
                        />
                        <button 
                          onClick={() => setForm({ ...form, notifyPersons: form.notifyPersons?.filter((_, i) => i !== index) })}
                          className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-200 flex gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-100 transition-all active:scale-95 shadow-sm"
                >
                  取消
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-lg"
                >
                  保存规则
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ThresholdsView() {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h3 className="font-bold text-lg text-slate-800">指标阈值库</h3>
          <p className="text-xs text-slate-400">从模板导入或自定义生命体征、实验室指标基准</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">模板管理</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center gap-2">
            <Plus size={18} /> 导入指标
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_THRESHOLDS.map((indicator) => (
          <div key={indicator.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  indicator.type === 'vital' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                )}>
                  {indicator.type === 'vital' ? <Activity size={18} /> : <FileText size={18} />}
                </div>
                <div>
                  <h5 className="font-bold text-slate-800">{indicator.name}</h5>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{indicator.type === 'vital' ? '生命体征' : '化验指标'}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-black text-blue-600">{indicator.minVal} - {indicator.maxVal}</div>
                <div className="text-[10px] text-slate-400 font-bold">{indicator.unit}</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs pt-4 border-t border-slate-50">
              <span className="text-slate-400">引用模板: <span className="text-slate-700 underline">{indicator.templateName}</span></span>
              <button className="px-3 py-1 rounded-lg border border-slate-100 hover:border-blue-200 hover:text-blue-600 transition-all">设置阈值</button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}



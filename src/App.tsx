/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, Fragment } from 'react';
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
  Settings2,
  LayoutGrid,
  List,
  Search,
  Power,
  Info,
  Bell,
  MessageSquare,
  ShieldAlert,
  History,
  CheckCircle,
  XCircle,
  Volume2,
  Smartphone as Phone,
  Mail,
  User,
  MoreVertical,
  Radar,
  Pill,
  HeartPulse,
  Stethoscope,
  Dumbbell,
  Utensils,
  Upload,
  Download,
  LogOut
} from 'lucide-react';
import { 
  motion, 
  AnimatePresence 
} from 'motion/react';
import { cn } from './lib/utils';
import { Robot, HealthArchive, AlertRule, IndicatorThreshold, CareTask, SmartDevice, MedicalOrder, SecurityEvent, NotificationRecord, RehabGuidance } from './types';
import { useAuth } from './lib/AuthContext';
import { db, handleFirestoreError, OperationType } from './lib/firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc, query, where, Timestamp, orderBy, limit } from 'firebase/firestore';
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
  Scale,
  MapPin,
  QrCode,
  Package,
  ShieldCheck,
  Zap,
  Building2,
  Home
} from 'lucide-react';

import { 
  MOCK_TASKS, 
  MOCK_DEVICES, 
  MOCK_ROBOTS, 
  MOCK_ARCHIVES, 
  MOCK_ALERTS, 
  MOCK_SECURITY_EVENTS, 
  MOCK_NOTIFICATIONS, 
  MOCK_REHAB_GUIDANCE, 
  MOCK_THRESHOLDS,
  DISEASE_TAGS,
  COMMON_DIAGNOSES
} from './mocks';

export default function App() {
  const { user, loading, error, signIn, signInAnon, devLogin, logOut, clearError, initTestData } = useAuth();
  const [activeTab, setActiveTab] = useState('archives');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['care', 'device', 'config']);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) ? prev.filter(g => g !== groupId) : [...prev, groupId]
    );
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-sm w-full text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <HeartPulse className="text-blue-600" size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">长者健康管理系统</h2>
          <p className="text-sm font-medium text-slate-500 mb-8">请登录以继续访问后台管理系统</p>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 text-left relative">
              <div className="font-bold mb-1">登录错误:</div>
              {error}
              <button 
                onClick={clearError}
                className="absolute top-2 right-2 text-red-400 hover:text-red-600"
              >
                关闭
              </button>
            </div>
          )}

          <div className="space-y-3">
            <button 
              onClick={signIn}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200"
            >
              Google 账号登录
            </button>
            <button 
              onClick={signInAnon}
              className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-black transition shadow-lg"
            >
              🚀 管理员模式登录 (完整权限)
            </button>
            <p className="text-[10px] text-slate-400 text-center px-4">
              注意：管理员模式需要 Firebase 开启 "Anonymous" 认证。如未开启，请先使用 Google 登录。
            </p>
          </div>
        </div>
      </div>
    );
  }

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
            label="健康照护中心" 
            id="care" 
            isOpen={expandedGroups.includes('care')} 
            onToggle={() => toggleGroup('care')}
            collapsed={!sidebarOpen}
          >
            <NavItem label="健康档案管理" id="archives" active={activeTab === 'archives'} onClick={() => setActiveTab('archives')} collapsed={!sidebarOpen} />
            <NavItem label="照护任务计划" id="tasks" active={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} collapsed={!sidebarOpen} />
            <NavItem label="消息通知管理" id="notifications" active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} collapsed={!sidebarOpen} />
          </NavSubGroup>

          <NavSubGroup 
            icon={<Cpu size={18} />} 
            label="智能设备管理中心" 
            id="device" 
            isOpen={expandedGroups.includes('device')} 
            onToggle={() => toggleGroup('device')}
            collapsed={!sidebarOpen}
          >
            <NavItem label="健康监测设备管理" id="devices" active={activeTab === 'devices'} onClick={() => setActiveTab('devices')} collapsed={!sidebarOpen} />
            <NavItem label="机器人管理" id="robots" active={activeTab === 'robots'} onClick={() => setActiveTab('robots')} collapsed={!sidebarOpen} />
          </NavSubGroup>

          <NavSubGroup 
            icon={<Settings size={18} />} 
            label="系统规则配置中心" 
            id="config" 
            isOpen={expandedGroups.includes('config')} 
            onToggle={() => toggleGroup('config')}
            collapsed={!sidebarOpen}
          >
            <NavItem label="异常预警规则设置" id="alerts" active={activeTab === 'alerts'} onClick={() => setActiveTab('alerts')} collapsed={!sidebarOpen} />
            <NavItem label="慢病康复运动管理" id="rehab" active={activeTab === 'rehab'} onClick={() => setActiveTab('rehab')} collapsed={!sidebarOpen} />
            <NavItem label="健康指标标准设置" id="thresholds" active={activeTab === 'thresholds'} onClick={() => setActiveTab('thresholds')} collapsed={!sidebarOpen} />
          </NavSubGroup>

          {sidebarOpen && (
            <div className="pt-4 mt-4 border-t border-slate-800/50">
              <div className="text-[10px] text-slate-500 font-bold px-3 py-2 uppercase tracking-widest">系统快捷入口</div>
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
                <span>健康知识库</span>
                <ExternalLink size={12} className="ml-auto opacity-40" />
              </a>
            </div>
          )}
        </nav>

        <div className="p-4 border-t border-slate-800">
          {sidebarOpen && (
            <div className="mb-4">
              <button 
                onClick={logOut}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-slate-800 hover:text-red-300 transition-all"
              >
                <Power size={18} />
                <span>退出登录</span>
              </button>
            </div>
          )}
          {sidebarOpen && (
            <div className="mb-4">
              <button 
                onClick={async () => {
                   if (confirm("这会导入模拟数据到 Firebase 中，确定吗？")) {
                      try {
                        for (const g of MOCK_REHAB_GUIDANCE) {
                          await setDoc(doc(db, 'guidances', g.id), g);
                        }
                        for (const g of MOCK_TASKS) {
                          await setDoc(doc(db, 'tasks', g.id), g);
                        }
                        for (const g of MOCK_ARCHIVES) {
                          await setDoc(doc(db, 'archives', g.id), g);
                        }
                        for (const g of MOCK_DEVICES) {
                          await setDoc(doc(db, 'devices', g.id), g);
                        }
                        for (const g of MOCK_ALERTS) {
                          await setDoc(doc(db, 'alerts', g.id), g);
                        }
                        for (const g of MOCK_ROBOTS) {
                          await setDoc(doc(db, 'robots', g.id), g);
                        }
                        for (const g of MOCK_THRESHOLDS) {
                          await setDoc(doc(db, 'thresholds', g.id), g);
                        }
                        for (const g of MOCK_SECURITY_EVENTS) {
                          await setDoc(doc(db, 'security_events', g.id), g);
                        }
                        for (const g of MOCK_NOTIFICATIONS) {
                          await setDoc(doc(db, 'notifications', g.id), g);
                        }
                        alert("导入成功！");
                      } catch (e) {
                         alert("导入失败 " + String(e));
                      }
                   }
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-800 hover:text-slate-300 transition-all border border-slate-700"
              >
                <span>初始化/恢复测试数据</span>
              </button>
            </div>
          )}
          {sidebarOpen && (
            <div className="mb-4 px-3 text-[10px] text-slate-500 uppercase tracking-widest leading-loose">
              <div className="flex justify-between"><span>当前账号</span><span className="text-slate-400 truncate max-w-[100px]" title={user?.email || ''}>{user?.email?.split('@')[0]}</span></div>
              <div className="flex justify-between"><span>版本号</span><span className="text-slate-400">v1.0.2</span></div>
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
              {activeTab === 'archives' && '📂 健康档案管理'}
              {activeTab === 'devices' && '🌡️ 健康监测设备管理'}
              {activeTab === 'robots' && '🤖 机器人管理'}
              {activeTab === 'tasks' && '📋 照护任务计划'}
              {activeTab === 'notifications' && '🔔 消息通知管理'}
              {activeTab === 'alerts' && '⚠️ 异常预警规则设置'}
              {activeTab === 'rehab' && '💪 慢病康复运动管理'}
              {activeTab === 'thresholds' && '📏 健康指标标准设置'}
            </span>

            <button 
              onClick={initTestData}
              className="ml-4 px-4 py-1.5 bg-amber-50 text-amber-700 text-xs font-black rounded-full border border-amber-200 hover:bg-amber-100 transition-colors flex items-center gap-2 shadow-sm"
            >
              <Zap size={14} className="fill-amber-500 text-amber-500" />
              快速填充系统测试数据
            </button>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-slate-600 font-medium">看护引擎运行中 · 管理员模式</span>
            </div>
            <div className="flex items-center gap-2 group cursor-pointer" onClick={logOut}>
              <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-600 font-bold text-xs shadow-inner group-hover:bg-red-50 group-hover:text-red-600 group-hover:border-red-200 transition-all">
                <LogOut size={14} />
              </div>
              <span className="text-sm font-semibold text-slate-700 group-hover:text-red-600 transition-colors">退出系统</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'tasks' && <TaskMgmtView key="tasks" />}
            {activeTab === 'notifications' && <NotificationsView key="notifications" />}
            {activeTab === 'devices' && <SmartDeviceMgmtView key="devices" />}
            {activeTab === 'robots' && <RobotMgmtView key="robots" />}
            {activeTab === 'archives' && <ArchivesView key="archives" />}
            {activeTab === 'alerts' && <AlertsView key="alerts" />}
            {activeTab === 'rehab' && <RehabGuidanceView key="rehab" />}
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

// --- Shared Components ---

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button 
      onClick={(e) => { e.stopPropagation(); onToggle(); }}
      className={cn(
        "relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none cursor-pointer",
        enabled ? "bg-blue-600 shadow-sm" : "bg-slate-200"
      )}
    >
      <span
        className={cn(
          "inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow-sm",
          enabled ? "translate-x-5.5" : "translate-x-1"
        )}
      />
    </button>
  );
}

// --- Views ---

function TaskMgmtView() {
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<CareTask[]>([]);
  
  useEffect(() => {
    const q = query(collection(db, 'tasks'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CareTask));
      setTasks(data);
      // Auto-expand first task once on initial load if none expanded
      if (data.length > 0 && !expandedTaskId) {
        setExpandedTaskId(data[0].id);
      }
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'tasks'));
    return () => unsubscribe();
  }, [expandedTaskId]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Partial<CareTask> | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'executed'>('all');

  const toggleTaskEnabled = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    try {
      await setDoc(doc(db, 'tasks', id), { enabled: !task.enabled }, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `tasks/${id}`);
    }
  };

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.robotName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    if (statusFilter === 'pending') return matchesSearch && t.status === 'pending';
    if (statusFilter === 'executed') return matchesSearch && (t.status === 'completed' || t.status === 'failed');
    return matchesSearch;
  });

  const openModal = (task?: CareTask) => {
    if (task) {
      setCurrentTask({ ...task });
    } else {
      const now = new Date();
      const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      setCurrentTask({
        id: `T${Date.now()}`,
        patientName: '',
        type: 'medication',
        status: 'pending',
        scheduledTime: timeStr,
        frequency: 'daily',
        robotName: MOCK_ROBOTS[0]?.name || '',
        content: '',
        enabled: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!currentTask?.patientName || !currentTask?.content) {
      alert('请填写必要信息');
      return;
    }
    const task = currentTask as CareTask;
    try {
      await setDoc(doc(db, 'tasks', task.id), { ...task, createdAt: Timestamp.now(), updatedAt: Timestamp.now() }, { merge: true });
      setIsModalOpen(false);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `tasks/${task.id}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('确认撤销并删除该任务？')) {
      try {
        await deleteDoc(doc(db, 'tasks', id));
      } catch (e) {
        handleFirestoreError(e, OperationType.DELETE, `tasks/${id}`);
      }
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const updateData: any = { status: nextStatus, updatedAt: Timestamp.now() };
    
    if (nextStatus === 'completed') {
      const timeStr = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-').slice(0, 16);
      updateData.history = [
        { time: timeStr, status: 'completed', remark: '标记为完成' },
        ...(task.history || [])
      ];
    }

    try {
       await setDoc(doc(db, 'tasks', id), updateData, { merge: true });
    } catch (e) {
       handleFirestoreError(e, OperationType.UPDATE, `tasks/${id}`);
    }
  };

  const handleRecordHistory = async (taskId: string, time: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const newHistory = [
      { time, status: 'completed' as const, remark: '手动登记历史' },
      ...(task.history || [])
    ];
    try {
      await setDoc(doc(db, 'tasks', taskId), { history: newHistory, updatedAt: Timestamp.now() }, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `tasks/${taskId}`);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h3 className="font-bold text-lg text-slate-800">实时照护任务计划</h3>
          <p className="text-xs text-slate-400">基于医嘱生成的自动化看护任务执行状态</p>
        </div>
        
        <div className="flex flex-1 items-center gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="搜索任务、对象或机器人..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
            />
          </div>

          <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors whitespace-nowrap">导出报表</button>
          
          <button 
            onClick={() => openModal()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-100 ring-offset-2 focus:ring-2 focus:ring-blue-500 whitespace-nowrap"
          >
            <Plus size={18} /> 手动派发任务
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl w-fit border border-slate-200">
        <button 
          onClick={() => setStatusFilter('all')}
          className={cn(
            "px-6 py-2 rounded-lg text-xs font-bold transition-all",
            statusFilter === 'all' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          全部计划 ({tasks.length})
        </button>
        <button 
          onClick={() => setStatusFilter('pending')}
          className={cn(
            "px-6 py-2 rounded-lg text-xs font-bold transition-all",
            statusFilter === 'pending' ? "bg-white text-amber-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          待执行 ({tasks.filter(t => t.status === 'pending').length})
        </button>
        <button 
          onClick={() => setStatusFilter('executed')}
          className={cn(
            "px-6 py-2 rounded-lg text-xs font-bold transition-all",
            statusFilter === 'executed' ? "bg-white text-green-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          已执行 ({tasks.filter(t => t.status !== 'pending').length})
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="w-12 px-6 py-4"></th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">开始执行时间</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">频次</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">看护对象</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">任务内容</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">执行机器人</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">启用</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">状态</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredTasks.map((task) => {
              const isExpanded = expandedTaskId === task.id;
              return (
                <Fragment key={task.id}>
                  <tr 
                    onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                    className={cn(
                      "hover:bg-blue-50/30 transition-colors group text-sm cursor-pointer",
                      !task.enabled && "opacity-60 bg-slate-50/40",
                      isExpanded && "bg-blue-50/50"
                    )}
                  >
                    <td className="px-6 py-4 text-center">
                      <ChevronRight 
                        size={14} 
                        className={cn("text-slate-400 transition-transform", isExpanded && "rotate-90 text-blue-600")} 
                      />
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-500 whitespace-nowrap">{task.scheduledTime}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold uppercase whitespace-nowrap">
                        {task.frequency === 'daily' ? '每天' : 
                         task.frequency === 'three_times_daily' ? '一天三次' :
                         task.frequency === 'weekly' ? '每周' : 
                         task.frequency === 'monthly' ? '每月' : '单次'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-700 whitespace-nowrap">{task.patientName}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "p-1.5 rounded-lg shadow-inner",
                          task.type === 'medication' ? 'bg-blue-50 text-blue-600' :
                          task.type === 'measurement' ? 'bg-green-50 text-green-600' :
                          task.type === 'exercise' ? 'bg-purple-50 text-purple-600' : 'bg-pink-50 text-pink-600'
                        )}>
                          {task.type === 'medication' && <CheckCircle2 size={14} />}
                          {task.type === 'measurement' && <Activity size={14} />}
                          {task.type === 'exercise' && <Activity size={14} />}
                          {task.type === 'emotion' && <Heart size={14} />}
                        </span>
                        <span className="font-medium text-slate-600 line-clamp-1">{task.content}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-500 font-medium whitespace-nowrap">
                        <Bot size={14} className="text-blue-400" />
                        {task.robotName}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div onClick={e => e.stopPropagation()}>
                        <Toggle enabled={task.enabled} onToggle={() => toggleTaskEnabled(task.id)} />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase whitespace-nowrap",
                        task.status === 'completed' ? 'bg-green-100 text-green-700' : 
                        task.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      )}>
                        {task.status === 'completed' ? '已完成' : task.status === 'failed' ? '执行失败' : '排队中'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => { e.stopPropagation(); toggleStatus(task.id, task.status); }}
                          title={task.status === 'pending' ? '标记完成' : '重置为待办'} 
                          className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                        >
                          {task.status === 'completed' ? <RotateCcw size={16} /> : <Pause size={16} />}
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); openModal(task); }}
                          title="编辑" 
                          className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDelete(task.id); }}
                          title="删除" 
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr className="bg-slate-50/50">
                      <td colSpan={9} className="px-12 py-6">
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="grid grid-cols-1 md:grid-cols-2 gap-8"
                        >
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Clock size={14} /> 频次与计划规范
                              </h4>
                              <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                                <div className="space-y-2">
                                  <p className="text-sm font-bold text-slate-700">
                                    {task.frequency === 'three_times_daily' ? '一天三次 (早中晚)' : 
                                     task.frequency === 'daily' ? '每天一次' : 
                                     task.frequency === 'weekly' ? '每周一次' : 
                                     task.frequency === 'monthly' ? '每月一次' : '单次临时'}
                                  </p>
                                  <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                      <p className="text-xs text-blue-600 font-medium flex items-center gap-1">
                                        <Clock size={12} /> 次期: {task.scheduledTime}
                                      </p>
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); handleRecordHistory(task.id, task.scheduledTime); }}
                                        className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-[4px] text-[10px] font-bold hover:bg-blue-100 transition-colors border border-blue-100/50"
                                      >
                                        记录此次执行
                                      </button>
                                    </div>
                                    {task.frequency !== 'once' && (
                                      <p className="text-[10px] text-slate-400 flex items-center gap-1 pl-4 opacity-70">
                                        后期: {(() => {
                                          const date = new Date(task.scheduledTime.replace(' ', 'T'));
                                          if (task.frequency === 'daily') date.setDate(date.getDate() + 1);
                                          if (task.frequency === 'three_times_daily') date.setHours(date.getHours() + 4);
                                          if (task.frequency === 'weekly') date.setDate(date.getDate() + 7);
                                          if (task.frequency === 'monthly') date.setMonth(date.getMonth() + 1);
                                          return date.toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-').slice(0, 16);
                                        })()}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-[10px] font-bold">自动化派发</span>
                                  <span className="px-2 py-1 bg-slate-50 text-slate-500 rounded text-[10px] font-bold">{task.robotName} 承载</span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Info size={14} /> 任务内容详述
                              </h4>
                              <div className="bg-white p-4 rounded-2xl border border-slate-200">
                                <p className="text-sm font-medium text-slate-600 leading-relaxed">{task.content}</p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center justify-between">
                              <span className="flex items-center gap-2"><History size={14} /> 最近执行历史</span>
                              <span className="text-slate-300">共 {task.history?.length || 0} 条执行痕迹</span>
                            </h4>
                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                              {(task.history && task.history.length > 0) ? task.history.map((run, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 hover:border-blue-100 transition-colors shadow-sm">
                                  <div className="flex items-center gap-3">
                                    <div className={cn(
                                      "w-2 h-2 rounded-full shadow-sm",
                                      run.status === 'completed' ? 'bg-green-500' : run.status === 'failed' ? 'bg-red-500' : 'bg-slate-400'
                                    )} />
                                    <div className="flex flex-col">
                                      <span className="text-xs font-mono font-bold text-slate-700">{run.time}</span>
                                      {run.remark && <span className="text-[10px] text-slate-400 italic leading-tight">备注: {run.remark}</span>}
                                    </div>
                                  </div>
                                  <span className={cn(
                                    "px-2 py-0.5 rounded text-[9px] font-black tracking-widest",
                                    run.status === 'completed' ? 'bg-green-50 text-green-600' : 
                                    run.status === 'failed' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'
                                  )}>
                                    {run.status === 'completed' ? '成功' : run.status === 'failed' ? '失败' : '跳过'}
                                  </span>
                                </div>
                              )) : (
                                <div className="flex flex-col items-center justify-center py-8 text-slate-300 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                  <History size={32} className="opacity-10 mb-2" />
                                  <p className="text-xs font-medium">暂无云端同步的历史执行数据</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {isModalOpen && currentTask && (
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
                <h3 className="font-bold text-slate-800">
                  {tasks.find(t => t.id === currentTask.id) ? '编辑照护任务' : '手动派发即时任务'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <Plus className="rotate-45" size={24} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">对象姓名</label>
                    <input
                      type="text"
                      value={currentTask.patientName}
                      onChange={e => setCurrentTask({ ...currentTask, patientName: e.target.value })}
                      placeholder="例如: 张大爷"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">执行频次</label>
                    <select
                      value={currentTask.frequency}
                      onChange={e => setCurrentTask({ ...currentTask, frequency: e.target.value as any })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    >
                      <option value="once">单次执行</option>
                      <option value="daily">每天 (Daily)</option>
                      <option value="three_times_daily">一天三次 (3 Times/Day)</option>
                      <option value="weekly">每周 (Weekly)</option>
                      <option value="monthly">每月 (Monthly)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">任务类型</label>
                    <select
                      value={currentTask.type}
                      onChange={e => setCurrentTask({ ...currentTask, type: e.target.value as any })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    >
                      <option value="medication">用药提醒</option>
                      <option value="measurement">体征测量</option>
                      <option value="exercise">康复训练</option>
                      <option value="routine">日常起居</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">计划执行时间</label>
                    <input
                      type="text"
                      value={currentTask.scheduledTime}
                      onChange={e => setCurrentTask({ ...currentTask, scheduledTime: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">任务执行内容</label>
                  {currentTask.type === 'measurement' && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {['血压', '血糖', '血氧', '体温', '心率'].map(m => (
                        <button
                          key={m}
                          onClick={() => {
                            const newContent = `请协助用户完成${m}测量并记录数值。`;
                            setCurrentTask({ ...currentTask, content: newContent });
                          }}
                          className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold border border-indigo-100 hover:bg-indigo-100 transition-colors"
                        >
                          + {m}
                        </button>
                      ))}
                    </div>
                  )}
                  <textarea
                    rows={3}
                    value={currentTask.content}
                    onChange={e => setCurrentTask({ ...currentTask, content: e.target.value })}
                    placeholder="请输入具体的任务指令内容..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">指定执行机器人</label>
                    <select
                      value={currentTask.robotName}
                      onChange={e => setCurrentTask({ ...currentTask, robotName: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    >
                      {MOCK_ROBOTS.map(r => (
                        <option key={r.id} value={r.name}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-200 flex gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-8 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-100 transition-all active:scale-95 shadow-sm"
                >
                  取消
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-100"
                >
                  确派发任务
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SmartDeviceMgmtView() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [devices, setDevices] = useState<SmartDevice[]>([]);
  useEffect(() => {
    const q = query(collection(db, 'devices'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SmartDevice));
      setDevices(data);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'devices'));
    return () => unsubscribe();
  }, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDevice, setSelectedDevice] = useState<SmartDevice | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState<Partial<SmartDevice>>({
    name: '',
    type: 'sensor',
    sn: '',
    robotId: MOCK_ROBOTS[0]?.id || ''
  });

  const handleAddDevice = async () => {
    const newDevice: SmartDevice = {
      id: `D${Date.now()}`,
      name: addForm.name || '新设备',
      type: addForm.type as any || 'sensor',
      sn: addForm.sn || `SN-${Date.now()}`,
      robotId: addForm.robotId,
      status: 'online',
      enabled: true,
      lastSync: '刚刚',
      battery: 100,
      firmware: 'v1.0.0',
      config: { reportingInterval: 5, sensitivity: '中', mode: '标准模式' }
    };
    try {
      await setDoc(doc(db, 'devices', newDevice.id), { ...newDevice, createdAt: Timestamp.now(), updatedAt: Timestamp.now() });
      setIsAddModalOpen(false);
      setAddForm({ name: '', type: 'sensor', sn: '', robotId: MOCK_ROBOTS[0]?.id || '' });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `devices/${newDevice.id}`);
    }
  };

  const toggleDeviceEnabled = async (id: string) => {
    const device = devices.find(d => d.id === id);
    if (!device) return;
    try {
      await setDoc(doc(db, 'devices', id), { enabled: !device.enabled }, { merge: true });
    } catch(e) {
      handleFirestoreError(e, OperationType.UPDATE, `devices/${id}`);
    }
  };

  const filteredDevices = devices.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d.sn && d.sn.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const openDetails = (device: SmartDevice) => {
    setSelectedDevice(device);
    setIsDetailModalOpen(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      className="space-y-6"
    >
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-4">
          <h3 className="font-bold text-lg">健康监测设备管理</h3>
          <div className="flex gap-2">
            <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-bold">{devices.filter(d => d.status === 'online').length} 在线</span>
            <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 bg-red-50 text-red-600 rounded-full font-bold">{devices.filter(d => d.status === 'offline').length} 离线</span>
          </div>
        </div>
        
        <div className="flex flex-1 items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="搜索设备名称或序列号..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
            />
          </div>

          <div className="bg-slate-100 p-1 rounded-lg flex items-center">
            <button 
              onClick={() => setViewMode('list')}
              className={cn(
                "p-1.5 rounded-md transition-all",
                viewMode === 'list' ? "bg-white shadow-sm text-blue-600" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <List size={18} />
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-1.5 rounded-md transition-all",
                viewMode === 'grid' ? "bg-white shadow-sm text-blue-600" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <LayoutGrid size={18} />
            </button>
          </div>

          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100 whitespace-nowrap active:scale-95"
          >
            <Plus size={18} /> 添加新设备
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDevices.map((device) => (
            <div key={device.id} className={cn(
              "bg-white p-6 rounded-xl shadow-sm border border-slate-200 group relative text-sm transition-all",
              !device.enabled && "opacity-60 grayscale-[0.5]"
            )}>
              <div className="flex items-start justify-between mb-4">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner",
                  device.status === 'online' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'
                )}>
                  {device.type === 'sensor' && <Wifi size={24} />}
                  {device.type === 'gateway' && <Smartphone size={24} />}
                  {device.type === 'camera' && <Video size={24} />}
                  {device.type === 'scale' && <Scale size={24} />}
                  {device.type === 'blood_pressure' && <Activity size={24} />}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                     <span className={cn(
                      "text-[10px] font-black uppercase tracking-widest",
                      device.status === 'online' ? 'text-green-500' : 'text-slate-300'
                    )}>
                      {device.status === 'online' ? '在线' : '离线'}
                    </span>
                    <Toggle enabled={device.enabled} onToggle={() => toggleDeviceEnabled(device.id)} />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono uppercase tracking-widest">序列号: {device.sn || device.id}</p>
                </div>
              </div>

              <h4 className={cn(
                "font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight text-base mb-1",
                !device.enabled && "text-slate-400"
              )}>{device.name}</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                {device.type === 'sensor' ? '环境传感器' : 
                 device.type === 'gateway' ? '智能网关' :
                 device.type === 'camera' ? '视觉探头' :
                 device.type === 'scale' ? '智能体重秤' : '智能血压计'}
              </p>
              
              <div className="mt-2 flex items-center gap-2 text-[10px] text-blue-600 font-bold bg-blue-50/50 px-2 py-1 rounded-lg w-fit">
                <Bot size={12} />
                已绑定: {MOCK_ROBOTS.find(r => r.id === device.robotId)?.name || '未绑定'}
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider mb-0.5">最后同步</span>
                    <span className="text-xs font-bold text-slate-600">{device.lastSync}</span>
                  </div>
                  {device.battery !== undefined && (
                    <div className="flex flex-col">
                      <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider mb-0.5">电量</span>
                      <div className="flex items-center gap-1">
                        <BatteryMedium size={12} className={cn(device.battery < 20 ? 'text-red-500' : 'text-green-500')} />
                        <span className="text-xs font-bold text-slate-600">{device.battery}%</span>
                      </div>
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => openDetails(device)}
                  className="p-2 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all rounded-lg active:scale-95"
                >
                  <Settings size={18} />
                </button>
              </div>
            </div>
          ))}
          <div 
            onClick={() => setIsAddModalOpen(true)}
            className="border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-8 text-slate-400 hover:text-blue-500 hover:border-blue-300 transition-all cursor-pointer bg-slate-50/30 group"
          >
            <Plus size={32} className="mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-black uppercase tracking-widest">添加新设备</span>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">设备名称</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">类型</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">状态</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">启用状态</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">电量</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">绑定机器人</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">最后同步</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredDevices.map((device) => (
                <tr key={device.id} className={cn(
                  "border-b border-slate-50 last:border-0 hover:bg-slate-50/30 transition-colors",
                  !device.enabled && "opacity-60 bg-slate-50/20"
                )}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center shadow-inner",
                        device.status === 'online' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'
                      )}>
                        {device.type === 'sensor' && <Wifi size={16} />}
                        {device.type === 'gateway' && <Smartphone size={16} />}
                        {device.type === 'camera' && <Video size={16} />}
                        {device.type === 'scale' && <Scale size={16} />}
                        {device.type === 'blood_pressure' && <Activity size={16} />}
                      </div>
                      <div>
                        <p className={cn("text-sm font-bold text-slate-700 leading-none mb-1", !device.enabled && "text-slate-400 uppercase tracking-tight")}>{device.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">序列号: {device.sn || device.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       {device.type === 'sensor' ? '环境传感器' : 
                        device.type === 'gateway' ? '智能网关' :
                        device.type === 'camera' ? '视觉探头' :
                        device.type === 'scale' ? '体重秤' : '血压计'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter shadow-sm",
                      device.status === 'online' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'
                    )}>
                      {device.status === 'online' ? '在线' : '离线'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Toggle enabled={device.enabled} onToggle={() => toggleDeviceEnabled(device.id)} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    {device.battery !== undefined ? (
                      <div className="flex items-center justify-center gap-1.5">
                        <BatteryMedium size={14} className={cn(device.battery < 20 ? 'text-red-500' : 'text-green-500')} />
                        <span className="text-xs font-bold text-slate-600">{device.battery}%</span>
                      </div>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded-lg w-fit shadow-inner">
                      <Bot size={12} />
                      {MOCK_ROBOTS.find(r => r.id === device.robotId)?.name || '未绑定'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-slate-500">{device.lastSync}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => openDetails(device)}
                      className="p-2 text-slate-300 hover:text-blue-600 transition-colors"
                    >
                      <Settings size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Device Details Modal */}
      <AnimatePresence>
        {isDetailModalOpen && selectedDevice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDetailModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg",
                    selectedDevice.status === 'online' ? 'bg-blue-600 text-white' : 'bg-slate-400 text-white'
                  )}>
                    {selectedDevice.type === 'sensor' && <Wifi size={24} />}
                    {selectedDevice.type === 'gateway' && <Smartphone size={24} />}
                    {selectedDevice.type === 'camera' && <Video size={24} />}
                    {selectedDevice.type === 'scale' && <Scale size={24} />}
                    {selectedDevice.type === 'blood_pressure' && <Activity size={24} />}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 leading-tight uppercase">{selectedDevice.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">序列号: {selectedDevice.sn || selectedDevice.id}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded shadow-sm",
                        selectedDevice.status === 'online' ? 'bg-green-500 text-white' : 'bg-slate-400 text-white'
                      )}>
                        {selectedDevice.status === 'online' ? '在线' : '离线'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 px-4 border-r border-slate-100 hidden sm:flex">
                  <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest leading-none">归属机器人</span>
                  <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1.5 rounded-xl shadow-inner">
                    <Bot size={14} />
                    {MOCK_ROBOTS.find(r => r.id === selectedDevice.robotId)?.name || '未绑定'}
                  </div>
                </div>
                <button 
                  onClick={() => setIsDetailModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                >
                  <Plus className="rotate-45" size={24} />
                </button>
              </div>

              <div className="p-8 space-y-8 overflow-y-auto max-h-[70vh]">
                {/* Real-time Data Section */}
                {selectedDevice.readings && selectedDevice.readings.length > 0 && (
                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Activity size={14} className="text-blue-600" /> 实时采集量明细
                      </h5>
                      <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-widest">
                        最后上报: {selectedDevice.lastSync}
                      </span>
                    </div>
                    <div className="bg-slate-50/50 rounded-2xl border border-slate-100 overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-100">
                            <th className="px-4 py-3 font-black text-slate-400 uppercase tracking-widest">采集时间</th>
                            <th className="px-4 py-3 font-black text-slate-400 uppercase tracking-widest">数值</th>
                            <th className="px-4 py-3 font-black text-slate-400 uppercase tracking-widest">单位</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {selectedDevice.readings.map((r, i) => (
                            <tr key={i} className="hover:bg-white transition-colors">
                              <td className="px-4 py-3 font-mono font-bold text-slate-400">{r.time}</td>
                              <td className="px-4 py-3 font-black text-blue-600 text-sm tracking-tighter">{r.value}</td>
                              <td className="px-4 py-3 font-bold text-slate-600">{r.unit}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                )}

                {/* Configuration Section */}
                <section className="space-y-4">
                   <h5 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Settings2 size={14} className="text-blue-600" /> 传感器模组及策略配置
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white border border-slate-100 rounded-2xl space-y-3 shadow-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">上报频率</span>
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase">{selectedDevice.config?.reportingInterval} 分钟/词</span>
                      </div>
                      <input type="range" className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                      <p className="text-[9px] text-slate-400 leading-relaxed font-medium">降低频率可延长续航，提高频率以获得更及时的告警响应</p>
                    </div>

                    <div className="p-4 bg-white border border-slate-100 rounded-2xl space-y-3 shadow-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">传感器灵敏度</span>
                        <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-[10px] font-bold uppercase">{selectedDevice.config?.sensitivity}</span>
                      </div>
                      <div className="flex gap-2">
                        {['低', '中', '高', '智能'].map(v => (
                          <button key={v} className={cn(
                            "flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all",
                            selectedDevice.config?.sensitivity === v ? "bg-blue-600 text-white shadow-md shadow-blue-100" : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                          )}>
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-white border border-slate-100 rounded-2xl space-y-3 shadow-sm">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">运行模式定义</span>
                       <div className="p-2 bg-slate-50 rounded-xl flex items-center justify-between">
                         <span className="text-xs font-bold text-slate-700">{selectedDevice.config?.mode}</span>
                         <ChevronDown size={16} className="text-slate-400" />
                       </div>
                    </div>

                    <div className="p-4 bg-white border border-slate-100 rounded-2xl space-y-3 shadow-sm">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">设备固件版本</span>
                       <div className="flex items-center justify-between">
                         <span className="font-mono text-[10px] font-bold text-slate-600">{selectedDevice.firmware}</span>
                         <button className="text-[9px] font-black uppercase text-blue-600 hover:underline">检查更新</button>
                       </div>
                    </div>
                  </div>
                </section>
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                <button 
                  onClick={() => setIsDetailModalOpen(false)}
                  className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-100 transition-all active:scale-95 shadow-sm"
                >
                  关闭窗口
                </button>
                <button 
                  className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all active:scale-95 shadow-xl shadow-blue-200 flex items-center justify-center gap-2"
                >
                  <ShieldCheck size={18} /> 保存配置并下发
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Device Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900 uppercase">添加新监测设备</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl transition-all">
                  <Plus className="rotate-45" size={24} />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">设备名称</label>
                  <input 
                    type="text" 
                    value={addForm.name}
                    onChange={e => setAddForm({...addForm, name: e.target.value})}
                    placeholder="例如: 客厅毫米波雷达"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">设备类型</label>
                    <select 
                      value={addForm.type}
                      onChange={e => setAddForm({...addForm, type: e.target.value as any})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold"
                    >
                      <option value="sensor">环境传感器</option>
                      <option value="gateway">智能网关</option>
                      <option value="camera">视觉探头</option>
                      <option value="scale">智能体重秤</option>
                      <option value="blood_pressure">智能血压计</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">序列号 (SN)</label>
                    <input 
                      type="text" 
                      value={addForm.sn}
                      onChange={e => setAddForm({...addForm, sn: e.target.value})}
                      placeholder="序列号..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all font-mono font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 leading-none">
                    <Bot size={14} className="text-blue-500" /> 绑定承载机器人 (必选)
                  </label>
                  <select 
                    value={addForm.robotId}
                    onChange={e => setAddForm({...addForm, robotId: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold text-blue-600 focus:ring-4 focus:ring-blue-500/10"
                  >
                    {MOCK_ROBOTS.map(robot => (
                      <option key={robot.id} value={robot.id}>{robot.name} ({robot.location})</option>
                    ))}
                  </select>
                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed">设备采集的数据将通过该机器人的网关进行上报和分发</p>
                </div>
              </div>
              <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-100 transition-all active:scale-95 shadow-sm"
                >
                  取消
                </button>
                <button 
                  onClick={handleAddDevice}
                  className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2 active:scale-95"
                >
                  <Plus size={18} /> 确认添加并绑定
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function NotificationsView() {
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = MOCK_SECURITY_EVENTS.filter(e => 
    e.patientName.includes(searchQuery) || 
    e.description.includes(searchQuery) ||
    e.location.includes(searchQuery)
  );

  const getEventNotifications = (eventId: string) => {
    return MOCK_NOTIFICATIONS.filter(n => n.eventId === eventId);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">安全事件与通知流水</h2>
          <p className="text-slate-500 text-sm font-medium">全链路告警触达与闭环确认记录</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder="搜索人员、事件或地点..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-64 shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="w-12 px-6 py-4"></th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">事件类型</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">关联人员</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">发生地点</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">发生时间</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">处理状态</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">主记录摘要</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredEvents.map((event) => {
              const notifications = getEventNotifications(event.id);
              const isExpanded = expandedEventId === event.id;
              
              return (
                <React.Fragment key={event.id}>
                  <tr 
                    onClick={() => setExpandedEventId(isExpanded ? null : event.id)}
                    className={cn(
                      "hover:bg-blue-50/30 transition-colors cursor-pointer group",
                      isExpanded && "bg-blue-50/50"
                    )}
                  >
                    <td className="px-6 py-4 text-center">
                      <ChevronRight 
                        size={16} 
                        className={cn("text-slate-400 transition-transform", isExpanded && "rotate-90 text-blue-600")} 
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-2xl flex items-center justify-center shadow-inner",
                          event.type === 'fall' ? 'bg-red-50 text-red-600' : 
                          event.type === 'vital_anomaly' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                        )}>
                          {event.type === 'fall' ? <ShieldAlert size={20} /> : <AlertCircle size={20} />}
                        </div>
                        <span className="text-sm font-bold text-slate-700">
                          {event.type === 'fall' ? '跌倒事件' : 
                           event.type === 'vital_anomaly' ? '体征异常' : 
                           event.type === 'environment' ? '环境告警' : '手动报警'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">
                        <User size={12} /> {event.patientName}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-medium text-slate-500">{event.location}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-700">{event.time.split(' ')[1]}</span>
                        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">{event.time.split(' ')[0]}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                        event.status === 'active' ? "bg-red-600 text-white border-red-600 shadow-lg shadow-red-200 animate-pulse" : 
                        event.status === 'processing' ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-green-50 text-green-600 border-green-100"
                      )}>
                        {event.status === 'active' ? '待处理' : event.status === 'processing' ? '处理中' : '已归档'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-slate-500 border-l-2 border-slate-200 pl-3 italic">{event.description}</p>
                    </td>
                  </tr>

                  {/* 子记录列表 - 通知流水 */}
                  {isExpanded && (
                    <tr className="bg-slate-50/50">
                      <td colSpan={7} className="px-12 py-6">
                        {event.type === 'fall' && (
                          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-1 duration-500">
                            <div className="bg-red-50/50 p-4 rounded-2xl border border-red-100">
                              <h6 className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Radar size={14} /> 触发监测设备详情
                              </h6>
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-red-600 shadow-sm border border-red-100">
                                  <Activity size={24} />
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-slate-800">毫米波雷达感应器</p>
                                  <p className="text-[10px] text-slate-400 font-medium font-mono uppercase tracking-tighter">设备编号: {event.deviceId || 'RADAR-UNK'}</p>
                                  <div className="mt-1 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-[9px] text-green-600 font-bold uppercase tracking-widest">设备在线</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="bg-green-50/50 p-4 rounded-2xl border border-green-100">
                              <h6 className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <History size={14} /> 实时处置记录
                              </h6>
                              <ul className="space-y-2">
                                <li className="text-[11px] text-slate-600 flex items-center gap-2">
                                  <CheckCircle size={10} className="text-green-500" /> <span className="font-mono text-[10px] font-bold text-slate-400">10:30:02</span> 监测到人体姿态异常，判定为跌倒事件
                                </li>
                                <li className="text-[11px] text-slate-600 flex items-center gap-2">
                                  <CheckCircle size={10} className="text-green-500" /> <span className="font-mono text-[10px] font-bold text-slate-400">10:30:05</span> 智能话箱启动音频交互：“请问您还好吗？”，用户确认无应答
                                </li>
                                <li className="text-[11px] text-slate-600 flex items-center gap-2">
                                  <CheckCircle size={10} className="text-green-500" /> <span className="font-mono text-[10px] font-bold text-slate-400">10:30:10</span> 自动通过消息网关触发 L3 级告警策略
                                </li>
                              </ul>
                            </div>
                          </div>
                        )}

                        <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden animate-in slide-in-from-top-2 duration-300">
                          <div className="bg-blue-50/50 px-6 py-3 flex items-center justify-between border-b border-blue-100">
                            <h5 className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                              <History size={14} /> 对应告警通知流水 (多级触达记录)
                            </h5>
                            <span className="text-[10px] text-slate-400 font-bold tracking-widest">共 {notifications.length} 条通知</span>
                          </div>
                          <table className="w-full text-left text-xs">
                            <thead>
                              <tr className="border-b border-slate-50">
                                <th className="px-6 py-3 font-bold text-slate-400 uppercase tracking-tighter">多级/接收人</th>
                                <th className="px-6 py-3 font-bold text-slate-400 uppercase tracking-tighter text-center">触达方式</th>
                                <th className="px-6 py-3 font-bold text-slate-400 uppercase tracking-tighter text-center">发送时间</th>
                                <th className="px-6 py-3 font-bold text-slate-400 uppercase tracking-tighter text-center">状态记录</th>
                                <th className="px-6 py-3 font-bold text-slate-400 uppercase tracking-tighter">反馈/备注</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {notifications.map((noti) => (
                                <tr key={noti.id} className="hover:bg-slate-50/30">
                                  <td className="px-6 py-3">
                                    <div className="flex items-center gap-3">
                                      <span className={cn(
                                        "px-1.5 py-0.5 rounded text-[9px] font-black tracking-tighter",
                                        noti.level === 'L3' ? "bg-red-500 text-white" : 
                                        noti.level === 'L2' ? "bg-orange-400 text-white" : "bg-blue-400 text-white"
                                      )}>
                                        {noti.level}
                                      </span>
                                      <div>
                                        <p className="font-bold text-slate-700">{noti.recipient}</p>
                                        <p className="text-[9px] text-slate-400 font-bold tracking-widest">{noti.relation}</p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-3 text-center">
                                    <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-slate-50 text-slate-500 rounded border border-slate-100">
                                      {noti.method === 'phone' ? <Phone size={12} className="text-blue-500" /> : 
                                       noti.method === 'speaker' ? <Volume2 size={12} className="text-orange-500" /> : 
                                       noti.method === 'sms' ? <History size={12} className="text-slate-500" /> : <MessageSquare size={12} className="text-green-500" />}
                                      <span className="font-bold scale-95 origin-left">
                                        {noti.method === 'phone' ? '电话' : noti.method === 'speaker' ? '语音' : noti.method === 'sms' ? '短信' : 'Push'}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-6 py-3 text-center">
                                    <span className="font-mono font-medium text-slate-500 tracking-tighter">{noti.sentTime}</span>
                                  </td>
                                  <td className="px-6 py-3 text-center">
                                    {noti.confirmed ? (
                                      <div className="flex items-center justify-center gap-1 text-green-600 font-bold">
                                        <CheckCircle size={14} />
                                        <div className="flex flex-col items-start leading-none">
                                          <span className="scale-90 origin-left">已确认</span>
                                          <span className="text-[8px] font-mono tracking-tighter opacity-70">{noti.confirmTime}</span>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="flex items-center justify-center gap-1 text-slate-400 font-bold italic">
                                        <XCircle size={14} />
                                        <span className="scale-90 origin-left">未响应</span>
                                      </div>
                                    )}
                                  </td>
                                  <td className="px-6 py-3">
                                    <span className="text-slate-500 font-medium">{noti.remark || '--'}</span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function RehabGuidanceView() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [guidances, setGuidances] = useState<RehabGuidance[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<RehabGuidance>>({});

  useEffect(() => {
    const q = query(collection(db, 'guidances'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RehabGuidance));
      setGuidances(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'guidances');
    });
    return () => unsubscribe();
  }, []);

  const filteredGuidances = guidances.filter(g => 
    (activeCategory === 'all' || g.category === activeCategory) &&
    (g.title.includes(searchQuery) || g.diseaseType.includes(searchQuery) || g.content.includes(searchQuery))
  );

  const categories: { id: 'all' | 'medication' | 'nursing' | 'followup' | 'exercise' | 'diet', label: string, icon: any, color?: string, bg?: string }[] = [
    { id: 'all', label: '全部指导', icon: Library },
    { id: 'medication', label: '用药指导', icon: Pill, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'nursing', label: '护理指导', icon: HeartPulse, color: 'text-red-500', bg: 'bg-red-50' },
    { id: 'followup', label: '复查提醒', icon: Stethoscope, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { id: 'exercise', label: '运动方案', icon: Dumbbell, color: 'text-green-500', bg: 'bg-green-50' },
    { id: 'diet', label: '饮食建议', icon: Utensils, color: 'text-orange-500', bg: 'bg-orange-50' },
  ];

  const handleEdit = (guidance: RehabGuidance) => {
    setEditForm(guidance);
    setIsEditing(true);
    setShowForm(true);
  };

  const toggleGuidanceEnabled = async (id: string) => {
    const guidance = guidances.find(g => g.id === id);
    if (!guidance) return;
    try {
      await setDoc(doc(db, 'guidances', id), { isEnabled: !guidance.isEnabled }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `guidances/${id}`);
    }
  };

  const handleAdd = () => {
    const d = new Date();
    setEditForm({ 
      category: 'medication', 
      isEnabled: true, 
      updatedAt: `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` 
    });
    setIsEditing(false);
    setShowForm(true);
  };

  const handleSave = async () => {
    try {
      if (isEditing && editForm.id) {
        await setDoc(doc(db, 'guidances', editForm.id), { ...editForm }, { merge: true });
      } else {
        const docRef = doc(collection(db, 'guidances'));
        const newGuidance = { ...editForm, createdAt: Timestamp.now() };
        await setDoc(docRef, newGuidance);
      }
      setShowForm(false);
    } catch(error) {
      handleFirestoreError(error, OperationType.WRITE, 'guidances');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("确定删除该指导方案吗？")) {
      try {
        await deleteDoc(doc(db, 'guidances', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `guidances/${id}`);
      }
    }
  };

  if (showForm) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200">
        <h3 className="text-xl font-bold mb-6">{isEditing ? '编辑指导方案' : '新增指导方案'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">方案标题</label>
            <input 
              type="text" 
              value={editForm.title || ''} 
              onChange={e => setEditForm({...editForm, title: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" 
              placeholder="例如：降压药服用指导"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">疾病分类</label>
            <select 
              value={editForm.diseaseType || ''} 
              onChange={e => setEditForm({...editForm, diseaseType: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none" 
            >
              <option value="">请选择疾病分类</option>
              {['高血压', '糖尿病', '冠心病', '高血脂', '心律不齐', '阿尔兹海默症', '帕金森', '哮喘', '普遍慢性病', '骨关节炎'].map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">指导分类</label>
            <select
              value={editForm.category || 'medication'}
              onChange={e => setEditForm({...editForm, category: e.target.value as any})}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none"
            >
              <option value="medication">用药指导</option>
              <option value="nursing">护理指导</option>
              <option value="followup">复查提醒</option>
              <option value="exercise">运动方案</option>
              <option value="diet">饮食建议</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">推荐频次</label>
            <select 
              value={editForm.frequency || ''} 
              onChange={e => setEditForm({...editForm, frequency: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none" 
            >
              <option value="">请选择推荐频次</option>
              {['1次/日', '2次/日', '3次/日', '早晚', '每餐', '每餐前', '每餐后', '每天', '每周', '每周1次', '3-4次/周', '每月', '每月1次', '每季度', '视情况而定'].map(freq => (
                <option key={freq} value={freq}>{freq}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">目标人群</label>
            <input 
              type="text" 
              value={editForm.targetAudience || ''} 
              onChange={e => setEditForm({...editForm, targetAudience: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              placeholder="例如：高血压患者"
            />
          </div>
          <div className="flex items-center gap-3 mt-6">
            <input 
              type="checkbox" 
              id="isEnabled"
              checked={editForm.isEnabled || false}
              onChange={e => setEditForm({...editForm, isEnabled: e.target.checked})}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            <label htmlFor="isEnabled" className="text-sm font-medium text-slate-700">启用该该指导方案</label>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">指导内容</label>
            <textarea 
              value={editForm.content || ''} 
              onChange={e => setEditForm({...editForm, content: e.target.value})}
              rows={4}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" 
              placeholder="详细的指导内容或说明..."
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
          <button onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200">取消</button>
          <button onClick={handleSave} className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700">保存方案</button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">慢病康复运动管理</h2>
          <p className="text-slate-500 text-sm font-medium">针对性健康指导方案与康复计划管理</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text"
              placeholder="搜索标题、病种或内容..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-64 shadow-sm"
            />
          </div>
          <div className="bg-slate-100 p-1 rounded-xl flex">
            <button 
              onClick={() => setViewMode('list')}
              className={cn(
                "p-2 rounded-lg transition-all",
                viewMode === 'list' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <List size={18} />
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-2 rounded-lg transition-all",
                viewMode === 'grid' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <LayoutGrid size={18} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => document.getElementById('guidance-import')?.click()}
              className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <Upload size={18} /> 批量导入
            </button>
            <input 
              type="file" 
              id="guidance-import" 
              className="hidden" 
              accept=".csv,.xls,.xlsx" 
              {...{ webkitdirectory: "", directory: "" } as any}
              onChange={(e) => {
                const files = Array.from(e.target.files || []) as File[];
                const validFiles = files.filter(f => f.name.endsWith('.csv') || f.name.endsWith('.xls') || f.name.endsWith('.xlsx'));
                if (validFiles.length > 0) {
                  alert(`成功选择了 ${validFiles.length} 个有效的 Excel/CSV 文件，将开始批量解析导入`);
                } else if (files.length > 0) {
                  alert(`未找到有效文件，请确保文件夹中包含 .csv 或 .xls 格式的文件`);
                }
              }}
            />
            <button 
               onClick={() => alert("功能开发中：将导出当前列表数据")}
               className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <Download size={18} /> 导出
            </button>
          </div>
          <button 
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2"
          >
            <Plus size={18} /> 新增指导
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border",
              activeCategory === cat.id 
                ? "bg-slate-800 text-white border-slate-800 shadow-md" 
                : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
            )}
          >
            <cat.icon size={14} className={activeCategory === cat.id ? "text-white" : cat.color} />
            {cat.label}
          </button>
        ))}
      </div>

      {viewMode === 'list' ? (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">指导方案/分类</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">目标人群/频次</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">内容描述</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">更新时间</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest w-12 text-center">状态</th>
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGuidances.map((guidance) => {
                const categoryInfo = categories.find(c => c.id === guidance.category);
                const Icon = categoryInfo?.icon || Info;
                return (
                  <tr key={guidance.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3 block">
                        <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center shadow-inner", categoryInfo?.bg, categoryInfo?.color)}>
                          <Icon size={18} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-800">{guidance.title}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-slate-500 font-medium">{categoryInfo?.label}</span>
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                              {guidance.diseaseType}
                            </span>
                          </div>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-bold text-slate-700">{guidance.targetAudience}</div>
                      <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{guidance.frequency || '视情况而定'}</div>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <p className="text-xs text-slate-500 truncate" title={guidance.content}>{guidance.content}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-[10px] font-mono font-bold text-slate-500 tracking-tighter">{guidance.updatedAt}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <Toggle enabled={guidance.isEnabled} onToggle={() => toggleGuidanceEnabled(guidance.id)} />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEdit(guidance)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit3 size={16} />
                        </button>
                        <button onClick={() => handleDelete(guidance.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuidances.map((guidance) => {
            const categoryInfo = categories.find(c => c.id === guidance.category);
            const Icon = categoryInfo?.icon || Info;
            
            return (
              <motion.div 
                layout
                key={guidance.id}
                className="group bg-white rounded-3xl border border-slate-200 p-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all relative overflow-hidden"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner", categoryInfo?.bg, categoryInfo?.color)}>
                    <Icon size={24} />
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">更新时间</span>
                    <span className="text-[10px] font-mono font-bold text-slate-500 tracking-tighter">{guidance.updatedAt}</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                      {guidance.diseaseType}
                    </span>
                    <Toggle enabled={guidance.isEnabled} onToggle={() => toggleGuidanceEnabled(guidance.id)} />
                  </div>
                  <h3 className="text-lg font-black text-slate-800 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                    {guidance.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mb-4 line-clamp-3">
                    {guidance.content}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">推荐频次</span>
                    <span className="text-[11px] font-bold text-slate-600">{guidance.frequency || '视情况而定'}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">目标人群</span>
                    <span className="text-[11px] font-bold text-slate-600">{guidance.targetAudience}</span>
                  </div>
                </div>

                <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleDelete(guidance.id)} className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:text-red-600 hover:bg-red-50 transition-all ml-1">
                    <Trash2 size={16} />
                  </button>
                  <button onClick={() => handleEdit(guidance)} className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:text-blue-600 hover:bg-blue-50 transition-all ml-1">
                    <Edit3 size={16} />
                  </button>
                </div>
              </motion.div>
            );
          })}

          <button onClick={handleAdd} className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-blue-300 hover:text-blue-600 hover:bg-white transition-all group min-h-[220px]">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
              <Plus size={24} />
            </div>
            <p className="text-sm font-bold">创建新引导方案</p>
          </button>
        </div>
      )}
    </motion.div>
  );
}

function RobotMgmtView() {
  const [robots, setRobots] = useState<Robot[]>([]);
  useEffect(() => {
    const q = query(collection(db, 'robots'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Robot));
      setRobots(data);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'robots'));
    return () => unsubscribe();
  }, []);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRobot, setSelectedRobot] = useState<Robot | null>(null);
  const [form, setForm] = useState<Partial<Robot>>({});
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const toggleRobotEnabled = async (id: string) => {
    const r = robots.find(item => item.id === id);
    if (!r) return;
    try {
      await setDoc(doc(db, 'robots', id), { enabled: !r.enabled }, { merge: true });
    } catch(err) {
      handleFirestoreError(err, OperationType.UPDATE, `robots/${id}`);
    }
  };

  const filteredRobots = robots.filter(r => 
    (filterType === 'all' || r.institutionType === filterType) &&
    (r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     r.sn.toLowerCase().includes(searchQuery.toLowerCase()) ||
     r.id.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const openModal = (robot?: Robot) => {
    if (robot) {
      setSelectedRobot(robot);
      setForm({ ...robot });
    } else {
      setSelectedRobot(null);
      setForm({
        name: '',
        model: 'JH-Alpha V1',
        sn: '',
        id: `R${Math.floor(Math.random() * 900000) + 100000}`,
        institutionType: 'home',
        institutionName: '',
        location: '',
        status: 'online',
        enabled: true,
        battery: 100,
        onboardingMethod: 'auto',
        lastActive: '刚刚'
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.sn || !form.id) {
      alert('请填写必要的基本信息');
      return;
    }
    
    try {
      if (selectedRobot) {
        await setDoc(doc(db, 'robots', selectedRobot.id), { ...form }, { merge: true });
      } else {
        await setDoc(doc(db, 'robots', form.id!), { ...form });
      }
      setIsModalOpen(false);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `robots/${form.id}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('确认注销并删除此机器人设备？')) {
      try {
        await deleteDoc(doc(db, 'robots', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `robots/${id}`);
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <h3 className="font-bold text-xl text-slate-800 shrink-0">机器人设备管理</h3>
          <div className="flex bg-slate-50 border border-slate-200 rounded-lg p-1 shadow-inner">
            {['all', 'hospital', 'community', 'home'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap",
                  filterType === type ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {type === 'all' && '全部'}
                {type === 'hospital' && '医院科室'}
                {type === 'community' && '社区站点'}
                {type === 'home' && '家庭住户'}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex flex-1 items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="搜索机器人名称/SN/ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
            />
          </div>

          <div className="bg-slate-100 p-1 rounded-lg flex items-center shrink-0">
            <button 
              onClick={() => setViewMode('list')}
              className={cn(
                "p-1.5 rounded-md transition-all",
                viewMode === 'list' ? "bg-white shadow-sm text-blue-600" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <List size={18} />
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-1.5 rounded-md transition-all",
                viewMode === 'grid' ? "bg-white shadow-sm text-blue-600" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <LayoutGrid size={18} />
            </button>
          </div>
          
          <button 
            onClick={() => openModal()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95 shrink-0 whitespace-nowrap"
          >
            <Plus size={18} /> 新增机器人
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRobots.map((robot) => (
            <div key={robot.id} className={cn(
              "bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all group",
              !robot.enabled && "opacity-60 grayscale-[0.5]"
            )}>
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner transition-colors",
                      robot.status === 'error' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500 group-hover:bg-blue-600 group-hover:text-white'
                    )}>
                      <Bot size={32} />
                    </div>
                    <div>
                      <h4 className={cn("font-bold text-lg text-slate-800", !robot.enabled && "text-slate-400")}>{robot.name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{robot.model}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 text-right">
                    <div className="flex items-center gap-2">
                       <span className={cn(
                        "px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-tight",
                        robot.status === 'online' ? 'bg-green-100 text-green-700' : 
                        robot.status === 'working' ? 'bg-blue-100 text-blue-700 animate-pulse' :
                        robot.status === 'error' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-500'
                      )}>
                        {robot.status === 'online' ? '在线' : 
                         robot.status === 'working' ? '作业中' : 
                         robot.status === 'error' ? '故障' : 
                         robot.status === 'standby' ? '待机' : '离线'}
                      </span>
                      <Toggle enabled={robot.enabled} onToggle={() => toggleRobotEnabled(robot.id)} />
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono font-bold">编号: {robot.id}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <div className="flex items-center gap-2 mb-1">
                        <ShieldCheck size={14} className="text-blue-500" />
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">绑定机构</span>
                      </div>
                      <div className="text-xs font-bold text-slate-700 truncate">{robot.institutionName}</div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin size={14} className="text-indigo-500" />
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">实时位置</span>
                      </div>
                      <div className="text-xs font-bold text-slate-700 truncate">{robot.location}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5" title="剩余电量">
                        <BatteryMedium size={14} className={cn(robot.battery < 20 ? 'text-red-500' : 'text-green-500')} />
                        <span className="text-xs font-bold text-slate-600">{robot.battery}%</span>
                      </div>
                      <div className="flex items-center gap-1.5" title="最后在线">
                        <Clock size={14} className="text-slate-300" />
                        <span className="text-xs font-bold text-slate-400">{robot.lastActive}</span>
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded font-bold uppercase tracking-tight">
                      序列号: {robot.sn}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50/50 border-t border-slate-100 p-4 flex gap-2">
                <button className={cn(
                  "flex-1 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 transition-all shadow-sm",
                  robot.enabled ? "hover:bg-blue-600 hover:text-white hover:border-blue-600" : "cursor-not-allowed opacity-50"
                )} disabled={!robot.enabled}>
                  远程控制
                </button>
                <button className={cn(
                  "flex-1 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 transition-all shadow-sm",
                   robot.enabled ? "hover:bg-blue-600 hover:text-white hover:border-blue-600" : "cursor-not-allowed opacity-50"
                )} disabled={!robot.enabled}>
                  作业日志
                </button>
                <button 
                  onClick={() => openModal(robot)}
                  className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
                >
                  <Settings size={14} />
                </button>
              </div>
            </div>
          ))}
          <div 
            onClick={() => openModal()}
            className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-12 text-slate-400 hover:text-blue-500 hover:border-blue-300 transition-all cursor-pointer bg-slate-50/30 group"
          >
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-blue-50 transition-colors">
              <Plus size={32} />
            </div>
            <span className="text-sm font-black uppercase tracking-widest">入网新设备</span>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">设备名称 / ID</th>
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">型号 / SN</th>
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">状态</th>
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">启用状态</th>
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">电量</th>
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">绑定机构与位置</th>
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredRobots.map((robot) => (
                <tr key={robot.id} className={cn(
                  "border-b border-slate-50 last:border-0 hover:bg-slate-50/30 transition-colors",
                  !robot.enabled && "opacity-60 bg-slate-50/20"
                )}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        robot.status === 'error' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-600'
                      )}>
                        <Bot size={20} />
                      </div>
                      <div>
                        <p className={cn("text-sm font-bold text-slate-700 leading-none mb-1", !robot.enabled && "text-slate-400")}>{robot.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">编号: {robot.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-xs font-bold text-slate-600">{robot.model}</p>
                      <p className="text-[9px] text-slate-400 tracking-tight">序列号: {robot.sn}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-black uppercase",
                      robot.status === 'online' ? 'bg-green-100 text-green-700' : 
                      robot.status === 'working' ? 'bg-blue-100 text-blue-700 animate-pulse' :
                      robot.status === 'error' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-500'
                    )}>
                      {robot.status === 'online' ? '在线' : 
                       robot.status === 'working' ? '作业' : 
                       robot.status === 'error' ? '故障' : 
                       robot.status === 'standby' ? '待机' : '离线'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Toggle enabled={robot.enabled} onToggle={() => toggleRobotEnabled(robot.id)} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <BatteryMedium size={12} className={cn(robot.battery < 20 ? 'text-red-500' : 'text-green-500')} />
                      <span className="text-xs font-bold text-slate-600">{robot.battery}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="flex items-center gap-1 mb-0.5">
                        <ShieldCheck size={10} className="text-blue-500" />
                        <span className="text-xs font-medium text-slate-600">{robot.institutionName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={10} className="text-slate-400" />
                        <span className="text-[10px] text-slate-400">{robot.location}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                       <button title="远程控制" disabled={!robot.enabled} className={cn(
                         "p-1.5 text-slate-400 rounded transition-colors",
                         robot.enabled ? "hover:bg-blue-50 hover:text-blue-600" : "cursor-not-allowed opacity-30"
                       )}>
                        <Smartphone size={14} />
                      </button>
                      <button onClick={() => openModal(robot)} className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-blue-600 rounded transition-colors">
                        <Settings size={14} />
                      </button>
                      <button onClick={() => handleDelete(robot.id)} className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative overflow-hidden"
            >
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">{selectedRobot ? '编辑机器人配置' : '入网新机器人'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <Plus className="rotate-45" size={24} />
                </button>
              </div>

              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 1. 基础标识 */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                       <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                       <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest">1. 基础标识</h4>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">机器人名称 / 编号</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        placeholder="例如: 智护-A08"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">设备型号 / 版本</label>
                      <select
                        value={form.model}
                        onChange={e => setForm({ ...form, model: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                      >
                        <option value="JH-Alpha V1">JH-Alpha V1 (专业版)</option>
                        <option value="JH-Beta V2">JH-Beta V2 (家庭版)</option>
                        <option value="JH-Gamma V3">JH-Gamma V3 (旗舰版)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">设备 SN 号</label>
                      <input
                        type="text"
                        value={form.sn}
                        onChange={e => setForm({ ...form, sn: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-mono"
                        placeholder="JH-SN-XXXX"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">设备 ID</label>
                      <input
                        type="text"
                        value={form.id}
                        onChange={e => setForm({ ...form, id: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-mono"
                        placeholder="唯一识别码"
                        disabled={!!selectedRobot}
                      />
                    </div>
                  </div>

                  {/* 2. 归属与位置 */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                       <div className="w-1 h-4 bg-indigo-600 rounded-full"></div>
                       <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest">2. 归属与位置</h4>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">归属机构类型</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'hospital', label: '医院', icon: <Building2 size={14} /> },
                          { id: 'community', label: '社区', icon: <Shield size={14} /> },
                          { id: 'home', label: '家庭', icon: <Home size={14} /> }
                        ].map(type => (
                          <button
                            key={type.id}
                            onClick={() => setForm({ ...form, institutionType: type.id as any })}
                            className={cn(
                              "flex flex-col items-center gap-2 p-3 rounded-xl border text-[10px] font-bold transition-all",
                              form.institutionType === type.id 
                                ? "bg-indigo-50 border-indigo-200 text-indigo-600" 
                                : "bg-white border-slate-100 text-slate-400 hover:bg-slate-50"
                            )}
                          >
                            {type.icon}
                            {type.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">绑定机构名称</label>
                      <input
                        type="text"
                        value={form.institutionName}
                        onChange={e => setForm({ ...form, institutionName: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        placeholder="例如: 第九人民医院-神经内科"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">绑定位置 (所属地点)</label>
                      <div className="relative">
                        <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={form.location}
                          onChange={e => setForm({ ...form, location: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                          placeholder="例如: A区-302室"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">入网方式</label>
                      <select
                        value={form.onboardingMethod}
                        onChange={e => setForm({ ...form, onboardingMethod: e.target.value as any })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                      >
                        <option value="auto">WiFi/4G/5G 自动配网</option>
                        <option value="qrcode">扫码极速绑定</option>
                        <option value="batch">批量导入授权</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 3. 实时状态预设 */}
                <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">初始状态</label>
                      <select
                        value={form.status}
                        onChange={e => setForm({ ...form, status: e.target.value as any })}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      >
                        <option value="online">在线 (就绪)</option>
                        <option value="offline">离线 (入库)</option>
                        <option value="standby">待机 (休眠)</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">当前电量</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={form.battery}
                        onChange={e => setForm({ ...form, battery: parseInt(e.target.value) })}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-3"
                      />
                      <div className="flex justify-between text-[10px] font-bold text-slate-400">
                        <span>0%</span>
                        <span className="text-blue-600">{form.battery}%</span>
                        <span>100%</span>
                      </div>
                   </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-200 flex gap-3">
                {selectedRobot && (
                  <button
                    onClick={() => {
                      handleDelete(selectedRobot.id);
                      setIsModalOpen(false);
                    }}
                    className="px-6 py-3 bg-white border border-red-100 text-red-500 rounded-xl font-bold hover:bg-red-50 transition-all active:scale-95 shadow-sm mr-auto"
                  >
                    注销设备
                  </button>
                )}
                <div className="flex gap-3 flex-1 justify-end">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-8 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-100 transition-all active:scale-95 shadow-sm"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-100"
                  >
                    确认保存
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
  const [archives, setArchives] = useState<HealthArchive[]>([]);
  useEffect(() => {
    const q = query(
      collection(db, 'archives'), 
      orderBy('updatedAt', 'desc'),
      limit(3)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HealthArchive));
      setArchives(data);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'archives'));
    return () => unsubscribe();
  }, []);
  const [selectedArchive, setSelectedArchive] = useState<HealthArchive | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<HealthArchive | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [customTagInput, setCustomTagInput] = useState('');

  const filteredArchives = archives.filter(a => 
    a.name.includes(searchQuery) || 
    a.id.includes(searchQuery) ||
    a.conditions.some(c => c.includes(searchQuery))
  );

  const startEdit = (archive: HealthArchive) => {
    setEditForm({ ...archive });
    setIsEditing(true);
    setSelectedArchive(archive);
  };

  const createNewArchive = () => {
    const newArchive: HealthArchive = {
      id: `HA-${Math.floor(Math.random() * 90000) + 10000}`,
      robotId: MOCK_ROBOTS[0]?.id || '',
      name: '',
      gender: 'male',
      age: 65,
      bloodType: 'A+',
      height: 170,
      weight: 65,
      conditions: [],
      diagnoses: [],
      medications: [],
      emergencyContacts: [{ name: '', relation: '', phone: '' }],
      medicalOrders: [],
      lastExamDate: new Date().toISOString().split('T')[0],
      status: 'active'
    };
    setEditForm(newArchive);
    setSelectedArchive(newArchive);
    setIsEditing(true);
  };

  const toggleStatus = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const arc = archives.find(a => a.id === id);
    if (!arc) return;
    try {
      await setDoc(doc(db, 'archives', id), { status: arc.status === 'inactive' ? 'active' : 'inactive', updatedAt: Timestamp.now() }, { merge: true });
    } catch(err) {
      handleFirestoreError(err, OperationType.UPDATE, `archives/${id}`);
    }
  };

  const saveEdit = async () => {
    if (editForm) {
      try {
        await setDoc(doc(db, 'archives', editForm.id), { ...editForm, updatedAt: Timestamp.now() }, { merge: true });
        setSelectedArchive(editForm);
        setIsEditing(false);
      } catch(err) {
        handleFirestoreError(err, OperationType.WRITE, `archives/${editForm.id}`);
      }
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

  const addCustomTag = () => {
    if (!editForm || !customTagInput.trim()) return;
    if (!editForm.conditions.includes(customTagInput.trim())) {
      setEditForm({
        ...editForm,
        conditions: [...editForm.conditions, customTagInput.trim()]
      });
    }
    setCustomTagInput('');
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
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-slate-500 text-sm font-semibold uppercase tracking-wider">
            共有 {filteredArchives.length} 条健康档案数据
          </h3>
          <div className="flex items-center gap-3 mt-2">
            <div className="relative group">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text" 
                placeholder="搜索姓名、ID或疾病标签..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
              />
            </div>
            <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
              <button 
                onClick={() => setViewMode('grid')}
                className={cn(
                  "p-1.5 rounded transition-all",
                  viewMode === 'grid' ? "bg-blue-50 text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                )}
                title="网格视图"
              >
                <LayoutGrid size={18} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={cn(
                  "p-1.5 rounded transition-all",
                  viewMode === 'list' ? "bg-blue-50 text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                )}
                title="列表视图"
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>
        <button 
          onClick={createNewArchive}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-100"
        >
          <Plus size={18} /> 新建档案
        </button>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredArchives.map((person) => (
            <div 
              key={person.id} 
              className={cn(
                "bg-white p-6 rounded-xl shadow-sm border transition-all hover:shadow-md cursor-pointer group relative overflow-hidden",
                person.status === 'inactive' ? "opacity-60 border-slate-200" : "border-slate-200 hover:border-blue-400"
              )}
              onClick={() => { setSelectedArchive(person); setIsEditing(false); }}
            >
              {person.status === 'inactive' && (
                <div className="absolute top-2 right-12 px-2 py-0.5 bg-slate-100 text-slate-400 text-[10px] font-bold rounded z-10">
                  已停用
                </div>
              )}
              <div className="flex gap-6">
                <div className="w-24 h-24 rounded-xl bg-slate-50 border border-slate-100 flex-shrink-0 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 transition-colors shadow-inner">
                  <UserCircle size={48} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xl font-bold text-slate-800">{person.name} <span className="text-sm font-normal text-slate-400 ml-2">{person.age}岁 / {person.gender === 'male' ? '男' : '女'}</span></h4>
                    <div className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded">ID: {person.id}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-y-3 mb-4">
                    <div className="text-xs col-span-2">
                      <span className="text-slate-400 font-medium">疾病标签:</span> 
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {person.conditions.map(c => <span key={c} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium">{c}</span>)}
                        {person.conditions.length === 0 && <span className="text-slate-300 italic">暂无标签</span>}
                      </div>
                    </div>
                    <div className="text-xs">
                      <span className="text-slate-400 font-medium">主要诊断:</span> 
                      <span className="ml-2 font-semibold text-slate-700 truncate block mt-1">{person.diagnoses[0] || '暂无临床诊断'}</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-slate-400 font-medium">第一联系人:</span> 
                      <span className="ml-2 font-semibold text-slate-700 block mt-1 leading-tight">{person.emergencyContacts[0]?.name || '未填'} ({person.emergencyContacts[0]?.phone || '-'})</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-50">
                    <span className="font-medium">绑定机器人: {MOCK_ROBOTS.find(r => r.id === person.robotId)?.name || '未绑定'}</span>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={(e) => toggleStatus(person.id, e)}
                        className={cn(
                          "flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold transition-all border",
                          person.status === 'inactive'
                            ? "bg-green-50 text-green-600 border-green-100 hover:bg-green-100"
                            : "bg-red-50 text-red-600 border-red-100 hover:bg-red-100"
                        )}
                      >
                        <Power size={12} />
                        {person.status === 'inactive' ? '启用' : '不启用'}
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); startEdit(person); }}
                        className="text-blue-500 font-bold hover:text-blue-600 transition-colors uppercase tracking-tight"
                      >
                        编辑档案 →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">基本档案</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">诊断/标签</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">紧急联系人</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">机器人</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredArchives.map((person) => (
                <tr 
                  key={person.id} 
                  className={cn(
                    "hover:bg-slate-50/50 transition-colors cursor-pointer group",
                    person.status === 'inactive' ? "opacity-60" : ""
                  )}
                  onClick={() => { setSelectedArchive(person); setIsEditing(false); }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-100 transition-colors">
                        <UserCircle size={24} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">{person.name}</div>
                        <div className="text-[10px] text-slate-400 font-bold">{person.age}岁 · {person.gender === 'male' ? '男' : '女'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-[11px] font-semibold text-slate-700 truncate max-w-[150px] mb-1">{person.diagnoses[0] || '-'}</div>
                    <div className="flex flex-wrap gap-1">
                      {person.conditions.slice(0, 2).map(c => (
                        <span key={c} className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-bold">{c}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs font-bold text-slate-700">{person.emergencyContacts[0]?.name || '-'}</div>
                    <div className="text-[10px] text-slate-400">{person.emergencyContacts[0]?.phone || '-'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                      {MOCK_ROBOTS.find(r => r.id === person.robotId)?.name || '未绑定'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button 
                        onClick={(e) => toggleStatus(person.id, e)}
                        className={cn(
                          "p-2 rounded-lg transition-colors border shadow-sm",
                          person.status === 'inactive' ? "text-green-600 bg-white border-green-100 hover:bg-green-50 font-bold text-[10px] uppercase flex items-center gap-1" : "text-red-600 bg-white border-red-100 hover:bg-red-50 font-bold text-[10px] uppercase flex items-center gap-1"
                        )}
                        title={person.status === 'inactive' ? '启用' : '不启用'}
                      >
                        <Power size={14} />
                        <span>{person.status === 'inactive' ? '启用' : '不启用'}</span>
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); startEdit(person); }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-100 bg-white shadow-sm"
                        title="编辑"
                      >
                        <Edit3 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
                  <p className="text-white/70 text-sm font-medium">档案编号: {selectedArchive.id} | 最后更新: {
                    selectedArchive.updatedAt?.toDate 
                      ? selectedArchive.updatedAt.toDate().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-').slice(0, 16)
                      : '2026-04-20'
                  }</p>
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
              {/* Basic Identity Section */}
              <section>
                <div className="flex items-center gap-2 text-slate-800 mb-6 border-l-4 border-blue-600 pl-4">
                  <h5 className="font-bold uppercase tracking-widest text-sm text-slate-800">档案基本信息</h5>
                </div>
                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">用户姓名</label>
                       <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold" value={editForm?.name} onChange={e => editForm && setEditForm({...editForm, name: e.target.value})} placeholder="输入姓名" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">年龄</label>
                       <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold" value={editForm?.age} onChange={e => editForm && setEditForm({...editForm, age: Number(e.target.value)})} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">性别</label>
                       <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold" value={editForm?.gender} onChange={e => editForm && setEditForm({...editForm, gender: e.target.value as any})}>
                          <option value="male">男</option>
                          <option value="female">女</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">绑定机器人</label>
                        <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold" value={editForm?.robotId} onChange={e => editForm && setEditForm({...editForm, robotId: e.target.value})}>
                          <option value="">未绑定</option>
                          {MOCK_ROBOTS.map(r => (
                            <option key={r.id} value={r.id}>{r.name} ({r.sn})</option>
                          ))}
                        </select>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-4">
                    <MetricBox label="年龄 / 性别" value={`${selectedArchive.age}岁 / ${selectedArchive.gender === 'male' ? '男' : '女'}`} />
                    <MetricBox label="绑定机器人" value={MOCK_ROBOTS.find(r => r.id === selectedArchive.robotId)?.name || '未绑定'} />
                    <MetricBox label="最后体检" value={selectedArchive.lastExamDate} />
                    <MetricBox label="档案状态" value={selectedArchive.status === 'active' ? '正常' : '已停用'} />
                  </div>
                )}
              </section>

              {/* Health Indicators section */}
              <section className="pt-6 border-t border-slate-100">
                <div className="flex items-center gap-2 text-slate-800 mb-6 border-l-4 border-blue-500 pl-4">
                  <h5 className="font-bold uppercase tracking-widest text-sm">基础体征数据</h5>
                </div>
                {isEditing ? (
                  <div className="grid grid-cols-4 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">身高</label>
                       <div className="relative">
                        <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-10 py-2 text-sm font-bold outline-none focus:border-blue-500 transition-all" value={editForm?.height} onChange={e => editForm && setEditForm({...editForm, height: Number(e.target.value)})} />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">cm</span>
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">体重</label>
                       <div className="relative">
                        <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-10 py-2 text-sm font-bold outline-none focus:border-blue-500 transition-all" value={editForm?.weight} onChange={e => editForm && setEditForm({...editForm, weight: Number(e.target.value)})} />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">kg</span>
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">血型</label>
                       <select 
                         className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer" 
                         value={editForm?.bloodType} 
                         onChange={e => editForm && setEditForm({...editForm, bloodType: e.target.value})}
                       >
                         {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
                           <option key={type} value={type}>{type}</option>
                         ))}
                       </select>
                    </div>
                    <MetricBox 
                      label="BMI" 
                      value={(editForm! && editForm.weight / ((editForm.height/100)**2)).toFixed(1)} 
                      info="正常范围: 18.5 - 23.9&#10;偏瘦: < 18.5&#10;超重: 24.0 - 27.9&#10;肥胖: ≥ 28.0"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-4">
                    <MetricBox label="身高" value={`${selectedArchive.height}cm`} />
                    <MetricBox label="体重" value={`${selectedArchive.weight}kg`} />
                    <MetricBox label="血型" value={selectedArchive.bloodType} />
                    <MetricBox 
                      label="BMI" 
                      value={(selectedArchive.weight / ((selectedArchive.height/100)**2)).toFixed(1)} 
                      info="正常范围: 18.5 - 23.9&#10;偏瘦: < 18.5&#10;超重: 24.0 - 27.9&#10;肥胖: ≥ 28.0"
                    />
                  </div>
                )}
              </section>

              {/* Disease Tags Section */}
              <section>
                <div className="flex items-center gap-2 text-slate-800 mb-6 border-l-4 border-indigo-500 pl-4">
                  <h5 className="font-bold uppercase tracking-widest text-sm">疾病标签 (选择)</h5>
                </div>
                <div className="flex flex-wrap gap-2">
                  {/* Standard predefined tags */}
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
                  
                  {/* Custom tags added by user */}
                  {isEditing && editForm?.conditions.filter(t => !DISEASE_TAGS.includes(t)).map(tag => (
                    <button
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white border border-indigo-600 shadow-lg shadow-indigo-100 flex items-center gap-1.5 transition-all group"
                    >
                      {tag}
                      <Plus className="rotate-45 opacity-60 group-hover:opacity-100" size={14} />
                    </button>
                  ))}

                  {/* Non-editing mode custom tags */}
                  {!isEditing && selectedArchive.conditions.filter(t => !DISEASE_TAGS.includes(t)).map(tag => (
                    <div 
                      key={tag}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200"
                    >
                      {tag}
                    </div>
                  ))}

                  {/* Add custom tag input */}
                  {isEditing && (
                    <div className="flex items-center gap-2 ml-2">
                      <input
                        type="text"
                        placeholder="输入自定义标签..."
                        value={customTagInput}
                        onChange={(e) => setCustomTagInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addCustomTag()}
                        className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all w-32"
                      />
                      <button
                        onClick={addCustomTag}
                        className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-all border border-indigo-100"
                        title="添加标签"
                      >
                        <PlusCircle size={16} />
                      </button>
                    </div>
                  )}
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
                            <select 
                              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold"
                              value={order.frequency}
                              onChange={e => {
                                if (!editForm) return;
                                const newOrders = editForm.medicalOrders.map(o => o.id === order.id ? {...o, frequency: e.target.value} : o);
                                setEditForm({ ...editForm, medicalOrders: newOrders });
                              }}
                            >
                              <option value="">请选择频次</option>
                              <option value="1次/日">1次/日</option>
                              <option value="2次/日">2次/日</option>
                              <option value="3次/日">3次/日</option>
                              <option value="4次/日">4次/日</option>
                              <option value="隔日1次">隔日1次</option>
                              <option value="1次/周">1次/周</option>
                              <option value="2次/周">2次/周</option>
                              <option value="3次/周">3次/周</option>
                              <option value="按需">按需</option>
                              <option value="1次/月">1次/月</option>
                              <option value="其他">其他</option>
                            </select>
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
                  
                  {isEditing && (
                    <button 
                      onClick={addEmergencyContact}
                      className="border-2 border-dashed border-slate-200 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                        <UserPlus size={20} />
                      </div>
                      <span className="text-xs font-bold">添加新联系人</span>
                    </button>
                  )}
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

function MetricBox({ label, value, info }: { label: string, value: string, info?: string }) {
  return (
    <div className="p-4 rounded-xl bg-slate-50 text-center border border-slate-200 shadow-sm transition-all hover:bg-white hover:shadow-md cursor-default relative group/metric">
      <div className="flex items-center justify-center gap-1 mb-1">
        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{label}</p>
        {info && (
          <div className="relative group/tooltip">
            <Info size={10} className="text-slate-300 hover:text-blue-500 transition-colors cursor-help" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-slate-800 text-white text-[10px] rounded-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-[110] shadow-xl pointer-events-none">
              <div className="font-bold border-b border-white/10 pb-1 mb-1 italic">参考值:</div>
              <div className="whitespace-pre-line leading-relaxed">{info}</div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-slate-800"></div>
            </div>
          </div>
        )}
      </div>
      <p className="text-lg font-mono font-bold text-blue-600 leading-none">{value}</p>
    </div>
  );
}

function AlertsView() {
  const [alerts, setAlerts] = useState<AlertRule[]>([]);
  useEffect(() => {
    const q = query(collection(db, 'alerts'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AlertRule));
      setAlerts(data);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'alerts'));
    return () => unsubscribe();
  }, []);
  const [selectedAlert, setSelectedAlert] = useState<AlertRule | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<Partial<AlertRule>>({});
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchQuery, setSearchQuery] = useState('');

  const allAvailableContacts = Array.from(new Set([
    ...MOCK_ARCHIVES.flatMap(a => a.emergencyContacts.map(c => c.name)),
    '子女', '社区物业', '居委会', '主治医生'
  ]));

  const toggleAlertStatus = async (id: string) => {
    const alert = alerts.find(a => a.id === id);
    if (!alert) return;
    try {
      await setDoc(doc(db, 'alerts', id), { enabled: !alert.enabled }, { merge: true });
    } catch(err) {
      handleFirestoreError(err, OperationType.UPDATE, `alerts/${id}`);
    }
  };

  const filteredAlerts = alerts.filter(a => 
    a.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (a.event === 'fall' && '跌倒实时监测'.includes(searchQuery)) ||
    (a.event === 'sudden_illness' && '突发疾病告警'.includes(searchQuery)) ||
    (a.event === 'vital_anomaly' && '特殊指标阈值告警'.includes(searchQuery)) ||
    (a.event === 'routine_notice' && '常规任务完成情况'.includes(searchQuery))
  );

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

  const handleSave = async () => {
    if (!form.event || !form.description) return;
    
    try {
      if (selectedAlert) {
        await setDoc(doc(db, 'alerts', selectedAlert.id), { ...form }, { merge: true });
      } else {
        const id = Math.random().toString(36).substr(2, 9);
        await setDoc(doc(db, 'alerts', id), { ...form, id });
      }
      setIsModalOpen(false);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'alerts');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('确认删除此告警规则？')) {
      try {
        await deleteDoc(doc(db, 'alerts', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `alerts/${id}`);
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h3 className="font-bold text-slate-800 text-lg">异常预警规则设置</h3>
          <p className="text-xs text-slate-400">配置机器人检测到异常时的响应流程与分级告警机制</p>
        </div>
        
        <div className="flex flex-1 items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="搜索规则描述或事件类型..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
            />
          </div>

          <div className="bg-slate-100 p-1 rounded-lg flex items-center shrink-0">
            <button 
              onClick={() => setViewMode('list')}
              className={cn(
                "p-1.5 rounded-md transition-all",
                viewMode === 'list' ? "bg-white shadow-sm text-blue-600" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <List size={18} />
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-1.5 rounded-md transition-all",
                viewMode === 'grid' ? "bg-white shadow-sm text-blue-600" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <LayoutGrid size={18} />
            </button>
          </div>
          
          <button 
            onClick={() => openModal()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg active:scale-95 whitespace-nowrap"
          >
            + 新增规则
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAlerts.map((alert) => (
            <div key={alert.id} className={cn(
              "bg-white rounded-xl p-6 shadow-sm border border-slate-200 relative overflow-hidden group hover:shadow-md transition-all",
              !alert.enabled && "opacity-60 bg-slate-50 border-slate-100"
            )}>
              <div className={cn(
                "absolute top-0 right-0 px-4 py-1 text-[10px] font-black uppercase text-white rounded-bl-xl shadow-sm",
                !alert.enabled ? 'bg-slate-400' :
                alert.level === 'critical' ? 'bg-red-500' : 
                alert.level === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
              )}>
                {alert.level === 'critical' ? '紧急 L3' : 
                 alert.level === 'warning' ? '警告 L2' : '提示 L1'}
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner",
                  alert.level === 'critical' ? 'bg-red-50' : 
                  alert.level === 'warning' ? 'bg-amber-50' : 'bg-blue-50'
                )}>
                  {alert.event === 'fall' ? (
                    <AlertCircle className="text-red-500" />
                  ) : alert.event === 'vital_anomaly' ? (
                    <Activity className="text-amber-500" />
                  ) : alert.event === 'routine_notice' ? (
                    <Bell className="text-blue-500" />
                  ) : (
                    <AlertTriangle className={
                      alert.level === 'critical' ? 'text-red-500' : 
                      alert.level === 'warning' ? 'text-amber-500' : 'text-blue-500'
                    } />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{
                    alert.event === 'fall' ? '跌倒实时监测' : 
                    alert.event === 'sudden_illness' ? '突发疾病告警' :
                    alert.event === 'vital_anomaly' ? '特殊指标阈值告警' : 
                    alert.event === 'routine_notice' ? '常规任务完成情况' : alert.event
                  }</h4>
                  <p className="text-xs text-slate-400 font-medium">{alert.description}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-2 tracking-widest">推送通知人</p>
                  <div className="flex flex-wrap gap-2">
                    {alert.notifyPersons.map(p => (
                      <span key={p} className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 shadow-sm">{p}</span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    {alert.enabled && <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>}
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                      {alert.enabled ? '监测运行中' : '规则已禁用'}
                    </span>
                    <Toggle enabled={alert.enabled} onToggle={() => toggleAlertStatus(alert.id)} />
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
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">告警事件</th>
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">级别</th>
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">推送人员</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">启用状态</th>
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlerts.map((alert) => (
                <tr key={alert.id} className={cn(
                  "border-b border-slate-50 last:border-0 hover:bg-slate-50/30 transition-colors",
                  !alert.enabled && "opacity-60 bg-slate-50/40"
                )}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center",
                        alert.level === 'critical' ? 'bg-red-50 text-red-500' : 
                        alert.level === 'warning' ? 'bg-amber-50 text-amber-500' : 'bg-blue-50 text-blue-500'
                      )}>
                        {alert.event === 'fall' ? <AlertCircle size={16} /> : 
                         alert.event === 'vital_anomaly' ? <Activity size={16} /> : 
                         alert.event === 'routine_notice' ? <Bell size={16} /> : <AlertTriangle size={16} />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-700 leading-none mb-1">{
                          alert.event === 'fall' ? '跌倒实时监测' : 
                          alert.event === 'sudden_illness' ? '突发疾病告警' :
                          alert.event === 'vital_anomaly' ? '特殊指标阈值告警' : 
                          alert.event === 'routine_notice' ? '常规任务完成情况' : alert.event
                        }</p>
                        <p className="text-[10px] text-slate-400 truncate max-w-[200px]">{alert.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-black uppercase",
                      alert.level === 'critical' ? 'bg-red-100 text-red-600' : 
                      alert.level === 'warning' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                    )}>
                      {alert.level === 'critical' ? 'L3' : alert.level === 'warning' ? 'L2' : 'L1'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex -space-x-2">
                       {alert.notifyPersons.map((p, i) => (
                         <div key={i} className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[8px] font-black text-slate-600" title={p}>
                           {p.charAt(0)}
                         </div>
                       ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Toggle enabled={alert.enabled} onToggle={() => toggleAlertStatus(alert.id)} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openModal(alert)} className="p-1.5 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded transition-colors">
                        <Edit3 size={14} />
                      </button>
                      <button onClick={() => handleDelete(alert.id)} className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
                      <option value="info">普通提示 L1 (Blue)</option>
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
                        <select
                          value={person}
                          onChange={e => {
                            const newPersons = [...(form.notifyPersons || [])];
                            newPersons[index] = e.target.value;
                            setForm({ ...form, notifyPersons: newPersons });
                          }}
                          className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none"
                        >
                          <option value="" disabled>选择通知人...</option>
                          {allAvailableContacts.map(contact => (
                            <option key={contact} value={contact}>{contact}</option>
                          ))}
                        </select>
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
  const [thresholds, setThresholds] = useState<IndicatorThreshold[]>([]);
  useEffect(() => {
    const q = query(collection(db, 'thresholds'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as IndicatorThreshold));
      setThresholds(data);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'thresholds'));
    return () => unsubscribe();
  }, []);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState('标准成人');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchQuery, setSearchQuery] = useState('');

  const [editingIndicator, setEditingIndicator] = useState<IndicatorThreshold | null>(null);
  const [editMin, setEditMin] = useState(0);
  const [editMax, setEditMax] = useState(0);

  const toggleThresholdStatus = async (id: string) => {
    const t = thresholds.find(item => item.id === id);
    if (!t) return;
    try {
      await setDoc(doc(db, 'thresholds', id), { enabled: !t.enabled }, { merge: true });
    } catch(err) {
      handleFirestoreError(err, OperationType.UPDATE, `thresholds/${id}`);
    }
  };

  const filteredThresholds = thresholds.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.templateName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openEditModal = (indicator: IndicatorThreshold) => {
    setEditingIndicator(indicator);
    setEditMin(indicator.minVal);
    setEditMax(indicator.maxVal);
  };

  const saveIndicatorThreshold = async () => {
    if (editingIndicator) {
      try {
        await setDoc(doc(db, 'thresholds', editingIndicator.id), { minVal: editMin, maxVal: editMax }, { merge: true });
        setEditingIndicator(null);
      } catch(err) {
        handleFirestoreError(err, OperationType.UPDATE, `thresholds/${editingIndicator.id}`);
      }
    }
  };

  const templates = [
    { name: '标准成人', description: '适用于18-65岁健康成人', count: 12 },
    { name: '高龄护理', description: '针对75岁以上高龄老人基准', count: 15 },
    { name: '协和医院实验室指标', description: '北京协和医院临床检验科参考标准', count: 48 },
  ];

  const handleImport = (source: string) => {
    if (source === 'UnionHospital') {
      const unionIndicators: IndicatorThreshold[] = [
        { id: `u-${Date.now()}-1`, name: '总胆固醇 (TC)', type: 'lab', unit: 'mmol/L', minVal: 2.8, maxVal: 5.18, templateName: '协和医院实验室指标', enabled: true },
        { id: `u-${Date.now()}-2`, name: '甘油三酯 (TG)', type: 'lab', unit: 'mmol/L', minVal: 0, maxVal: 1.7, templateName: '协和医院实验室指标', enabled: true },
        { id: `u-${Date.now()}-3`, name: '谷丙转氨酶 (ALT)', type: 'lab', unit: 'U/L', minVal: 7, maxVal: 40, templateName: '协和医院实验室指标', enabled: true },
        { id: `u-${Date.now()}-4`, name: '血清肌酐 (Scr)', type: 'lab', unit: 'μmol/L', minVal: 44, maxVal: 106, templateName: '协和医院实验室指标', enabled: true },
        { id: `u-${Date.now()}-5`, name: '糖化血红蛋白 (HbA1c)', type: 'lab', unit: '%', minVal: 4.0, maxVal: 6.0, templateName: '协和医院实验室指标', enabled: true },
      ];
      setThresholds([...thresholds, ...unionIndicators]);
      setCurrentTemplate('协和医院实验室指标');
    }
    setIsImportModalOpen(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="shrink-0">
          <h3 className="font-bold text-lg text-slate-800">健康指标标准设置</h3>
          <p className="text-xs text-slate-400">从模板导入或自定义生命体征、实验室指标基准</p>
        </div>
        
        <div className="flex flex-1 items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="搜索指标或模板..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
            />
          </div>

          <div className="bg-slate-100 p-1 rounded-lg flex items-center shrink-0">
            <button 
              onClick={() => setViewMode('list')}
              className={cn(
                "p-1.5 rounded-md transition-all",
                viewMode === 'list' ? "bg-white shadow-sm text-blue-600" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <List size={18} />
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-1.5 rounded-md transition-all",
                viewMode === 'grid' ? "bg-white shadow-sm text-blue-600" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <LayoutGrid size={18} />
            </button>
          </div>
          
          <button 
            onClick={() => setIsTemplateModalOpen(true)}
            className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors whitespace-nowrap"
          >
            模板管理
          </button>
          
          <div className="relative group/import shrink-0">
            <button 
              onClick={() => setIsImportModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
            >
              <Plus size={18} /> 导入指标
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredThresholds.map((indicator) => (
            <div key={indicator.id} className={cn(
              "bg-white p-6 rounded-xl shadow-sm border border-slate-200 group hover:border-blue-200 transition-all",
              !indicator.enabled && "opacity-60 bg-slate-50"
            )}>
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
                <div className="flex items-center gap-2">
                  <Toggle enabled={indicator.enabled} onToggle={() => toggleThresholdStatus(indicator.id)} />
                  <span className="text-slate-400">引用模板: <span className={cn(
                    "font-bold",
                    indicator.templateName?.includes('协和') ? 'text-indigo-600' : 'text-slate-700'
                  )}>{indicator.templateName}</span></span>
                </div>
                <button 
                  onClick={() => openEditModal(indicator)}
                  className="px-3 py-1 rounded-lg border border-slate-100 hover:border-blue-200 hover:text-blue-600 transition-all font-medium"
                >
                  设置阈值
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">指标名称</th>
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">正常范围</th>
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">单位</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">启用</th>
                <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredThresholds.map((indicator) => (
                <tr key={indicator.id} className={cn(
                  "border-b border-slate-50 last:border-0 hover:bg-slate-50/30 transition-colors",
                  !indicator.enabled && "opacity-60 bg-slate-50/40"
                )}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center shadow-inner",
                        indicator.type === 'vital' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                      )}>
                        {indicator.type === 'vital' ? <Activity size={16} /> : <FileText size={16} />}
                      </div>
                      <span className="text-sm font-bold text-slate-700">{indicator.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-mono font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full shadow-sm">
                      {indicator.minVal} - {indicator.maxVal}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{indicator.unit}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Toggle enabled={indicator.enabled} onToggle={() => toggleThresholdStatus(indicator.id)} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => openEditModal(indicator)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors bg-blue-50/50 hover:bg-blue-100/50 px-3 py-1.5 rounded-lg active:scale-95"
                    >
                      修改基准
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Threshold Edit Modal */}
      <AnimatePresence>
        {editingIndicator && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingIndicator(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm relative overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-slate-800">设置指标阈值</h3>
                <button onClick={() => setEditingIndicator(null)} className="text-slate-400 hover:text-slate-600">
                  <Plus className="rotate-45" size={24} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="text-center">
                  <div className="text-xs text-slate-400 uppercase font-black tracking-widest mb-1">正在编辑</div>
                  <div className="text-lg font-bold text-slate-800">{editingIndicator.name}</div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">正常下限 ({editingIndicator.unit})</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editMin}
                      onChange={e => setEditMin(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-mono font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">正常上限 ({editingIndicator.unit})</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editMax}
                      onChange={e => setEditMax(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-mono font-bold"
                    />
                  </div>
                </div>

                {editMin >= editMax && (
                  <div className="p-3 bg-red-50 text-red-600 text-[10px] rounded-lg font-bold flex items-center gap-2">
                    <Info size={14} /> 下限不能大于或等于上限
                  </div>
                )}
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                <button
                  onClick={() => setEditingIndicator(null)}
                  className="flex-1 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-100 transition-all"
                >
                  取消
                </button>
                <button
                  onClick={saveIndicatorThreshold}
                  disabled={editMin >= editMax}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  保存更改
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Import Modal */}
      <AnimatePresence>
        {isImportModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsImportModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Package className="text-blue-600" size={20} /> 导入标准指标
                </h3>
                <button onClick={() => setIsImportModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <Plus className="rotate-45" size={24} />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="p-4 rounded-xl border-2 border-blue-100 bg-blue-50/30 flex items-center justify-between group cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => handleImport('UnionHospital')}
                >
                  <div>
                    <h4 className="font-bold text-blue-900 text-sm">北京协和医院实验室指标</h4>
                    <p className="text-[10px] text-blue-600/70 font-medium">包含：肝功、血脂、肾研、糖耐量等 48 项</p>
                  </div>
                  <div className="bg-blue-600 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <Zap size={14} />
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-100 bg-white flex items-center justify-between opacity-60 cursor-not-allowed">
                  <div>
                    <h4 className="font-medium text-slate-600 text-sm">国家通用卫生标准 (2025)</h4>
                    <p className="text-[10px] text-slate-400">暂未上线</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-100 bg-white flex items-center justify-between opacity-60 cursor-not-allowed">
                  <div>
                    <h4 className="font-medium text-slate-600 text-sm">社区居家养老健康基准</h4>
                    <p className="text-[10px] text-slate-400">暂未上线</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
                <p className="text-[10px] text-slate-400">默认推荐：协和医院标准可覆盖大部分常见中老年慢性病监测需求</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Template Mgmt Modal */}
      <AnimatePresence>
        {isTemplateModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTemplateModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <ShieldCheck className="text-slate-600" size={20} /> 引用模板管理
                </h3>
              </div>
              
              <div className="p-6 grid grid-cols-1 gap-4">
                {templates.map(t => (
                  <div 
                    key={t.name}
                    onClick={() => {
                      setCurrentTemplate(t.name);
                      // In a real app we would swap thresholds here
                    }}
                    className={cn(
                      "p-5 rounded-xl border-2 transition-all cursor-pointer flex justify-between items-center",
                      currentTemplate === t.name 
                        ? "border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-100" 
                        : "border-slate-100 bg-white hover:border-slate-200"
                    )}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={cn("font-bold text-sm", currentTemplate === t.name ? "text-blue-800" : "text-slate-800")}>{t.name}</h4>
                        {currentTemplate === t.name && (
                          <span className="bg-blue-600 text-white text-[8px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-tighter">当前使用</span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400">{t.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-mono font-bold text-slate-600">{t.count}</div>
                      <div className="text-[8px] text-slate-400 font-bold uppercase">指标数</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button 
                  onClick={() => setIsTemplateModalOpen(false)}
                  className="px-6 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-100 transition-all"
                >
                  关闭
                </button>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                  新建自定义模板
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}



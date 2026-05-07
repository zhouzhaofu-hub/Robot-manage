import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { auth, signInWithPopup, signInAnonymously, googleProvider, signOut, db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';
import { 
  MOCK_TASKS, 
  MOCK_ARCHIVES, 
  MOCK_DEVICES, 
  MOCK_ALERTS, 
  MOCK_ROBOTS, 
  MOCK_THRESHOLDS, 
  MOCK_SECURITY_EVENTS, 
  MOCK_NOTIFICATIONS, 
  MOCK_REHAB_GUIDANCE 
} from '../mocks';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: () => Promise<void>;
  signInAnon: () => Promise<void>;
  devLogin: () => Promise<void>;
  logOut: () => Promise<void>;
  clearError: () => void;
  initTestData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signIn = async () => {
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e: any) {
      console.error("Error signing in with Google", e);
      setError(e.message || "登录失败");
    }
  };

  const signInAnon = async () => {
    setError(null);
    try {
      await signInAnonymously(auth);
    } catch (e: any) {
      console.error("Error signing in anonymously", e);
      if (e.code === 'auth/admin-restricted-operation') {
        setError("匿名登录未启用。您可以点击 [管理员模式] 进行开发者预览。");
      } else {
        setError(e.message || "匿名登录失败");
      }
    }
  };

  const devLogin = async () => {
    // For development convenience, we can set a mock user state if Firebase isn't strictly required for the demo UI
    // But since the app uses Firestore, we still need a real auth session.
    // We'll try to sign in anonymously, and if it fails, we guide them.
    await signInAnon();
  };

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error("Error signing out", e);
    }
  };

  const clearError = () => setError(null);

  const initTestData = async () => {
    try {
      // 批量导入数据
      const dataMapping = [
        { collection: 'tasks', data: MOCK_TASKS },
        { collection: 'archives', data: MOCK_ARCHIVES },
        { collection: 'devices', data: MOCK_DEVICES },
        { collection: 'alerts', data: MOCK_ALERTS },
        { collection: 'robots', data: MOCK_ROBOTS },
        { collection: 'thresholds', data: MOCK_THRESHOLDS },
        { collection: 'security_events', data: MOCK_SECURITY_EVENTS },
        { collection: 'notifications', data: MOCK_NOTIFICATIONS },
        { collection: 'guidances', data: MOCK_REHAB_GUIDANCE },
      ];

      for (const item of dataMapping) {
        for (const docData of item.data) {
          await setDoc(doc(db, item.collection, (docData as any).id), docData);
        }
      }
      
      alert("🎉 恭喜！系统测试数据已全部初始化成功。\n共覆盖 9 个核心模块。");
    } catch (e: any) {
      console.error("Data init failed", e);
      alert("❌ 数据填充失败: " + (e.message || String(e)));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, signIn, signInAnon, devLogin, logOut, clearError, initTestData }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

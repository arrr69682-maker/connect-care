/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  LocalDB,
  HEALTH_KNOWLEDGE,
  DEFAULT_ELDERLY,
  DEFAULT_VOLUNTEERS,
  DEFAULT_HEALTH_RECORDS,
  DEFAULT_PILLS,
  DEFAULT_APPOINTMENTS,
  DEFAULT_SOS_REQUESTS,
  DEFAULT_NOTIFICATIONS,
  DEFAULT_CHATS,
} from './data';
import {
  ElderlyProfile,
  VolunteerProfile,
  HealthRecord,
  PillReminder,
  DoctorAppointment,
  SOSRequest,
  Notification,
  ChatMessage,
  Role,
} from './types';
import MockMap from './components/MockMap';
import HealthRecordsView from './components/HealthRecordsView';
import PillsAndAppointmentsView from './components/PillsAndAppointmentsView';
import AdminPanel from './components/AdminPanel';
import {
  Heart,
  User,
  Shield,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Phone,
  MessageCircle,
  Bell,
  LogOut,
  ChevronRight,
  BookOpen,
  ArrowRight,
  Sparkles,
  Info,
  Star,
  Activity,
  Send,
  Loader2,
  Search,
  Lock,
  Mail,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Initialize LocalStorage with default seed records if empty
LocalDB.init();

export default function App() {
  // State from LocalStorage
  const [elderlyList, setElderlyList] = useState<ElderlyProfile[]>(() =>
    LocalDB.get('sc_elderly', DEFAULT_ELDERLY)
  );
  const [volunteersList, setVolunteersList] = useState<VolunteerProfile[]>(() =>
    LocalDB.get('sc_volunteers', DEFAULT_VOLUNTEERS)
  );
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>(() =>
    LocalDB.get('sc_records', DEFAULT_HEALTH_RECORDS)
  );
  const [pills, setPills] = useState<PillReminder[]>(() =>
    LocalDB.get('sc_pills', DEFAULT_PILLS)
  );
  const [appointments, setAppointments] = useState<DoctorAppointment[]>(() =>
    LocalDB.get('sc_appointments', DEFAULT_APPOINTMENTS)
  );
  const [sosRequests, setSosRequests] = useState<SOSRequest[]>(() =>
    LocalDB.get('sc_sos', DEFAULT_SOS_REQUESTS)
  );
  const [notifications, setNotifications] = useState<Notification[]>(() =>
    LocalDB.get('sc_notifications', DEFAULT_NOTIFICATIONS)
  );
  const [chats, setChats] = useState<ChatMessage[]>(() =>
    LocalDB.get('sc_chats', DEFAULT_CHATS)
  );

  // Sync to LocalStorage whenever state changes
  useEffect(() => {
    LocalDB.set('sc_elderly', elderlyList);
  }, [elderlyList]);
  useEffect(() => {
    LocalDB.set('sc_volunteers', volunteersList);
  }, [volunteersList]);
  useEffect(() => {
    LocalDB.set('sc_records', healthRecords);
  }, [healthRecords]);
  useEffect(() => {
    LocalDB.set('sc_pills', pills);
  }, [pills]);
  useEffect(() => {
    LocalDB.set('sc_appointments', appointments);
  }, [appointments]);
  useEffect(() => {
    LocalDB.set('sc_sos', sosRequests);
  }, [sosRequests]);
  useEffect(() => {
    LocalDB.set('sc_notifications', notifications);
  }, [notifications]);
  useEffect(() => {
    LocalDB.set('sc_chats', chats);
  }, [chats]);

  // UI Navigation states
  const [currentScreen, setCurrentScreen] = useState<
    | 'splash'
    | 'role_select'
    | 'login'
    | 'register_elderly'
    | 'register_volunteer'
    | 'elderly_home'
    | 'volunteer_home'
    | 'admin_dashboard'
  >('splash');

  // Authentication status
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Active sub-pages (Elderly)
  const [elderlySubPage, setElderlySubPage] = useState<'home' | 'health' | 'sos' | 'volunteers_near' | 'knowledge' | 'notifications'>('home');
  // Selected health knowledge item
  const [selectedKnowledge, setSelectedKnowledge] = useState<any>(null);
  // Chat active screen state
  const [activeChatRequest, setActiveChatRequest] = useState<SOSRequest | null>(null);
  const [chatMessageInput, setChatMessageInput] = useState('');

  // SOS request process state (on elderly side)
  const [sosCountdown, setSosCountdown] = useState<number | null>(null);
  const [activeSosRequest, setActiveSosRequest] = useState<SOSRequest | null>(null);

  // Register state inputs (Elderly)
  const [regEldName, setRegEldName] = useState('');
  const [regEldSurname, setRegEldSurname] = useState('');
  const [regEldAge, setRegEldAge] = useState('70');
  const [regEldGender, setRegEldGender] = useState('หญิง');
  const [regEldPhone, setRegEldPhone] = useState('');
  const [regEldAddress, setRegEldAddress] = useState('');
  const [regEldDiseases, setRegEldDiseases] = useState('ความดันโลหิตสูง');
  const [regEldMeds, setRegEldMeds] = useState('ยาคุมความดัน 1 เม็ด เช้า');
  const [regEldBlood, setRegEldBlood] = useState('A');
  const [regEldContact, setRegEldContact] = useState('');
  const [regEldContactPhone, setRegEldContactPhone] = useState('');

  // Register state inputs (Volunteer)
  const [regVolName, setRegVolName] = useState('');
  const [regVolSurname, setRegVolSurname] = useState('');
  const [regVolAge, setRegVolAge] = useState('25');
  const [regVolPhone, setRegVolPhone] = useState('');
  const [regVolEmail, setRegVolEmail] = useState('');
  const [regVolAddress, setRegVolAddress] = useState('');
  const [regVolOrg, setRegVolOrg] = useState('มูลนิธิอาสาชุมชน');
  const [regVolCaps, setRegVolCaps] = useState('ปฐมพยาบาลเบื้องต้น, CPR');
  const [regVolTime, setRegVolTime] = useState('วันเสาร์-อาทิตย์');

  // Simulated GPS Coordinates
  const [simulatedGps, setSimulatedGps] = useState({ lat: 13.7245, lng: 100.5682 });
  const [gpsSimulatedLabel, setGpsSimulatedLabel] = useState('13.7245, 100.5682 (คลองเตย กรุงเทพฯ)');

  // Selected volunteer detail card state on map
  const [selectedVolOnMap, setSelectedVolOnMap] = useState<VolunteerProfile | null>(null);

  // Review & Rating Modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewTargetSosId, setReviewTargetSosId] = useState<string>('');

  // Automatically trigger SOS steps simulated delay
  useEffect(() => {
    let timer: any;
    if (sosCountdown !== null && sosCountdown > 0) {
      timer = setTimeout(() => setSosCountdown(sosCountdown - 1), 1000);
    } else if (sosCountdown === 0) {
      setSosCountdown(null);
      triggerActualSOS();
    }
    return () => clearTimeout(timer);
  }, [sosCountdown]);

  // Simulate active SOS status updates
  useEffect(() => {
    if (!activeSosRequest) return;

    let timer1: any;
    let timer2: any;
    let timer3: any;

    if (activeSosRequest.status === 'searching') {
      // Step 2: Auto Accept after 4s
      timer1 = setTimeout(() => {
        const updated = {
          ...activeSosRequest,
          status: 'accepted' as const,
          volunteerId: volunteersList[0].id,
          volunteerName: volunteersList[0].name,
          volunteerPhone: volunteersList[0].phone,
        };
        setActiveSosRequest(updated);
        setSosRequests(prev => prev.map(r => (r.id === activeSosRequest.id ? updated : r)));
        
        // Add notifications
        sendAppNotification(
          currentUser?.id || 'e1',
          'อาสาสมัครตอบรับแล้ว',
          `คุณ${volunteersList[0].name} กำลังเตรียมตัวเดินทางมาช่วยเหลือคุณแล้วค่ะ`,
          'accepted'
        );
        sendAppNotification(
          volunteersList[0].id,
          'มีเคสฉุกเฉินใหม่!',
          `คุณ${activeSosRequest.elderlyName} ต้องการความช่วยเหลือด่วนที่ ${activeSosRequest.elderlyAddress}`,
          'sos'
        );
      }, 4000);
    } else if (activeSosRequest.status === 'accepted') {
      // Step 3: Traveling after 5s
      timer2 = setTimeout(() => {
        const updated = { ...activeSosRequest, status: 'on_the_way' as const };
        setActiveSosRequest(updated);
        setSosRequests(prev => prev.map(r => (r.id === activeSosRequest.id ? updated : r)));
        sendAppNotification(
          currentUser?.id || 'e1',
          'อาสาสมัครกำลังเดินทาง',
          `คุณ${volunteersList[0].name} กำลังเร่งเดินทางมาถึงใน 2-3 นาทีนี้ค่ะ`,
          'accepted'
        );
      }, 5000);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [activeSosRequest]);

  // Helper to send app notifications
  const sendAppNotification = (
    userId: string,
    title: string,
    message: string,
    type: Notification['type']
  ) => {
    const newNotif: Notification = {
      id: 'notif_' + Date.now(),
      userId,
      title,
      message,
      time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      type,
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Perform actual SOS dispatch after countdown
  const triggerActualSOS = () => {
    const elder = currentUser || elderlyList[0];
    const newReq: SOSRequest = {
      id: 'sos_' + Date.now().toString().slice(-6),
      elderlyId: elder.id,
      elderlyName: `${elder.name} ${elder.surname}`,
      elderlyPhone: elder.phone,
      elderlyGps: simulatedGps,
      elderlyAddress: elder.address || 'พิกัด GPS จำลอง คลองเตย',
      status: 'searching',
      time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString().split('T')[0],
    };

    setSosRequests(prev => [...prev, newReq]);
    setActiveSosRequest(newReq);
    setElderlySubPage('sos');

    // Notify all active volunteers
    volunteersList.forEach(vol => {
      sendAppNotification(
        vol.id,
        '🚨 แจ้งเตือนเหตุฉุกเฉิน SOS!',
        `คุณ${elder.name} กดขอความช่วยเหลือฉุกเฉินด่วน!`,
        'sos'
      );
    });
  };

  // Log in handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) return;

    // Check elderly
    const foundElder = elderlyList.find(e => e.email.toLowerCase() === loginEmail.toLowerCase());
    if (foundElder) {
      setCurrentUser(foundElder);
      setCurrentScreen('elderly_home');
      setElderlySubPage('home');
      return;
    }

    // Check volunteer
    const foundVol = volunteersList.find(v => v.email.toLowerCase() === loginEmail.toLowerCase());
    if (foundVol) {
      setCurrentUser(foundVol);
      setCurrentScreen('volunteer_home');
      return;
    }

    // Check admin
    if (loginEmail.toLowerCase() === 'admin@care.com' || loginEmail.toLowerCase() === 'admin') {
      setCurrentUser({ id: 'admin', email: 'admin@care.com', role: 'admin', name: 'ระบบผู้ดูแล', surname: 'ส่วนกลาง', phone: '1669' });
      setCurrentScreen('admin_dashboard');
      return;
    }

    // Default auto-fallback logic for quick preview: if anything else, log in as elderly Somjai
    const defaultElder = elderlyList[0];
    setCurrentUser(defaultElder);
    setCurrentScreen('elderly_home');
    setElderlySubPage('home');
  };

  // Elder Registration handler
  const handleRegisterElderly = (e: React.FormEvent) => {
    e.preventDefault();
    const newEld: ElderlyProfile = {
      id: 'e_' + Date.now(),
      email: `${regEldName.toLowerCase() || 'elder'}@care.com`,
      role: 'elderly',
      name: regEldName || 'สมใจ',
      surname: regEldSurname || 'แสนสุข',
      phone: regEldPhone || '089-111-2222',
      profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120',
      age: parseInt(regEldAge) || 70,
      gender: regEldGender,
      address: regEldAddress || '99 ถ.สุขุมวิท กรุงเทพฯ',
      gps: simulatedGps,
      chronicDiseases: regEldDiseases.split(',').map(s => s.trim()),
      regularMedications: regEldMeds.split(',').map(s => s.trim()),
      bloodGroup: regEldBlood,
      emergencyContact: regEldContact || 'คุณญาติสนิท',
      emergencyPhone: regEldContactPhone || '089-999-9999',
    };

    setElderlyList(prev => [...prev, newEld]);
    setCurrentUser(newEld);
    setCurrentScreen('elderly_home');
    setElderlySubPage('home');
  };

  // Volunteer Registration handler
  const handleRegisterVolunteer = (e: React.FormEvent) => {
    e.preventDefault();
    const newVol: VolunteerProfile = {
      id: 'v_' + Date.now(),
      email: regVolEmail || `${regVolName.toLowerCase()}@volunteer.com`,
      role: 'volunteer',
      name: regVolName || 'วีระ',
      surname: regVolSurname || 'กล้าหาญ',
      phone: regVolPhone || '081-444-5555',
      profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
      age: parseInt(regVolAge) || 25,
      address: regVolAddress || 'เขตปทุมวัน กรุงเทพฯ',
      gps: { lat: 13.7367, lng: 100.5231 },
      organization: regVolOrg || 'อาสาสมัครใจดี',
      capabilities: regVolCaps.split(',').map(s => s.trim()),
      availableTime: regVolTime || 'จันทร์-ศุกร์ นอกเวลางาน',
      idCardUploaded: true,
      rating: 5.0,
      reviewCount: 0,
    };

    setVolunteersList(prev => [...prev, newVol]);
    setCurrentUser(newVol);
    setCurrentScreen('volunteer_home');
  };

  // Add Health Record
  const handleAddHealthRecord = (rec: Omit<HealthRecord, 'id' | 'date' | 'time'>) => {
    const newRecord: HealthRecord = {
      ...rec,
      id: 'h_' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    };
    setHealthRecords(prev => [...prev, newRecord]);
  };

  // Add Medication
  const handleAddPill = (pill: Omit<PillReminder, 'id' | 'taken'>) => {
    const newPill: PillReminder = {
      ...pill,
      id: 'p_' + Date.now(),
      taken: false,
    };
    setPills(prev => [...prev, newPill]);
  };

  // Toggle Medicine Taken
  const handleTogglePill = (id: string) => {
    setPills(prev =>
      prev.map(p => {
        if (p.id === id) {
          const updatedTaken = !p.taken;
          if (updatedTaken) {
            // Send congratulations
            sendAppNotification(
              currentUser?.id || 'e1',
              'กินยาเรียบร้อยเก่งมากค่ะ! 💊',
              `คุณได้ทานยา ${p.name} เรียบร้อยแล้ว สุขภาพแข็งแรงนะคะ`,
              'pill'
            );
          }
          return { ...p, taken: updatedTaken };
        }
        return p;
      })
    );
  };

  // Add Doctor Appointment
  const handleAddAppointment = (appt: Omit<DoctorAppointment, 'id'>) => {
    const newAppt: DoctorAppointment = {
      ...appt,
      id: 'ap_' + Date.now(),
    };
    setAppointments(prev => [...prev, newAppt]);
  };

  // Log out action
  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentScreen('splash');
  };

  // Admin delete actions
  const handleDeleteElderly = (id: string) => {
    setElderlyList(prev => prev.filter(e => e.id !== id));
  };

  const handleDeleteVolunteer = (id: string) => {
    setVolunteersList(prev => prev.filter(v => v.id !== id));
  };

  // Realtime simulation trigger (Accept case from volunteer profile)
  const handleVolunteerAcceptSOS = (req: SOSRequest) => {
    const updated = {
      ...req,
      status: 'accepted' as const,
      volunteerId: currentUser.id,
      volunteerName: `${currentUser.name} ${currentUser.surname}`,
      volunteerPhone: currentUser.phone,
    };
    setSosRequests(prev => prev.map(r => (r.id === req.id ? updated : r)));
    if (activeSosRequest && activeSosRequest.id === req.id) {
      setActiveSosRequest(updated);
    }
    sendAppNotification(
      req.elderlyId,
      'อาสาสมัครรับเรื่องแล้ว!',
      `คุณ${currentUser.name} กำลังเดินทางไปจุดพิกัดของคุณด่วนที่สุด`,
      'accepted'
    );
  };

  // Simulated GPS Coordinates picker
  const simulatePositionPicker = () => {
    const options = [
      { label: 'คลองเตย (13.7245, 100.5682)', lat: 13.7245, lng: 100.5682 },
      { label: 'พญาไท (13.7802, 100.5448)', lat: 13.7802, lng: 100.5448 },
      { label: 'ปทุมวัน (13.7367, 100.5231)', lat: 13.7367, lng: 100.5231 },
      { label: 'สาทร (13.7220, 100.5620)', lat: 13.7220, lng: 100.5620 },
    ];
    const nextIdx = (options.findIndex(o => o.lat === simulatedGps.lat) + 1) % options.length;
    setSimulatedGps({ lat: options[nextIdx].lat, lng: options[nextIdx].lng });
    setGpsSimulatedLabel(options[nextIdx].label);
  };

  // Submit SOS feedback review
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setSosRequests(prev =>
      prev.map(r => {
        if (r.id === reviewTargetSosId) {
          return { ...r, rating: reviewRating, reviewComment: reviewComment };
        }
        return r;
      })
    );

    // Notify volunteer about rating
    const req = sosRequests.find(r => r.id === reviewTargetSosId);
    if (req && req.volunteerId) {
      sendAppNotification(
        req.volunteerId,
        'คุณได้รับคะแนนรีวิวใหม่ ⭐',
        `เคสคุณ${req.elderlyName} ได้ประเมินผลงาน ${reviewRating} ดาว!`,
        'review'
      );
    }

    setShowReviewModal(false);
    setReviewComment('');
    setActiveSosRequest(null);
    setElderlySubPage('home');
  };

  // Send Chat message
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessageInput.trim() || !activeChatRequest) return;

    const newMsg: ChatMessage = {
      id: 'chat_' + Date.now(),
      sosId: activeChatRequest.id,
      senderId: currentUser.id,
      senderRole: currentUser.role,
      message: chatMessageInput,
      time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    };

    setChats(prev => [...prev, newMsg]);
    setChatMessageInput('');

    // Simulate reply after 1.5 seconds if sent by elderly
    if (currentUser.role === 'elderly') {
      setTimeout(() => {
        const replyMsg: ChatMessage = {
          id: 'chat_reply_' + Date.now(),
          sosId: activeChatRequest.id,
          senderId: activeChatRequest.volunteerId || 'v1',
          senderRole: 'volunteer',
          message: 'ครับคุณยาย สบายใจได้ครับ ผมกำลังเดินก้าวเร่งพิกัดมาถึงตัวละครับ',
          time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
        };
        setChats(prev => [...prev, replyMsg]);
      }, 1500);
    }
  };

  // Get active SOS cases
  const pendingSOSForVol = sosRequests.find(r => r.status !== 'completed');

  return (
    <div className="min-h-screen bg-[#F0F5F2] flex flex-col items-center justify-center p-0 md:p-6 font-sans antialiased text-gray-800">
      
      {/* Desktop Wrapper Layout with Live Multi-Role Simulator Controller */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-6 bg-white p-0 md:p-6 rounded-none md:rounded-[40px] shadow-2xl overflow-hidden border-8 border-gray-100">
        
        {/* Left Side: Simulation Dashboard Control Panel (Guides developer & showcases user scenarios) */}
        <div className="flex-1 p-5 text-gray-700 space-y-5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-gray-200">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-[#4CAF7A] text-white p-3 rounded-2xl shadow-lg shadow-emerald-500/20">
                <Heart className="w-7 h-7 fill-white text-emerald-100" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-800 tracking-tight font-display">สูงวัยอุ่นใจ</h1>
                <p className="text-[11px] text-[#4CAF7A] font-extrabold uppercase tracking-widest">Senior Care Connect Platform</p>
              </div>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed font-sans">
              ยินดีต้อนรับเข้าสู่ระบบ <strong>"สูงวัยอุ่นใจ"</strong> แอปรุ่นใหม่สำหรับดูแลผู้สูงอายุฉุกเฉินและเชื่อมอาสาสมัคร 
              เพื่อประสบการณ์ทดสอบที่สมบูรณ์แบบ คุณสามารถปรับแต่งโปรไฟล์ ค้นหาอาสาสมัคร หรือสลับบทบาทการทำงานแบบเรียลไทม์ได้จากแผงจำลองด้านล่างนี้เลยค่ะ
            </p>

            {/* Quick Emulator Role Switcher Panel */}
            <div className="bg-emerald-50/50 p-4 rounded-3xl border-2 border-emerald-100 space-y-3 shadow-inner">
              <h3 className="text-xs font-black text-[#2E7D32] flex items-center gap-1.5 border-b border-emerald-100 pb-2 font-display">
                <Sparkles className="w-4 h-4 text-[#4CAF7A]" />
                <span>แผงควบคุมสลับบทบาทจำลอง (Emulator Controller)</span>
              </h3>

              <div className="space-y-2 text-xs">
                <p className="text-[10px] text-emerald-800 font-bold">คลิกปุ่มด้านล่างเพื่อสลับบทบาทหน้าจอโทรศัพท์จำลองทันที:</p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      const user = elderlyList[0];
                      setCurrentUser(user);
                      setCurrentScreen('elderly_home');
                      setElderlySubPage('home');
                    }}
                    className={`p-2.5 rounded-2xl font-black flex flex-col items-center gap-1.5 transition-all ${
                      currentScreen === 'elderly_home'
                        ? 'bg-[#4CAF7A] text-white shadow-md shadow-emerald-500/20 scale-105 border-b-4 border-[#3d8c62]'
                        : 'bg-white border-2 border-emerald-100/60 text-emerald-800 hover:bg-emerald-50/50'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>ผู้สูงอายุ</span>
                  </button>

                  <button
                    onClick={() => {
                      const user = volunteersList[0];
                      setCurrentUser(user);
                      setCurrentScreen('volunteer_home');
                    }}
                    className={`p-2.5 rounded-2xl font-black flex flex-col items-center gap-1.5 transition-all ${
                      currentScreen === 'volunteer_home'
                        ? 'bg-[#FF8A65] text-white shadow-md shadow-orange-500/20 scale-105 border-b-4 border-[#e57347]'
                        : 'bg-white border-2 border-emerald-100/60 text-emerald-800 hover:bg-emerald-50/50'
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    <span>อาสาสมัคร</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentUser({ id: 'admin', email: 'admin@care.com', role: 'admin' });
                      setCurrentScreen('admin_dashboard');
                    }}
                    className={`p-2.5 rounded-2xl font-black flex flex-col items-center gap-1.5 transition-all ${
                      currentScreen === 'admin_dashboard'
                        ? 'bg-slate-700 text-white shadow-md scale-105 border-b-4 border-slate-900'
                        : 'bg-white border-2 border-emerald-100/60 text-emerald-800 hover:bg-emerald-50/50'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>แอดมิน</span>
                  </button>
                </div>
              </div>

              {/* simulated GPS coordinate changer */}
              <div className="pt-2 border-t border-emerald-100 text-[11px] flex justify-between items-center text-emerald-800 font-bold">
                <span>📍 พิกัดจำลองของคุณ:</span>
                <button
                  onClick={simulatePositionPicker}
                  className="bg-white border-2 border-emerald-200 text-emerald-800 hover:bg-emerald-50 text-[10px] font-black px-2.5 py-1 rounded-xl active:scale-95 transition-all shadow-xs"
                >
                  {gpsSimulatedLabel.split(' ')[0]} (เปลี่ยน)
                </button>
              </div>
            </div>
          </div>

          {/* Guidelines info block */}
          <div className="bg-amber-50/60 p-3.5 rounded-3xl border-2 border-amber-100 text-[11px] text-amber-800 space-y-1 mt-4 shadow-sm">
            <p className="font-black text-amber-900 flex items-center gap-1 font-display">
              <Info className="w-3.5 h-3.5 text-[#FF8A65]" />
              <span>วิธีจำลองระบบขอความช่วยเหลือ (SOS Workflow):</span>
            </p>
            <ol className="list-decimal list-inside space-y-0.5 text-[10px] font-medium text-amber-800/90">
              <li>สลับบทบาทเป็น <span className="text-[#2E7D32] font-black">ผู้สูงอายุ</span></li>
              <li>กดปุ่มกลมสีแดง <span className="text-[#C62828] font-black">🚨 SOS</span> และรอ 5 วินาที</li>
              <li>สลับไปหน้า <span className="text-[#D84315] font-black">อาสาสมัคร</span> จะพบคอนเซปต์กล่อง SOS เด้งขึ้นมาทันที</li>
              <li>กด <span className="text-[#2E7D32] font-black">รับเคส</span> แผนที่จะเริ่มทำงานร่วมกันอย่างเป็นระบบ!</li>
            </ol>
          </div>
        </div>

        {/* Right Side: Smartphone Device Frame container (Holds the Mobile Web App) */}
        <div className="w-full max-w-[410px] mx-auto bg-slate-950 p-2 md:p-3.5 rounded-none md:rounded-[45px] shadow-2xl relative border-4 border-slate-800 flex flex-col h-[740px] shrink-0">
          
          {/* Virtual Notch and camera */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-5 bg-slate-950 rounded-b-2xl z-50 flex items-center justify-center gap-1.5">
            <div className="w-3.5 h-3.5 bg-neutral-900 rounded-full border border-neutral-800" />
            <div className="w-8 h-1 bg-neutral-800 rounded-full" />
          </div>

          {/* Smartphone screen viewport */}
          <div className="w-full h-full bg-white rounded-none md:rounded-[32px] overflow-hidden flex flex-col relative">
            
            {/* Virtual Mobile Status Bar */}
            <div className="bg-white px-6 pt-6 pb-2.5 flex justify-between items-center text-[11px] font-extrabold text-gray-500 select-none border-b border-gray-50">
              <span>10:08 น.</span>
              <div className="flex items-center gap-1.5">
                <span className="bg-emerald-500 w-1.5 h-1.5 rounded-full animate-ping" />
                <span className="text-emerald-600 font-black text-[9px] tracking-wider">สูงวัยอุ่นใจ (5G)</span>
              </div>
            </div>

            {/* Screen Content Wrapper with beautiful slide transitions */}
            <div className="flex-1 overflow-hidden relative">
              <AnimatePresence mode="wait">
                
                {/* 1. Splash Screen */}
                {currentScreen === 'splash' && (
                  <motion.div
                    key="splash"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col justify-between overflow-hidden"
                  >
                    <div className="flex-1 bg-gradient-to-b from-[#4CAF7A] to-[#3d8c62] p-6 flex flex-col items-center justify-center text-center text-white font-display">
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 12 }}
                        className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-6 shadow-inner relative"
                      >
                        <div className="text-red-500 text-5xl">❤️</div>
                      </motion.div>

                      <h1 className="text-4xl font-extrabold mb-1 leading-tight text-white tracking-tight font-display">สูงวัยอุ่นใจ</h1>
                      <p className="text-lg font-bold opacity-90 mb-1">อุ่นใจในทุกวัน</p>
                      <p className="text-sm opacity-80 italic">เราจะอยู่เคียงข้างคุณเสมอ</p>
                    </div>

                    <div className="p-6 bg-white space-y-3 shrink-0">
                      <button
                        onClick={() => setCurrentScreen('login')}
                        className="w-full bg-[#4CAF7A] hover:bg-[#3D8F63] text-white py-4 rounded-2xl text-lg font-black shadow-lg shadow-emerald-500/10 active:scale-95 transition-all font-display"
                      >
                        เข้าสู่ระบบผู้ใช้งาน
                      </button>
                      <button
                        onClick={() => setCurrentScreen('role_select')}
                        className="w-full border-4 border-[#4CAF7A] text-[#4CAF7A] bg-white py-3.5 rounded-2xl text-base font-black active:scale-95 hover:bg-[#4CAF7A]/5 transition-all font-display"
                      >
                        ลงทะเบียนบัญชีใหม่
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* 2. Choose Role (เลือกประเภทผู้ใช้งาน) */}
                {currentScreen === 'role_select' && (
                  <motion.div
                    key="role_select"
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -100, opacity: 0 }}
                    className="absolute inset-0 bg-white p-6 flex flex-col justify-between"
                  >
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <button
                          onClick={() => setCurrentScreen('splash')}
                          className="text-xs font-bold text-[#4CAF7A] hover:text-[#3D8F63] font-display"
                        >
                          ← ย้อนกลับ
                        </button>
                        <h2 className="text-3xl font-black text-gray-800 tracking-tight mt-2 font-display">เลือกประเภทบัญชี</h2>
                        <p className="text-xs text-gray-500">กรุณาเลือกสถานะของคุณเพื่อรับบริการที่เหมาะสมที่สุดค่ะ</p>
                      </div>

                      <div className="space-y-4">
                        {/* Elderly option */}
                        <div
                          onClick={() => setCurrentScreen('register_elderly')}
                          className="p-5 rounded-3xl border-b-4 border-[#4CAF7A] bg-[#E8F5E9] text-[#2E7D32] cursor-pointer transition-all hover:scale-[1.02] active:scale-98 flex items-center justify-between shadow-xs"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/80 rounded-2xl flex items-center justify-center text-[#2E7D32] shadow-sm">
                              <User className="w-6 h-6 stroke-[2.5]" />
                            </div>
                            <div className="text-left">
                              <h3 className="font-extrabold text-[#2E7D32] text-base font-display">ผู้สูงอายุ (Senior)</h3>
                              <p className="text-[11px] text-[#2E7D32]/85 mt-0.5">เข้าถึงบริการสุขภาพ และแจ้งเตือน SOS ฉุกเฉิน</p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-[#2E7D32]" />
                        </div>

                        {/* Volunteer option */}
                        <div
                          onClick={() => setCurrentScreen('register_volunteer')}
                          className="p-5 rounded-3xl border-b-4 border-[#FF8A65] bg-[#FFF3E0] text-[#D84315] cursor-pointer transition-all hover:scale-[1.02] active:scale-98 flex items-center justify-between shadow-xs"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/80 rounded-2xl flex items-center justify-center text-[#D84315] shadow-sm">
                              <Shield className="w-6 h-6 stroke-[2.5]" />
                            </div>
                            <div className="text-left">
                              <h3 className="font-extrabold text-[#D84315] text-base font-display">อาสาสมัคร (Volunteer)</h3>
                              <p className="text-[11px] text-[#D84315]/85 mt-0.5">รับเคสฉุกเฉินและออกช่วยเหลือเพื่อนร่วมชุมชน</p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-[#D84315]" />
                        </div>
                      </div>
                    </div>

                    <p className="text-center text-[11px] text-gray-400">
                      มีบัญชีอยู่แล้ว?{' '}
                      <button onClick={() => setCurrentScreen('login')} className="font-black text-[#4CAF7A] underline">
                        เข้าสู่ระบบเลย
                      </button>
                    </p>
                  </motion.div>
                )}

                {/* 3. Register: Elderly */}
                {currentScreen === 'register_elderly' && (
                  <motion.div
                    key="reg_eld"
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -100, opacity: 0 }}
                    className="absolute inset-0 bg-white p-6 flex flex-col justify-between overflow-y-auto"
                  >
                    <div className="space-y-4">
                      <button
                        onClick={() => setCurrentScreen('role_select')}
                        className="text-xs font-bold text-gray-400 hover:text-gray-600"
                      >
                        ← เลือกบทบาทใหม่
                      </button>
                      <div>
                        <h2 className="text-2xl font-black text-gray-800">กรอกข้อมูลผู้สูงอายุ</h2>
                        <p className="text-xs text-gray-500 mt-1">กรุณาระบุความจริงเพื่อให้การดูแลมีประสิทธิภาพและรวดเร็ว</p>
                      </div>

                      <form onSubmit={handleRegisterElderly} className="space-y-3 text-xs text-left">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block font-bold text-gray-600 mb-0.5">ชื่อจริง</label>
                            <input
                              type="text"
                              value={regEldName}
                              onChange={e => setRegEldName(e.target.value)}
                              placeholder="สมใจ"
                              className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-800 focus:outline-[#4CAF7A]"
                              required
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-gray-600 mb-0.5">นามสกุล</label>
                            <input
                              type="text"
                              value={regEldSurname}
                              onChange={e => setRegEldSurname(e.target.value)}
                              placeholder="รักดี"
                              className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-800 focus:outline-[#4CAF7A]"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="block font-bold text-gray-600 mb-0.5">อายุ (ปี)</label>
                            <input
                              type="number"
                              value={regEldAge}
                              onChange={e => setRegEldAge(e.target.value)}
                              className="w-full bg-slate-50 border border-gray-200 rounded-xl px-2 py-2 text-xs text-gray-800 text-center"
                              required
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-gray-600 mb-0.5">เพศ</label>
                            <select
                              value={regEldGender}
                              onChange={e => setRegEldGender(e.target.value)}
                              className="w-full bg-slate-50 border border-gray-200 rounded-xl px-2 py-2 text-xs text-gray-800"
                            >
                              <option>หญิง</option>
                              <option>ชาย</option>
                            </select>
                          </div>
                          <div>
                            <label className="block font-bold text-gray-600 mb-0.5">กรุ๊ปเลือด</label>
                            <input
                              type="text"
                              value={regEldBlood}
                              onChange={e => setRegEldBlood(e.target.value)}
                              placeholder="AB"
                              className="w-full bg-slate-50 border border-gray-200 rounded-xl px-2 py-2 text-xs text-gray-800 text-center"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-bold text-gray-600 mb-0.5">เบอร์โทรศัพท์ติดต่อ</label>
                          <input
                            type="tel"
                            value={regEldPhone}
                            onChange={e => setRegEldPhone(e.target.value)}
                            placeholder="081-234-5678"
                            className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-800"
                            required
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-gray-600 mb-0.5">ที่อยู่อาศัยหลัก</label>
                          <textarea
                            value={regEldAddress}
                            onChange={e => setRegEldAddress(e.target.value)}
                            placeholder="ระบุบ้านเลขที่ ซอย ถนน แขวงเขต"
                            className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 h-14 resize-none"
                            required
                          />
                        </div>

                        <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100 flex items-center justify-between">
                          <div>
                            <p className="text-[10px] font-bold text-emerald-800">📍 ตำแหน่ง GPS ปัจจุบัน</p>
                            <p className="text-[9px] text-gray-500 truncate max-w-[210px] mt-0.5">{gpsSimulatedLabel}</p>
                          </div>
                          <button
                            type="button"
                            onClick={simulatePositionPicker}
                            className="bg-[#4CAF7A] text-white text-[9px] font-bold px-2 py-1.5 rounded-lg active:scale-95"
                          >
                            ดึงค่าพิกัด
                          </button>
                        </div>

                        <div>
                          <label className="block font-bold text-gray-600 mb-0.5">โรคประจำตัว (คั่นด้วยจุลภาค ,)</label>
                          <input
                            type="text"
                            value={regEldDiseases}
                            onChange={e => setRegEldDiseases(e.target.value)}
                            className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-gray-600 mb-0.5">ยาที่ต้องทานเป็นประจำ</label>
                          <input
                            type="text"
                            value={regEldMeds}
                            onChange={e => setRegEldMeds(e.target.value)}
                            className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800"
                          />
                        </div>

                        <div className="bg-red-50/60 p-3 rounded-2xl border border-red-100 space-y-2">
                          <p className="text-[11px] font-extrabold text-red-700">🚨 ข้อมูลผู้ติดต่อฉุกเฉิน (Emergency)</p>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              placeholder="ชื่อ-สกุลญาติ"
                              value={regEldContact}
                              onChange={e => setRegEldContact(e.target.value)}
                              className="w-full bg-white border border-gray-200 rounded-xl px-2.5 py-2 text-[11px]"
                              required
                            />
                            <input
                              type="tel"
                              placeholder="เบอร์ฉุกเฉิน"
                              value={regEldContactPhone}
                              onChange={e => setRegEldContactPhone(e.target.value)}
                              className="w-full bg-white border border-gray-200 rounded-xl px-2.5 py-2 text-[11px]"
                              required
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-[#4CAF7A] hover:bg-[#3D8F63] text-white font-extrabold py-3.5 rounded-2xl text-sm transition-all shadow-md mt-4"
                        >
                          บันทึกการลงทะเบียน
                        </button>
                      </form>
                    </div>
                  </motion.div>
                )}

                {/* 4. Register: Volunteer */}
                {currentScreen === 'register_volunteer' && (
                  <motion.div
                    key="reg_vol"
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -100, opacity: 0 }}
                    className="absolute inset-0 bg-white p-6 flex flex-col justify-between overflow-y-auto"
                  >
                    <div className="space-y-4">
                      <button
                        onClick={() => setCurrentScreen('role_select')}
                        className="text-xs font-bold text-gray-400 hover:text-gray-600"
                      >
                        ← เลือกบทบาทใหม่
                      </button>
                      <div>
                        <h2 className="text-2xl font-black text-gray-800">ลงทะเบียนอาสาสมัคร</h2>
                        <p className="text-xs text-gray-500 mt-1">ร่วมช่วยเหลือปวงชนด้วยจิตสาธารณะ คุ้มครองผู้สูงอายุ</p>
                      </div>

                      <form onSubmit={handleRegisterVolunteer} className="space-y-3 text-xs text-left">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block font-bold text-gray-600 mb-0.5">ชื่อจริง</label>
                            <input
                              type="text"
                              value={regVolName}
                              onChange={e => setRegVolName(e.target.value)}
                              placeholder="วีระ"
                              className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-800 focus:outline-[#FF8A65]"
                              required
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-gray-600 mb-0.5">นามสกุล</label>
                            <input
                              type="text"
                              value={regVolSurname}
                              onChange={e => setRegVolSurname(e.target.value)}
                              placeholder="เด็ดเดี่ยว"
                              className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-800 focus:outline-[#FF8A65]"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block font-bold text-gray-600 mb-0.5">อายุ (ปี)</label>
                            <input
                              type="number"
                              value={regVolAge}
                              onChange={e => setRegVolAge(e.target.value)}
                              className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-800"
                              required
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-gray-600 mb-0.5">เบอร์โทรศัพท์</label>
                            <input
                              type="tel"
                              value={regVolPhone}
                              onChange={e => setRegVolPhone(e.target.value)}
                              placeholder="081-333-2222"
                              className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-800"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-bold text-gray-600 mb-0.5">อีเมลผู้สมัคร</label>
                          <input
                            type="email"
                            value={regVolEmail}
                            onChange={e => setRegVolEmail(e.target.value)}
                            placeholder="volunteer@care.com"
                            className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-800"
                            required
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-gray-600 mb-0.5">ที่อยู่อาศัยหลัก</label>
                          <input
                            type="text"
                            value={regVolAddress}
                            onChange={e => setRegVolAddress(e.target.value)}
                            placeholder="เขต เขตปทุมวัน กรุงเทพฯ"
                            className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-800"
                            required
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-gray-600 mb-0.5">หน่วยงาน / มูลนิธิในสังกัด</label>
                          <input
                            type="text"
                            value={regVolOrg}
                            onChange={e => setRegVolOrg(e.target.value)}
                            className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-800"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-gray-600 mb-0.5">ความสามารถและทักษะพิเศษ</label>
                          <input
                            type="text"
                            value={regVolCaps}
                            onChange={e => setRegVolCaps(e.target.value)}
                            className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-800"
                            required
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-gray-600 mb-0.5">เวลาที่สะดวกเข้าช่วยเหลือ</label>
                          <input
                            type="text"
                            value={regVolTime}
                            onChange={e => setRegVolTime(e.target.value)}
                            className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-800"
                            required
                          />
                        </div>

                        {/* Document & Profile Mock Uploader */}
                        <div className="grid grid-cols-2 gap-2 pt-2">
                          <div className="bg-orange-50/50 p-2.5 rounded-xl border border-orange-100 text-center">
                            <span className="block text-[9px] font-bold text-orange-700">🪪 แนบรูปบัตรอาสา</span>
                            <span className="block text-[8px] text-emerald-600 font-extrabold mt-1">✓ อัปโหลดสำเร็จ</span>
                          </div>
                          <div className="bg-orange-50/50 p-2.5 rounded-xl border border-orange-100 text-center">
                            <span className="block text-[9px] font-bold text-orange-700">📸 แนบรูปโปรไฟล์</span>
                            <span className="block text-[8px] text-emerald-600 font-extrabold mt-1">✓ อัปโหลดสำเร็จ</span>
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-[#FF8A65] hover:bg-[#E57347] text-white font-extrabold py-3.5 rounded-2xl text-sm transition-all shadow-md mt-4"
                        >
                          สมัครสมาชิกจิตอาสา
                        </button>
                      </form>
                    </div>
                  </motion.div>
                )}

                {/* 5. Login View */}
                {currentScreen === 'login' && (
                  <motion.div
                    key="login"
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -100, opacity: 0 }}
                    className="absolute inset-0 bg-white p-6 flex flex-col justify-between"
                  >
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <button
                          onClick={() => setCurrentScreen('splash')}
                          className="text-xs font-bold text-gray-400 hover:text-gray-600"
                        >
                          ← กลับหน้าหลัก
                        </button>
                        <h2 className="text-2xl font-black text-gray-800 mt-2">ยินดีต้อนรับกลับมาค่ะ</h2>
                        <p className="text-xs text-gray-500">กรุณากรอกข้อมูลเพื่อลงชื่อเข้าใช้งานระบบ</p>
                      </div>

                      <form onSubmit={handleLogin} className="space-y-3.5 text-xs text-left">
                        <div>
                          <label className="block font-bold text-gray-600 mb-1 flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-gray-400" />
                            <span>อีเมลผู้ใช้งาน (หรือกรอกสลับบทบาท เช่น admin)</span>
                          </label>
                          <input
                            type="text"
                            placeholder="ตัวอย่าง: somjai@care.com"
                            value={loginEmail}
                            onChange={e => setLoginEmail(e.target.value)}
                            className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3.5 py-3 text-xs text-gray-800 focus:outline-[#4CAF7A]"
                            required
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-gray-600 mb-1 flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5 text-gray-400" />
                            <span>รหัสผ่านผ่านระบบ (Password)</span>
                          </label>
                          <input
                            type="password"
                            placeholder="รหัสผ่านของคุณ"
                            value={loginPassword}
                            onChange={e => setLoginPassword(e.target.value)}
                            className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3.5 py-3 text-xs text-gray-800 focus:outline-[#4CAF7A]"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-[#4CAF7A] hover:bg-[#3D8F63] text-white font-extrabold py-3.5 rounded-2xl text-sm transition-all shadow-lg shadow-emerald-500/10 mt-2"
                        >
                          เข้าสู่ระบบ สูงวัยอุ่นใจ
                        </button>
                      </form>

                      {/* Google login simulator */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-gray-400 text-[10px]">
                          <span className="w-full h-[1px] bg-gray-100" />
                          <span className="px-2 shrink-0">หรือเข้าสู่ระบบด้วยช่องทางด่วน</span>
                          <span className="w-full h-[1px] bg-gray-100" />
                        </div>

                        <button
                          onClick={() => {
                            // Quick login as Somjai
                            setCurrentUser(elderlyList[0]);
                            setCurrentScreen('elderly_home');
                            setElderlySubPage('home');
                          }}
                          className="w-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 active:scale-98 transition-all"
                        >
                          <img
                            src="https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&q=80&w=40"
                            alt="Google"
                            referrerPolicy="no-referrer"
                            className="w-4 h-4 rounded-full"
                          />
                          <span>ลงชื่อเข้าใช้งานด้วย Google</span>
                        </button>
                      </div>
                    </div>

                    <div className="text-center text-[11px] text-gray-400">
                      ยังไม่มีบัญชีสมาชิก?{' '}
                      <button onClick={() => setCurrentScreen('role_select')} className="font-bold text-[#4CAF7A] underline">
                        ลงทะเบียนใหม่ตรงนี้
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* 6. Elderly Home/App Experience (ผู้สูงอายุ) */}
                {currentScreen === 'elderly_home' && currentUser && (
                  <motion.div
                    key="elderly_home"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-white flex flex-col justify-between"
                  >
                    {/* Active Screen Rendering */}
                    <div className="flex-1 overflow-hidden relative">
                      
                      {/* SubPage: HOME */}
                      {elderlySubPage === 'home' && (
                        <div className="absolute inset-0 flex flex-col justify-between overflow-y-auto p-4 space-y-4">
                          {/* Greetings header */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <img
                                src={currentUser.profileImage}
                                alt={currentUser.name}
                                referrerPolicy="no-referrer"
                                className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500 shadow-sm"
                              />
                              <div className="text-left">
                                <span className="text-[10px] text-emerald-600 font-bold tracking-wider">สวัสดีค่ะคุณยาย/คุณตา</span>
                                <h3 className="text-lg font-black text-gray-800 leading-tight">คุณ{currentUser.name} {currentUser.surname}</h3>
                              </div>
                            </div>

                            {/* Notifications / Log out panel buttons */}
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => setElderlySubPage('notifications')}
                                className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl relative text-gray-600 active:scale-95"
                                title="การแจ้งเตือน"
                              >
                                <Bell className="w-5 h-5" />
                                {notifications.filter(n => n.userId === currentUser.id && !n.read).length > 0 && (
                                  <span className="absolute top-1 right-1 bg-red-500 text-white font-extrabold rounded-full text-[9px] w-4 h-4 flex items-center justify-center">
                                    {notifications.filter(n => n.userId === currentUser.id && !n.read).length}
                                  </span>
                                )}
                              </button>
                              <button
                                onClick={handleLogout}
                                className="p-2.5 bg-red-50 hover:bg-red-100 rounded-xl text-red-500 active:scale-95"
                                title="ออกจากระบบ"
                              >
                                <LogOut className="w-5 h-5" />
                              </button>
                            </div>
                          </div>

                          {/* Emergency SOS Quick Launch button (Most critical part of the screen!) */}
                          <div className="bg-red-50 p-4 rounded-3xl border border-red-100 text-center space-y-3 shadow-xs">
                            <div className="flex items-center justify-center gap-2 text-red-600">
                              <AlertTriangle className="w-5 h-5 animate-bounce stroke-[2.5]" />
                              <span className="font-extrabold text-sm tracking-wide">แจ้งเหตุเจ็บป่วย / อุบัติเหตุฉุกเฉินด่วน</span>
                            </div>
                            
                            <button
                              onClick={() => {
                                setSosCountdown(5);
                                setElderlySubPage('sos');
                              }}
                              className="w-full bg-red-500 hover:bg-red-600 text-white font-black py-4.5 rounded-2xl text-lg shadow-lg shadow-red-500/20 active:scale-98 transition-all flex items-center justify-center gap-2"
                            >
                              <span className="animate-pulse">🚨</span>
                              <span>กดปุ่ม SOS ขอความช่วยเหลือ</span>
                            </button>
                            <p className="text-[10px] text-gray-400">ระบบจะส่งตำแหน่ง GPS และแจ้งเตือนไปยังอาสาสมัครที่ใกล้ที่สุดทันที</p>
                          </div>

                          {/* 4 Large optimized menu targets (❤️ สุขภาพ, 🚨 SOS, 👨‍⚕️ อาสาใกล้ฉัน, 📚 ความรู้) */}
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              onClick={() => setElderlySubPage('health')}
                              className="bg-[#E8F5E9] border-b-4 border-[#4CAF7A] text-[#2E7D32] p-4 rounded-3xl flex flex-col items-center justify-center text-center space-y-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xs"
                            >
                              <div className="p-3 bg-white/90 rounded-2xl text-[#2E7D32] shadow-xs">
                                <Activity className="w-7 h-7 stroke-[2.5]" />
                              </div>
                              <div>
                                <h4 className="font-black text-[#2E7D32] text-sm font-display">บันทึกสุขภาพ</h4>
                                <p className="text-[9px] text-[#2E7D32]/80 mt-0.5 font-sans font-medium">ความดัน, ตารางนัดแพทย์</p>
                              </div>
                            </button>

                            <button
                              onClick={() => {
                                setSosCountdown(5);
                                setElderlySubPage('sos');
                              }}
                              className="bg-[#FFEBEE] border-b-4 border-[#FF5252] text-[#C62828] p-4 rounded-3xl flex flex-col items-center justify-center text-center space-y-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xs"
                            >
                              <div className="p-3 bg-white/90 rounded-2xl text-[#C62828] shadow-xs">
                                <Heart className="w-7 h-7 fill-red-100 stroke-[2.5]" />
                              </div>
                              <div>
                                <h4 className="font-black text-[#C62828] text-sm font-display">หน้าจอ SOS</h4>
                                <p className="text-[9px] text-[#C62828]/80 mt-0.5 font-sans font-medium">ติดตามสถานะกู้ชีพกู้ภัย</p>
                              </div>
                            </button>

                            <button
                              onClick={() => {
                                setElderlySubPage('volunteers_near');
                                setSelectedVolOnMap(null);
                              }}
                              className="bg-[#FFF3E0] border-b-4 border-[#FF8A65] text-[#D84315] p-4 rounded-3xl flex flex-col items-center justify-center text-center space-y-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xs"
                            >
                              <div className="p-3 bg-white/90 rounded-2xl text-[#D84315] shadow-xs">
                                <Users className="w-7 h-7 stroke-[2.5]" />
                              </div>
                              <div>
                                <h4 className="font-black text-[#D84315] text-sm font-display">อาสาสมัครใกล้บ้าน</h4>
                                <p className="text-[9px] text-[#D84315]/80 mt-0.5 font-sans font-medium">ติดต่อ แชท โทรสอบถาม</p>
                              </div>
                            </button>

                            <button
                              onClick={() => setElderlySubPage('knowledge')}
                              className="bg-[#F3E5F5] border-b-4 border-[#9C27B0] text-[#6A1B9A] p-4 rounded-3xl flex flex-col items-center justify-center text-center space-y-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xs"
                            >
                              <div className="p-3 bg-white/90 rounded-2xl text-[#6A1B9A] shadow-xs">
                                <BookOpen className="w-7 h-7 stroke-[2.5]" />
                              </div>
                              <div>
                                <h4 className="font-black text-[#6A1B9A] text-sm font-display">ความรู้ดูแลตนเอง</h4>
                                <p className="text-[9px] text-[#6A1B9A]/80 mt-0.5 font-sans font-medium">วิธีรับมือหกล้ม ทานอาหาร</p>
                              </div>
                            </button>
                          </div>

                          {/* Quick health status review preview banner */}
                          <div className="bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100/60 text-left flex justify-between items-center text-xs">
                            <div className="space-y-0.5">
                              <p className="font-extrabold text-[#4CAF7A]">ตารางนัดหมายครั้งต่อไป</p>
                              <p className="text-gray-600 font-medium">พบแพทย์ตรวจเบาหวาน (นพ.อภิชาติ)</p>
                              <p className="text-[10px] text-gray-400 font-bold">15 ก.ค. เวลา 09:30 น.</p>
                            </div>
                            <button
                              onClick={() => setElderlySubPage('health')}
                              className="bg-white border border-[#4CAF7A]/30 text-[#4CAF7A] p-2 rounded-xl text-[10px] font-bold active:scale-95"
                            >
                              ดูนัดทั้งหมด
                            </button>
                          </div>
                        </div>
                      )}

                      {/* SubPage: HEALTH RECORDS (Blood chart, medicine taken) */}
                      {elderlySubPage === 'health' && (
                        <div className="absolute inset-0">
                          <HealthRecordsView
                            records={healthRecords.filter(r => r.elderlyId === currentUser.id)}
                            onAddRecord={handleAddHealthRecord}
                            onBack={() => setElderlySubPage('home')}
                          />
                        </div>
                      )}

                      {/* SubPage: VOLUNTEERS NEAR ME (Map and lists) */}
                      {elderlySubPage === 'volunteers_near' && (
                        <div className="absolute inset-0 bg-slate-50 flex flex-col overflow-y-auto">
                          <div className="bg-white shadow-xs px-4 py-4 flex items-center justify-between border-b border-gray-100 sticky top-0 z-10">
                            <button onClick={() => setElderlySubPage('home')} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-700">
                              ← ย้อนกลับ
                            </button>
                            <span className="text-lg font-bold text-gray-800">อาสาสมัครใกล้ฉัน</span>
                            <div className="w-10"></div>
                          </div>

                          <div className="p-4 space-y-4">
                            {/* Interactive Map */}
                            <MockMap
                              volunteers={volunteersList}
                              elderGps={simulatedGps}
                              onSelectVolunteer={vol => setSelectedVolOnMap(vol)}
                            />

                            <h3 className="font-bold text-gray-800 text-sm">รายชื่ออาสาสมัครทั้งหมดที่พิกัดใกล้บ้านคุณ</h3>

                            <div className="space-y-2.5">
                              {volunteersList.map(vol => (
                                <div
                                  key={vol.id}
                                  onClick={() => setSelectedVolOnMap(vol)}
                                  className={`p-3.5 rounded-2xl bg-white border cursor-pointer transition-all ${
                                    selectedVolOnMap?.id === vol.id ? 'border-emerald-500 shadow-md ring-1 ring-emerald-500' : 'border-gray-100 shadow-xs'
                                  }`}
                                >
                                  <div className="flex justify-between items-start">
                                    <div className="flex gap-3">
                                      <img
                                        src={vol.profileImage}
                                        alt={vol.name}
                                        referrerPolicy="no-referrer"
                                        className="w-10 h-10 rounded-full object-cover"
                                      />
                                      <div className="text-left text-xs">
                                        <p className="font-extrabold text-gray-800">อาสา {vol.name} {vol.surname}</p>
                                        <p className="text-[10px] text-emerald-600 mt-0.5">{vol.organization}</p>
                                        <p className="text-[9px] text-gray-400 mt-1">เวลาสะดวก: {vol.availableTime}</p>
                                      </div>
                                    </div>

                                    <div className="text-right">
                                      <span className="bg-amber-50 text-amber-700 text-[10px] px-1.5 py-0.5 rounded font-extrabold">⭐ {vol.rating}</span>
                                    </div>
                                  </div>

                                  {/* Quick Contact Buttons on expanded active selection */}
                                  {selectedVolOnMap?.id === vol.id && (
                                    <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-gray-100 animate-[fadeIn_0.15s_ease-out]">
                                      <a
                                        href={`tel:${vol.phone}`}
                                        className="bg-emerald-50 text-emerald-700 font-extrabold text-xs py-2 rounded-xl flex items-center justify-center gap-1 hover:bg-emerald-100 transition-all text-center"
                                      >
                                        <Phone className="w-3.5 h-3.5" />
                                        <span>โทรด่วน</span>
                                      </a>
                                      <button
                                        onClick={() => {
                                          // Simulate active request to open chat
                                          const dummySos: SOSRequest = {
                                            id: 'sos_chat_dummy',
                                            elderlyId: currentUser.id,
                                            elderlyName: currentUser.name,
                                            elderlyPhone: currentUser.phone,
                                            elderlyGps: simulatedGps,
                                            elderlyAddress: currentUser.address,
                                            volunteerId: vol.id,
                                            volunteerName: vol.name,
                                            volunteerPhone: vol.phone,
                                            time: '12:00',
                                            date: '2026-07-03',
                                            status: 'accepted'
                                          };
                                          setActiveChatRequest(dummySos);
                                        }}
                                        className="bg-emerald-500 text-white font-extrabold text-xs py-2 rounded-xl flex items-center justify-center gap-1 hover:bg-emerald-600 transition-all"
                                      >
                                        <MessageCircle className="w-3.5 h-3.5" />
                                        <span>ส่งข้อความแชท</span>
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* SubPage: HEALTH KNOWLEDGE (📚 ความรู้ดูแลตัวเอง) */}
                      {elderlySubPage === 'knowledge' && (
                        <div className="absolute inset-0 bg-slate-50 flex flex-col overflow-y-auto">
                          <div className="bg-white shadow-xs px-4 py-4 flex items-center justify-between border-b border-gray-100 sticky top-0 z-10">
                            <button onClick={() => setElderlySubPage('home')} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-700">
                              ← ย้อนกลับ
                            </button>
                            <span className="text-lg font-bold text-gray-800">ความรู้ดูแลตนเอง</span>
                            <div className="w-10"></div>
                          </div>

                          <div className="p-4 space-y-4 text-left">
                            <p className="text-xs text-gray-500">บทความเพื่อช่วยให้คุณยายคุณตา สุขภาพแข็งแรง ปลอดภัยในชีวิตประจำวันค่ะ</p>

                            <div className="space-y-3">
                              {HEALTH_KNOWLEDGE.map(know => (
                                <div
                                  key={know.id}
                                  onClick={() => setSelectedKnowledge(know)}
                                  className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden cursor-pointer hover:border-emerald-200 transition-all flex"
                                >
                                  <img
                                    src={know.image}
                                    alt={know.title}
                                    referrerPolicy="no-referrer"
                                    className="w-24 h-24 object-cover shrink-0"
                                  />
                                  <div className="p-3 flex flex-col justify-between text-xs">
                                    <div>
                                      <span className="bg-sky-50 text-sky-700 font-bold px-1.5 py-0.5 rounded text-[9px]">{know.category}</span>
                                      <h4 className="font-extrabold text-gray-800 text-sm mt-1 leading-tight">{know.title}</h4>
                                    </div>
                                    <span className="text-[10px] text-gray-400">{know.readTime}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* SubPage: SOS ACTIVATION SCREEN */}
                      {elderlySubPage === 'sos' && (
                        <div className={`absolute inset-0 flex flex-col justify-between p-6 overflow-y-auto transition-colors duration-500 ${sosCountdown !== null ? 'bg-[#FF8A65]' : 'bg-white'}`}>
                          {/* Countdown State */}
                          {sosCountdown !== null ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 my-auto">
                              <div className="relative flex items-center justify-center">
                                <div className="absolute w-44 h-44 bg-white/20 rounded-full animate-ping opacity-75" />
                                <div className="absolute w-36 h-36 bg-white/30 rounded-full animate-pulse" />
                                <div className="bg-white w-28 h-28 rounded-full flex items-center justify-center text-[#FF8A65] font-black text-6xl shadow-xl z-10 font-display">
                                  {sosCountdown}
                                </div>
                              </div>

                              <div className="space-y-3 z-10 text-white">
                                <h3 className="text-3xl font-black font-display leading-tight">ขอความช่วยเหลือ</h3>
                                <p className="text-sm text-white/90 leading-relaxed max-w-xs mx-auto">
                                  ระบบกำลังจะส่งพิกัด GPS ของคุณและแจ้งเตือนไปยังกลุ่มอาสาสมัครในพื้นที่ฉุกเฉินโดยอัตโนมัติ
                                </p>
                              </div>

                              <button
                                onClick={() => {
                                  setSosCountdown(null);
                                  setElderlySubPage('home');
                                }}
                                className="w-full bg-white text-[#FF8A65] py-4 rounded-2xl text-lg font-black shadow-xl hover:bg-white/95 active:scale-95 transition-all font-display"
                              >
                                ยกเลิกคำขอ (CANCEL)
                              </button>
                            </div>
                          ) : activeSosRequest ? (
                            /* SOS dispatch status progress timeline */
                            <div className="flex-1 flex flex-col justify-between text-left space-y-5">
                              <div className="space-y-2">
                                <h2 className="text-2xl font-black text-red-600 flex items-center gap-1.5">
                                  <span className="animate-pulse">🚨</span>
                                  <span>กำลังดำเนินการขอความช่วยเหลือ</span>
                                </h2>
                                <p className="text-xs text-gray-500">กรุณาทำใจให้สบายและรอการติดต่อกลับ อาสาสมัครกู้ภัยกำลังเร่งพิกัดมาค่ะ</p>
                              </div>

                              {/* Interactive map visualization */}
                              <MockMap
                                volunteers={volunteersList}
                                elderGps={simulatedGps}
                                activeVolunteerId={activeSosRequest.volunteerId}
                                showRoute={true}
                              />

                              {/* Status progress tracker */}
                              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <h4 className="font-bold text-gray-800 text-xs">ขั้นตอนการดำเนินงาน:</h4>
                                
                                <div className="space-y-2.5 text-xs">
                                  {/* Step 1: Searching */}
                                  <div className="flex items-center gap-2.5">
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white font-extrabold ${
                                      activeSosRequest.status === 'searching' ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'
                                    }`}>
                                      {activeSosRequest.status === 'searching' ? '•' : '✓'}
                                    </div>
                                    <span className={activeSosRequest.status === 'searching' ? 'font-bold text-red-600' : 'text-gray-500'}>
                                      กำลังค้นหาอาสาสมัครในพื้นที่ที่อยู่ใกล้ที่สุด
                                    </span>
                                  </div>

                                  {/* Step 2: Accepted */}
                                  <div className="flex items-center gap-2.5">
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white font-extrabold ${
                                      activeSosRequest.status === 'searching'
                                        ? 'bg-gray-200'
                                        : activeSosRequest.status === 'accepted'
                                        ? 'bg-red-500 animate-pulse'
                                        : 'bg-emerald-500'
                                    }`}>
                                      {activeSosRequest.status === 'searching' ? '' : activeSosRequest.status === 'accepted' ? '•' : '✓'}
                                    </div>
                                    <span className={activeSosRequest.status === 'accepted' ? 'font-bold text-red-600' : 'text-gray-400'}>
                                      อาสาสมัครตอบรับช่วยเหลือแล้ว {activeSosRequest.volunteerName && `(คุณ ${activeSosRequest.volunteerName})`}
                                    </span>
                                  </div>

                                  {/* Step 3: Travelling */}
                                  <div className="flex items-center gap-2.5">
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white font-extrabold ${
                                      activeSosRequest.status === 'on_the_way'
                                        ? 'bg-emerald-500 animate-bounce'
                                        : 'bg-gray-200'
                                    }`}>
                                      {activeSosRequest.status === 'on_the_way' ? '•' : ''}
                                    </div>
                                    <span className={activeSosRequest.status === 'on_the_way' ? 'font-bold text-emerald-600' : 'text-gray-400'}>
                                      อาสาสมัครกำลังเร่งเดินทางมาหาท่าน
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Volunteer Details card */}
                              {activeSosRequest.volunteerId && (
                                <div className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <img
                                      src={volunteersList[0].profileImage}
                                      alt="volunteer"
                                      referrerPolicy="no-referrer"
                                      className="w-10 h-10 rounded-full object-cover border border-emerald-500"
                                    />
                                    <div className="text-xs">
                                      <p className="font-extrabold text-gray-800">อาสา {activeSosRequest.volunteerName}</p>
                                      <p className="text-[10px] text-gray-500">📞 {activeSosRequest.volunteerPhone}</p>
                                    </div>
                                  </div>

                                  <div className="flex gap-1.5">
                                    <a
                                      href={`tel:${activeSosRequest.volunteerPhone}`}
                                      className="bg-emerald-50 text-emerald-700 p-2.5 rounded-xl hover:bg-emerald-100 transition-all"
                                    >
                                      <Phone className="w-4 h-4" />
                                    </a>
                                    <button
                                      onClick={() => setActiveChatRequest(activeSosRequest)}
                                      className="bg-emerald-500 text-white p-2.5 rounded-xl hover:bg-emerald-600 transition-all"
                                    >
                                      <MessageCircle className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* Cancel request */}
                              <div className="flex gap-2.5">
                                <button
                                  onClick={() => {
                                    setActiveSosRequest(null);
                                    setElderlySubPage('home');
                                  }}
                                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold py-3.5 rounded-2xl text-xs text-center shadow-xs"
                                >
                                  ยกเลิกเคสช่วยเหลือ
                                </button>
                                
                                {activeSosRequest.status === 'on_the_way' && (
                                  <button
                                    onClick={() => {
                                      // Trigger complete and open review rating dialog
                                      setReviewTargetSosId(activeSosRequest.id);
                                      setShowReviewModal(true);
                                    }}
                                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold py-3.5 rounded-2xl text-xs text-center shadow-md shadow-emerald-100"
                                  >
                                    ช่วยเหลือเสร็จสิ้นแล้ว
                                  </button>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                              <Heart className="w-14 h-14 text-red-500 stroke-[2] animate-pulse" />
                              <h3 className="font-bold text-gray-800">ไม่มีการทำรายการ SOS ค้างอยู่ค่ะ</h3>
                              <button
                                onClick={() => setElderlySubPage('home')}
                                className="bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold"
                              >
                                กลับหน้าแรกผู้สูงอายุ
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* SubPage: NOTIFICATIONS */}
                      {elderlySubPage === 'notifications' && (
                        <div className="absolute inset-0 bg-slate-50 flex flex-col overflow-y-auto">
                          <div className="bg-white shadow-xs px-4 py-4 flex items-center justify-between border-b border-gray-100 sticky top-0 z-10">
                            <button onClick={() => setElderlySubPage('home')} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-700">
                              ← กลับหน้าหลัก
                            </button>
                            <span className="text-lg font-bold text-gray-800">การแจ้งเตือน</span>
                            <div className="w-10"></div>
                          </div>

                          <div className="p-4 space-y-3">
                            {notifications.filter(n => n.userId === currentUser.id).length === 0 ? (
                              <div className="bg-white p-8 rounded-2xl text-center text-gray-400 border border-gray-100">
                                <Bell className="w-10 h-10 mx-auto text-gray-300 mb-1" />
                                <p className="font-bold text-xs">ไม่มีการแจ้งเตือนใหม่ค่ะ</p>
                              </div>
                            ) : (
                              notifications
                                .filter(n => n.userId === currentUser.id)
                                .map(notif => (
                                  <div key={notif.id} className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-xs text-xs text-left relative flex items-start gap-3">
                                    <span className="p-2 bg-emerald-50 text-[#4CAF7A] rounded-xl font-bold">
                                      {notif.type === 'pill' ? '💊' : notif.type === 'appointment' ? '🩺' : '🚨'}
                                    </span>
                                    <div>
                                      <p className="font-extrabold text-gray-800">{notif.title}</p>
                                      <p className="text-gray-500 mt-0.5">{notif.message}</p>
                                      <span className="text-[9px] text-gray-400 font-bold mt-1 block">{notif.time} น.</span>
                                    </div>
                                  </div>
                                ))
                            )}
                          </div>
                        </div>
                      )}

                    </div>

                    {/* App Bottom Navigation Bar for Elderly */}
                    <div className="bg-white border-t border-gray-100 py-3.5 px-6 flex justify-between items-center text-xs select-none sticky bottom-0 z-20">
                      <button
                        onClick={() => setElderlySubPage('home')}
                        className={`flex flex-col items-center gap-1 font-bold ${
                          elderlySubPage === 'home' ? 'text-[#4CAF7A]' : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        <User className="w-5 h-5" />
                        <span>หน้าหลัก</span>
                      </button>

                      <button
                        onClick={() => setElderlySubPage('health')}
                        className={`flex flex-col items-center gap-1 font-bold ${
                          elderlySubPage === 'health' ? 'text-[#4CAF7A]' : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        <Activity className="w-5 h-5" />
                        <span>สุขภาพ</span>
                      </button>

                      <button
                        onClick={() => {
                          setElderlySubPage('volunteers_near');
                          setSelectedVolOnMap(null);
                        }}
                        className={`flex flex-col items-center gap-1 font-bold ${
                          elderlySubPage === 'volunteers_near' ? 'text-[#4CAF7A]' : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        <MapPin className="w-5 h-5" />
                        <span>อาสาใกล้เคียง</span>
                      </button>

                      <button
                        onClick={() => setElderlySubPage('knowledge')}
                        className={`flex flex-col items-center gap-1 font-bold ${
                          elderlySubPage === 'knowledge' ? 'text-[#4CAF7A]' : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        <BookOpen className="w-5 h-5" />
                        <span>ความรู้คลัง</span>
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* 7. Volunteer Home Screen */}
                {currentScreen === 'volunteer_home' && currentUser && (
                  <motion.div
                    key="volunteer_home"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-50 flex flex-col justify-between overflow-y-auto"
                  >
                    <div className="p-4 space-y-4 text-left">
                      
                      {/* Volunteer Info Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={currentUser.profileImage}
                            alt={currentUser.name}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-full object-cover border-2 border-orange-400"
                          />
                          <div>
                            <span className="text-[10px] text-orange-600 font-bold uppercase tracking-wider">แผงงานอาสาสมัคร</span>
                            <h3 className="text-base font-black text-gray-800 leading-tight">คุณ{currentUser.name} {currentUser.surname}</h3>
                          </div>
                        </div>

                        <button
                          onClick={handleLogout}
                          className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl"
                        >
                          <LogOut className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Dashboard counters */}
                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-xs">
                          <p className="text-[10px] font-bold text-gray-400">จำนวนเคสวันนี้</p>
                          <p className="text-xl font-black text-gray-800">2 เคส</p>
                        </div>
                        <div className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-xs">
                          <p className="text-[10px] font-bold text-gray-400">เคสที่ช่วยเหลือสำเร็จ</p>
                          <p className="text-xl font-black text-emerald-600">{sosRequests.filter(r => r.status === 'completed' && r.volunteerId === currentUser.id).length} เคส</p>
                        </div>
                      </div>

                      {/* REAL-TIME SIMULATOR: Show SOS alarm card if any other user has triggered SOS and is searching */}
                      {sosRequests.some(r => r.status === 'searching') ? (
                        <div className="bg-red-50 border-2 border-red-300 p-4 rounded-3xl space-y-3 shadow-md animate-pulse">
                          <div className="flex items-center gap-2 text-red-700">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                            <span className="font-extrabold text-sm uppercase">🚨 แจ้งเตือนด่วน: มีผู้สูงอายุขอความช่วยเหลือ!</span>
                          </div>

                          {sosRequests
                            .filter(r => r.status === 'searching')
                            .map(req => (
                              <div key={req.id} className="text-xs text-slate-700 space-y-2">
                                <p><strong>ชื่อผู้ป่วย:</strong> คุณ{req.elderlyName}</p>
                                <p><strong>เบอร์โทรติดต่อ:</strong> {req.elderlyPhone}</p>
                                <p><strong>ที่อยู่ฉุกเฉิน:</strong> {req.elderlyAddress}</p>
                                <p className="text-[10px] text-gray-400 font-bold">พิกัดจำลอง: {req.elderlyGps.lat}, {req.elderlyGps.lng}</p>

                                <div className="grid grid-cols-2 gap-2 pt-1">
                                  <button
                                    onClick={() => {
                                      // Decline simulation simply hides or cancels
                                      setSosRequests(prev => prev.filter(r => r.id !== req.id));
                                    }}
                                    className="bg-white border border-gray-200 text-gray-600 font-bold py-2 rounded-xl"
                                  >
                                    ปฏิเสธ
                                  </button>
                                  <button
                                    onClick={() => handleVolunteerAcceptSOS(req)}
                                    className="bg-emerald-500 text-white font-extrabold py-2 rounded-xl hover:bg-emerald-600 transition-all text-center flex items-center justify-center gap-1"
                                  >
                                    <span>รับเคสช่วยเหลือ</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 text-center text-xs text-emerald-800">
                          <p className="font-bold">✓ สแตนบายพร้อมปฏิบัติงาน</p>
                          <p className="text-[10px] opacity-80 mt-0.5">ไม่มีคำขอ SOS ค้างอยู่ในขณะนี้ ระบบจะเตือนเมื่อมีเคสเกิดขึ้น</p>
                        </div>
                      )}

                      {/* Active Case workflow panel (when volunteer has accepted but not completed) */}
                      {sosRequests.some(r => r.volunteerId === currentUser.id && r.status !== 'completed') && (
                        <div className="bg-white p-4 rounded-3xl border border-orange-200 shadow-sm space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="bg-orange-100 text-orange-800 font-black text-[10px] px-2.5 py-1 rounded-xl">เคสกำลังเข้าช่วยเหลือ</span>
                            <span className="text-[10px] text-gray-400">พิกัดจำลองเส้นทางกู้ภัย</span>
                          </div>

                          {sosRequests
                            .filter(r => r.volunteerId === currentUser.id && r.status !== 'completed')
                            .map(req => (
                              <div key={req.id} className="space-y-3 text-xs">
                                <MockMap
                                  volunteers={volunteersList}
                                  elderGps={req.elderlyGps}
                                  activeVolunteerId={currentUser.id}
                                  showRoute={true}
                                />

                                <div className="space-y-1">
                                  <p className="font-extrabold text-sm text-gray-800">คุณยาย {req.elderlyName}</p>
                                  <p className="text-gray-500">{req.elderlyAddress}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-gray-100">
                                  <a
                                    href={`tel:${req.elderlyPhone}`}
                                    className="bg-emerald-50 text-emerald-700 py-2.5 rounded-xl text-center font-bold flex items-center justify-center gap-1 hover:bg-emerald-100 transition-colors"
                                  >
                                    <Phone className="w-4 h-4" />
                                    <span>โทรด่วน</span>
                                  </a>
                                  <button
                                    onClick={() => setActiveChatRequest(req)}
                                    className="bg-emerald-500 text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-1 hover:bg-emerald-600 transition-colors"
                                  >
                                    <MessageCircle className="w-4 h-4" />
                                    <span>เปิดแชทคุย</span>
                                  </button>
                                </div>

                                <button
                                  onClick={() => {
                                    // Trigger completed
                                    const updated = { ...req, status: 'completed' as const };
                                    setSosRequests(prev => prev.map(r => (r.id === req.id ? updated : r)));
                                    sendAppNotification(
                                      req.elderlyId,
                                      'การช่วยเหลือเสร็จสิ้นแล้ว 🎉',
                                      'กรุณาประเมินความพึงพอใจการทำงานของอาสาสมัครด้วยนะคะ',
                                      'accepted'
                                    );
                                  }}
                                  className="w-full bg-slate-800 hover:bg-slate-900 text-white font-extrabold py-3.5 rounded-2xl shadow-sm text-center"
                                >
                                  บันทึกเป็น: ช่วยเหลือเสร็จสิ้นเรียบร้อย
                                </button>
                              </div>
                            ))}
                        </div>
                      )}

                      {/* Assistance rescue history log list */}
                      <div className="space-y-2.5">
                        <h3 className="font-extrabold text-gray-800 text-sm">ประวัติการเข้าช่วยเหลือของฉัน</h3>
                        {sosRequests.filter(r => r.volunteerId === currentUser.id && r.status === 'completed').length === 0 ? (
                          <p className="text-xs text-gray-400 italic">ไม่มีข้อมูลเคสช่วยเหลือในประวัติ</p>
                        ) : (
                          sosRequests
                            .filter(r => r.volunteerId === currentUser.id && r.status === 'completed')
                            .map(req => (
                              <div key={req.id} className="bg-white p-3 rounded-2xl border border-gray-100 shadow-xs text-xs space-y-1">
                                <div className="flex justify-between font-bold text-gray-800">
                                  <span>เคส: คุณ{req.elderlyName}</span>
                                  <span className="text-emerald-600">สำเร็จแล้ว ✓</span>
                                </div>
                                <p className="text-gray-400 text-[10px]">นัดกู้ภัยช่วยเหลือเมื่อ: {req.date} เวลา {req.time} น.</p>
                                {req.rating && (
                                  <div className="text-amber-500 font-extrabold text-[11px] flex items-center gap-1 pt-1 border-t border-gray-50">
                                    <span>คะแนนประเมิน: {Array(req.rating).fill('⭐').join('')}</span>
                                    {req.reviewComment && <span className="text-gray-500 font-medium italic block mt-0.5 text-[10px]">"{req.reviewComment}"</span>}
                                  </div>
                                )}
                              </div>
                            ))
                        )}
                      </div>

                    </div>
                  </motion.div>
                )}

                {/* 8. Admin View wrapper */}
                {currentScreen === 'admin_dashboard' && (
                  <motion.div
                    key="admin"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0"
                  >
                    <AdminPanel
                      elderly={elderlyList}
                      volunteers={volunteersList}
                      sosRequests={sosRequests}
                      onDeleteElderly={handleDeleteElderly}
                      onDeleteVolunteer={handleDeleteVolunteer}
                      onBack={handleLogout}
                    />
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

          </div>

          {/* Real-time chat dialogue screen overlay (For both Elder and Volunteer) */}
          {activeChatRequest && (
            <div className="absolute inset-2 bg-white rounded-[24px] overflow-hidden shadow-2xl border-4 border-slate-100 flex flex-col z-50 animate-[slideUp_0.2s_ease-out]">
              <div className="bg-emerald-500 text-white px-4 py-3.5 flex justify-between items-center shrink-0">
                <div className="text-left">
                  <h4 className="font-extrabold text-sm leading-tight">
                    ห้องคุยแชท: อาสา {activeChatRequest.volunteerName || 'ผู้ดูแล'}
                  </h4>
                  <p className="text-[10px] opacity-80">ติดต่อกู้ภัยฉุกเฉิน สูงวัยอุ่นใจ</p>
                </div>
                <button
                  onClick={() => setActiveChatRequest(null)}
                  className="bg-white/20 text-white font-bold px-2.5 py-1 rounded-lg text-xs"
                >
                  ปิดแชท
                </button>
              </div>

              {/* Message scroll log list */}
              <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-slate-50 flex flex-col">
                {chats
                  .filter(c => c.sosId === activeChatRequest.id || c.sosId === 'sos_active' || c.sosId === 'sos_chat_dummy')
                  .map(msg => {
                    const isMe = msg.senderId === currentUser.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col max-w-[75%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}
                      >
                        <span className="text-[9px] text-gray-400 font-bold mb-0.5">
                          {msg.senderRole === 'elderly' ? 'คุณยาย' : 'อาสาสมัคร'}
                        </span>
                        <div
                          className={`p-3 rounded-2xl text-xs leading-relaxed ${
                            isMe ? 'bg-emerald-500 text-white rounded-tr-none' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
                          }`}
                        >
                          {msg.message}
                        </div>
                        <span className="text-[8px] text-gray-400 mt-0.5 font-bold">{msg.time}</span>
                      </div>
                    );
                  })}
              </div>

              {/* Message Composer Footer */}
              <form onSubmit={handleSendChatMessage} className="p-2 border-t border-gray-100 flex gap-2 bg-white sticky bottom-0 z-10">
                <input
                  type="text"
                  placeholder="พิมพ์ข้อความตอบกลับ..."
                  value={chatMessageInput}
                  onChange={e => setChatMessageInput(e.target.value)}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-emerald-500"
                  required
                />
                <button
                  type="submit"
                  className="bg-emerald-500 text-white p-2.5 rounded-xl hover:bg-emerald-600 transition-all shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* Health Knowledge Full Article Modal view */}
          {selectedKnowledge && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-end z-50 animate-[fadeIn_0.2s_ease-out]">
              <div className="bg-white w-full rounded-t-3xl overflow-hidden shadow-2xl max-h-[85%] flex flex-col animate-[slideUp_0.2s_ease-out]">
                <img
                  src={selectedKnowledge.image}
                  alt={selectedKnowledge.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-44 object-cover"
                />

                <div className="p-5 flex-1 overflow-y-auto space-y-4 text-left">
                  <div className="flex items-center justify-between">
                    <span className="bg-sky-50 text-sky-700 font-bold px-2 py-0.5 rounded text-[10px]">
                      {selectedKnowledge.category}
                    </span>
                    <span className="text-xs text-gray-400 font-bold">{selectedKnowledge.readTime}</span>
                  </div>

                  <h3 className="font-extrabold text-gray-800 text-lg leading-tight">{selectedKnowledge.title}</h3>

                  <div className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap space-y-2 font-medium bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    {selectedKnowledge.content}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 border-t border-gray-100">
                  <button
                    onClick={() => setSelectedKnowledge(null)}
                    className="w-full bg-[#4CAF7A] text-white font-extrabold py-3.5 rounded-2xl text-xs"
                  >
                    เข้าใจแล้ว ปิดหน้าต่างนี้
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SOS Feedback Review Modal overlay (Triggered after SOS completed on Elder side) */}
          {showReviewModal && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <form onSubmit={handleSubmitReview} className="bg-white w-full rounded-3xl p-5 text-center space-y-4 shadow-2xl animate-[scaleUp_0.2s_ease-out] text-xs">
                <div className="p-3 bg-amber-50 rounded-2xl text-amber-500 w-fit mx-auto">
                  <Star className="w-8 h-8 fill-amber-400 stroke-[1.5]" />
                </div>

                <div>
                  <h3 className="font-extrabold text-gray-800 text-base">ประเมินความพึงพอใจ</h3>
                  <p className="text-gray-500 text-[11px] mt-1">คะแนนของคุณช่วยผลักดันและเป็นกำลังใจให้อาสาสมัครทุกคนนะคะ</p>
                </div>

                {/* Star selectors */}
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map(starNum => (
                    <button
                      key={starNum}
                      type="button"
                      onClick={() => setReviewRating(starNum)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          starNum <= reviewRating ? 'text-amber-500 fill-amber-400' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <textarea
                  placeholder="เขียนคำชมเชยหรือข้อเสนอแนะเพิ่มเติมที่นี่..."
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl p-3 h-20 resize-none focus:outline-[#4CAF7A]"
                />

                <button
                  type="submit"
                  className="w-full bg-[#4CAF7A] hover:bg-[#3D8F63] text-white font-extrabold py-3.5 rounded-2xl text-xs transition-all shadow-md shadow-emerald-100"
                >
                  ส่งแบบประเมินและเสร็จสิ้นเคส
                </button>
              </form>
            </div>
          )}

        </div>

      </div>

      {/* Styled inline custom helper animations classes */}
      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

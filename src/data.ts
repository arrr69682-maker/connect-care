import { ElderlyProfile, VolunteerProfile, HealthRecord, PillReminder, DoctorAppointment, SOSRequest, Notification, ChatMessage } from './types';

// Let's create default data
export const DEFAULT_ELDERLY: ElderlyProfile[] = [
  {
    id: 'e1',
    email: 'somjai@care.com',
    role: 'elderly',
    name: 'สมใจ',
    surname: 'รักดี',
    phone: '081-234-5678',
    profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120',
    age: 72,
    gender: 'หญิง',
    address: '123/4 หมู่ 5 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110',
    gps: { lat: 13.7245, lng: 100.5682 },
    chronicDiseases: ['ความดันโลหิตสูง', 'เบาหวาน'],
    regularMedications: ['Amlodipine 5mg (หลังอาหารเช้า)', 'Metformin 500mg (หลังอาหารเช้า-เย็น)'],
    bloodGroup: 'AB',
    emergencyContact: 'คุณสมศักดิ์ รักดี (บุตรชาย)',
    emergencyPhone: '089-876-5432'
  },
  {
    id: 'e2',
    email: 'prasit@care.com',
    role: 'elderly',
    name: 'ประสิทธิ์',
    surname: 'มั่นคง',
    phone: '082-345-6789',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
    age: 78,
    gender: 'ชาย',
    address: '99/1 ซอยอารีย์ 4 แขวงพญาไท เขตพญาไท กรุงเทพฯ 10400',
    gps: { lat: 13.7802, lng: 100.5448 },
    chronicDiseases: ['โรคหัวใจ', 'ไขมันในเลือดสูง'],
    regularMedications: ['Aspirin 81mg (หลังอาหารเช้า)', 'Atorvastatin 20mg (ก่อนนอน)'],
    bloodGroup: 'O',
    emergencyContact: 'คุณนภา มั่นคง (บุตรสาว)',
    emergencyPhone: '086-555-1234'
  }
];

export const DEFAULT_VOLUNTEERS: VolunteerProfile[] = [
  {
    id: 'v1',
    email: 'kittipong@volunteer.com',
    role: 'volunteer',
    name: 'กิตติพงษ์',
    surname: 'ใจดี',
    phone: '085-111-2222',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
    age: 28,
    address: '45/2 ถนนพระราม 4 แขวงสาทร เขตสาทร กรุงเทพฯ 10120',
    gps: { lat: 13.7220, lng: 100.5620 },
    organization: 'สมาคมอาสาสมัครชุมชนคลองเตย',
    capabilities: ['ปฐมพยาบาลเบื้องต้น', 'ทำ CPR ได้', 'เคลื่อนย้ายผู้ป่วยติดเตียง'],
    availableTime: 'ทุกวันเสาร์-อาทิตย์ และวันธรรมดาหลัง 18.00 น.',
    idCardUploaded: true,
    rating: 4.9,
    reviewCount: 18
  },
  {
    id: 'v2',
    email: 'jirapa@volunteer.com',
    role: 'volunteer',
    name: 'จิราภา',
    surname: 'แสนใจ',
    phone: '086-333-4444',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
    age: 32,
    address: '88 ถนนพหลโยธิน แขวงพญาไท เขตพญาไท กรุงเทพฯ 10400',
    gps: { lat: 13.7780, lng: 100.5420 },
    organization: 'มูลนิธิกู้ภัยร่วมใจพญาไท',
    capabilities: ['พยาบาลวิชาชีพ', 'วัดสัญญาณชีพ', 'ขับรถฉุกเฉิน'],
    availableTime: 'วันจันทร์-ศุกร์ เวลา 09.00 - 17.00 น.',
    idCardUploaded: true,
    rating: 4.8,
    reviewCount: 24
  },
  {
    id: 'v3',
    email: 'sarawut@volunteer.com',
    role: 'volunteer',
    name: 'สราวุธ',
    surname: 'สุวรรณ',
    phone: '089-777-8888',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120',
    age: 25,
    address: '15 ซอยสุขุมวิท 22 แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110',
    gps: { lat: 13.7290, lng: 100.5690 },
    organization: 'จิตอาสาเพื่อผู้สูงวัยกรุงเทพฯ',
    capabilities: ['ปฐมพยาบาลเบื้องต้น', 'ซื้อของและจัดยา', 'พูดคุยบำบัดจิตใจ'],
    availableTime: 'ตลอด 24 ชั่วโมงในวันหยุด',
    idCardUploaded: true,
    rating: 4.7,
    reviewCount: 12
  }
];

export const DEFAULT_HEALTH_RECORDS: HealthRecord[] = [
  // Somjai's blood pressure history for chart (e1)
  { id: 'h1', elderlyId: 'e1', date: '2026-06-29', time: '08:30', systolic: 118, diastolic: 78, heartRate: 72, bloodSugar: 105, weight: 58.5, status: 'normal' },
  { id: 'h2', elderlyId: 'e1', date: '2026-06-30', time: '08:30', systolic: 122, diastolic: 80, heartRate: 75, bloodSugar: 110, weight: 58.6, status: 'normal' },
  { id: 'h3', elderlyId: 'e1', date: '2026-07-01', time: '08:30', systolic: 125, diastolic: 82, heartRate: 71, bloodSugar: 98, weight: 58.4, status: 'normal' },
  { id: 'h4', elderlyId: 'e1', date: '2026-07-02', time: '08:30', systolic: 135, diastolic: 85, heartRate: 78, bloodSugar: 125, weight: 59.0, status: 'warning' },
  { id: 'h5', elderlyId: 'e1', date: '2026-07-03', time: '08:30', systolic: 120, diastolic: 80, heartRate: 72, bloodSugar: 112, weight: 58.5, status: 'normal' },

  // Prasit's records (e2)
  { id: 'h6', elderlyId: 'e2', date: '2026-07-02', time: '09:00', systolic: 138, diastolic: 89, heartRate: 68, bloodSugar: 140, weight: 72.0, status: 'warning' },
  { id: 'h7', elderlyId: 'e2', date: '2026-07-03', time: '09:15', systolic: 142, diastolic: 92, heartRate: 70, bloodSugar: 145, weight: 72.2, status: 'danger' }
];

export const DEFAULT_PILLS: PillReminder[] = [
  { id: 'p1', elderlyId: 'e1', name: 'ยาคุมความดัน (Amlodipine)', time: '08:00', dosage: '1 เม็ด', taken: true },
  { id: 'p2', elderlyId: 'e1', name: 'ยาเบาหวาน (Metformin)', time: '08:00', dosage: '1 เม็ด หลังอาหาร', taken: true },
  { id: 'p3', elderlyId: 'e1', name: 'ยาเบาหวาน (Metformin)', time: '18:00', dosage: '1 เม็ด หลังอาหาร', taken: false },
  { id: 'p4', elderlyId: 'e1', name: 'ยาวิตามินบำรุง', time: '20:00', dosage: '1 เม็ด', taken: false },

  { id: 'p5', elderlyId: 'e2', name: 'ยาแอสไพริน', time: '08:00', dosage: '1 เม็ด หลังอาหารเช้า', taken: true },
  { id: 'p6', elderlyId: 'e2', name: 'ยาลดไขมัน (Atorvastatin)', time: '21:00', dosage: '1 เม็ด ก่อนนอน', taken: false }
];

export const DEFAULT_APPOINTMENTS: DoctorAppointment[] = [
  { id: 'ap1', elderlyId: 'e1', doctorName: 'นพ.อภิชาติ เลิศวิจิตร', hospital: 'โรงพยาบาลจุฬาลงกรณ์', date: '2026-07-15', time: '09:30', note: 'ตรวจเบาหวานและวัดระดับน้ำตาลสะสม (HbA1c) งดน้ำและอาหารหลังเที่ยงคืน' },
  { id: 'ap2', elderlyId: 'e2', doctorName: 'พญ.นภาลัย มีความสุข', hospital: 'โรงพยาบาลรามาธิบดี', date: '2026-07-20', time: '13:00', note: 'นัดตรวจอาการโรคหัวใจ ติดตามผล ECG' }
];

export const DEFAULT_SOS_REQUESTS: SOSRequest[] = [
  {
    id: 'sos1',
    elderlyId: 'e1',
    elderlyName: 'สมใจ รักดี',
    elderlyPhone: '081-234-5678',
    elderlyGps: { lat: 13.7245, lng: 100.5682 },
    elderlyAddress: '123/4 หมู่ 5 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110',
    volunteerId: 'v1',
    volunteerName: 'กิตติพงษ์ ใจดี',
    volunteerPhone: '085-111-2222',
    time: '14:20',
    date: '2026-07-01',
    status: 'completed',
    rating: 5,
    reviewComment: 'อาสาสมัครเดินทางมาถึงเร็วมาก ช่วยเหลือพยุงขึ้นรถฉุกเฉินอย่างปลอดภัย สุภาพและใจดีมากค่ะ'
  },
  {
    id: 'sos2',
    elderlyId: 'e2',
    elderlyName: 'ประสิทธิ์ มั่นคง',
    elderlyPhone: '082-345-6789',
    elderlyGps: { lat: 13.7802, lng: 100.5448 },
    elderlyAddress: '99/1 ซอยอารีย์ 4 แขวงพญาไท เขตพญาไท กรุงเทพฯ 10400',
    volunteerId: 'v2',
    volunteerName: 'จิราภา แสนใจ',
    volunteerPhone: '086-333-4444',
    time: '10:05',
    date: '2026-07-02',
    status: 'completed',
    rating: 4,
    reviewComment: 'มาตรวจเช็คความดันโลหิตและช่วยเตรียมยากินยา ปลอบใจผู้สูงอายุได้ดีมาก'
  }
];

export const DEFAULT_NOTIFICATIONS: Notification[] = [
  { id: 'n1', userId: 'e1', title: 'แจ้งเตือนกินยา', message: 'ถึงเวลาทานยาเบาหวาน (Metformin) แล้วค่ะ', time: '18:00', type: 'pill', read: false },
  { id: 'n2', userId: 'e1', title: 'แจ้งเตือนนัดแพทย์', message: 'คุณมีนัดตรวจเบาหวานกับ นพ.อภิชาติ ในวันที่ 15 ก.ค. นี้', time: '09:00', type: 'appointment', read: false },
  { id: 'n3', userId: 'v1', title: 'ช่วยเหลือเสร็จสิ้น', message: 'เคสช่วยเหลือ คุณสมใจ รักดี ได้รับรีวิวคะแนน 5 ดาว!', time: '15:10', type: 'review', read: false }
];

export const DEFAULT_CHATS: ChatMessage[] = [
  { id: 'c1', sosId: 'sos_active', senderId: 'v1', senderRole: 'volunteer', message: 'กำลังเดินทางไปแล้วครับคุณยาย รอประมาณ 5 นาทีนะครับ', time: '12:01' },
  { id: 'c2', sosId: 'sos_active', senderId: 'e1', senderRole: 'elderly', message: 'ค่ะลูก ประตูบ้านยายไม่ได้ล็อคนะ เข้ามาได้เลย ยายนั่งรออยู่ที่โซฟาจ้ะ', time: '12:02' }
];

// Health Knowledge contents
export const HEALTH_KNOWLEDGE = [
  {
    id: 1,
    title: 'วิธีรับมือเมื่อผู้สูงอายุล้มลง',
    category: 'การปฐมพยาบาล',
    content: '1. ห้ามพยุงลุกทันที ให้ประเมินการบาดเจ็บก่อน\n2. ตรวจสอบการรับรู้ด้วยการเรียกและเคาะไหล่\n3. สังเกตบาดแผลหรือจุดปวดบวมเฉียบพลัน\n4. หากไม่ขยับตัว มีกระดูกหัก หรือหมดสติ ให้รีบกด SOS ขอความช่วยเหลือ',
    image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=300',
    readTime: 'อ่าน 3 นาที'
  },
  {
    id: 2,
    title: 'การคุมอาหารสำหรับผู้ป่วยความดันโลหิตสูง',
    category: 'อาหารสุขภาพ',
    content: '1. ลดการกินเค็ม ลดเกลือ น้ำปลา ซอสปรุงรส\n2. หลีกเลี่ยงอาหารแปรรูปและอาหารหมักดอง\n3. เน้นกินผักใบเขียว และผลไม้รสไม่หวาน เช่น ฝรั่ง แอปเปิ้ล\n4. ดื่มน้ำสะอาดให้เพียงพอ หลีกเลี่ยงเครื่องดื่มแอลกอฮอล์',
    image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=300',
    readTime: 'อ่าน 5 นาที'
  },
  {
    id: 3,
    title: '5 ท่าออกกำลังกายง่ายๆ บนเก้าอี้',
    category: 'การออกกำลังกาย',
    content: '1. ท่าเหยียดขาทรงตัว: นั่งหลังตรง ยื่นขาไปข้างหน้าเกร็งไว้ 5 วินาที สลับข้าง\n2. ท่าย่ำเท้ากับที่: ค่อยๆ ยกเข่าซ้าย-ขวาสลับกัน\n3. ท่ายืดกล้ามเนื้อน่อง: นั่งปลายเก้าอี้ เหยียดส้นเท้าชี้ขึ้นฟ้า\n4. ท่าหมุนไหล่: หมุนไหล่ไปข้างหลังช้าๆ เพื่อเปิดกระดูกสันหลังและปอด',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=300',
    readTime: 'อ่าน 4 นาที'
  }
];

export class LocalDB {
  static get<T>(key: string, defaultValue: T): T {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  static set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Failed to write to localStorage', e);
    }
  }

  static init() {
    if (!localStorage.getItem('sc_elderly')) {
      this.set('sc_elderly', DEFAULT_ELDERLY);
    }
    if (!localStorage.getItem('sc_volunteers')) {
      this.set('sc_volunteers', DEFAULT_VOLUNTEERS);
    }
    if (!localStorage.getItem('sc_records')) {
      this.set('sc_records', DEFAULT_HEALTH_RECORDS);
    }
    if (!localStorage.getItem('sc_pills')) {
      this.set('sc_pills', DEFAULT_PILLS);
    }
    if (!localStorage.getItem('sc_appointments')) {
      this.set('sc_appointments', DEFAULT_APPOINTMENTS);
    }
    if (!localStorage.getItem('sc_sos')) {
      this.set('sc_sos', DEFAULT_SOS_REQUESTS);
    }
    if (!localStorage.getItem('sc_notifications')) {
      this.set('sc_notifications', DEFAULT_NOTIFICATIONS);
    }
    if (!localStorage.getItem('sc_chats')) {
      this.set('sc_chats', DEFAULT_CHATS);
    }
  }

  static reset() {
    localStorage.removeItem('sc_elderly');
    localStorage.removeItem('sc_volunteers');
    localStorage.removeItem('sc_records');
    localStorage.removeItem('sc_pills');
    localStorage.removeItem('sc_appointments');
    localStorage.removeItem('sc_sos');
    localStorage.removeItem('sc_notifications');
    localStorage.removeItem('sc_chats');
    this.init();
  }
}

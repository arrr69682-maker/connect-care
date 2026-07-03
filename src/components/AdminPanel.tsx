import { useState } from 'react';
import { ElderlyProfile, VolunteerProfile, SOSRequest } from '../types';
import { Users, ShieldAlert, CheckCircle, BarChart3, FileText, Trash2, ArrowLeftRight, Activity, Calendar } from 'lucide-react';

interface AdminPanelProps {
  elderly: ElderlyProfile[];
  volunteers: VolunteerProfile[];
  sosRequests: SOSRequest[];
  onDeleteElderly: (id: string) => void;
  onDeleteVolunteer: (id: string) => void;
  onBack: () => void;
}

export default function AdminPanel({
  elderly,
  volunteers,
  sosRequests,
  onDeleteElderly,
  onDeleteVolunteer,
  onBack
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'stats' | 'elderly' | 'volunteers' | 'sos'>('stats');
  const [showExportModal, setShowExportModal] = useState(false);

  // Compute stats
  const totalSOS = sosRequests.length;
  const completedSOS = sosRequests.filter(r => r.status === 'completed').length;
  const activeSOS = sosRequests.filter(r => r.status !== 'completed').length;
  const averageRating = (
    sosRequests.filter(r => r.rating !== undefined).reduce((acc, r) => acc + (r.rating || 0), 0) /
    (sosRequests.filter(r => r.rating !== undefined).length || 1)
  ).toFixed(1);

  const handleExportPDF = () => {
    setShowExportModal(true);
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 overflow-y-auto pb-10">
      {/* Header */}
      <div className="sticky top-0 bg-white shadow-xs px-4 py-4 flex items-center justify-between border-b border-gray-100 z-10">
        <button onClick={onBack} className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3 py-1.5 rounded-xl text-xs">
          ออกจากแอดมิน
        </button>
        <span className="text-lg font-black text-slate-800">ระบบแอดมิน (Admin Care)</span>
        <div className="w-10"></div>
      </div>

      {/* Admin tabs */}
      <div className="p-3 bg-white border-b border-gray-100 flex gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
            activeTab === 'stats' ? 'bg-slate-800 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 inline mr-1" />
          ภาพรวมสถิติ
        </button>
        <button
          onClick={() => setActiveTab('elderly')}
          className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
            activeTab === 'elderly' ? 'bg-slate-800 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          <Users className="w-3.5 h-3.5 inline mr-1" />
          ผู้สูงอายุ ({elderly.length})
        </button>
        <button
          onClick={() => setActiveTab('volunteers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
            activeTab === 'volunteers' ? 'bg-slate-800 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          <Activity className="w-3.5 h-3.5 inline mr-1" />
          อาสาสมัคร ({volunteers.length})
        </button>
        <button
          onClick={() => setActiveTab('sos')}
          className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
            activeTab === 'sos' ? 'bg-slate-800 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 inline mr-1" />
          เหตุฉุกเฉิน ({sosRequests.length})
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {activeTab === 'stats' && (
          <div className="space-y-4">
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
                <p className="text-xs font-medium text-gray-500">เหตุฉุกเฉิน SOS ทั้งหมด</p>
                <p className="text-2xl font-black text-gray-800 mt-1">{totalSOS} ครั้ง</p>
                <div className="flex gap-2 text-[10px] text-gray-400 mt-1">
                  <span className="text-emerald-500 font-bold">สำเร็จ {completedSOS}</span>
                  <span>|</span>
                  <span className="text-red-500 font-bold">ค้างอยู่ {activeSOS}</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
                <p className="text-xs font-medium text-gray-500">เรตติ้งความพึงพอใจ</p>
                <p className="text-2xl font-black text-amber-500 mt-1">⭐ {averageRating} / 5</p>
                <p className="text-[10px] text-gray-400 mt-1">อิงตามความคิดเห็นผู้สูงอายุ</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
                <p className="text-xs font-medium text-gray-500">ผู้ลงทะเบียนทั้งหมด</p>
                <p className="text-xl font-black text-gray-800 mt-1">{elderly.length + volunteers.length} คน</p>
                <p className="text-[10px] text-gray-400">ผู้สูงอายุ {elderly.length} • อาสาสมัคร {volunteers.length}</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
                <p className="text-xs font-medium text-gray-500">เวลาการตอบรับเฉลี่ย</p>
                <p className="text-lg font-black text-emerald-600 mt-1">~2.4 นาที</p>
                <p className="text-[10px] text-gray-400">เร็วกว่าเกณฑ์มาตรฐานทั่วไป</p>
              </div>
            </div>

            {/* Quick Chart */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
              <h3 className="font-bold text-gray-800 text-sm mb-3">เปรียบเทียบสัดส่วนกลุ่มโรคผู้สูงอายุ</h3>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>ความดันโลหิตสูง</span>
                    <span className="font-bold">65%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '65%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>โรคเบาหวาน</span>
                    <span className="font-bold">40%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full rounded-full" style={{ width: '40%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>โรคหัวใจ / ไขมันสูง</span>
                    <span className="font-bold">30%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-orange-400 h-full rounded-full" style={{ width: '30%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Print & PDF Buttons */}
            <button
              onClick={handleExportPDF}
              className="w-full bg-slate-800 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-900 transition-all text-xs shadow-md"
            >
              <FileText className="w-4 h-4" />
              <span>พิมพ์รายงานสถิติ (Export PDF / Print Report)</span>
            </button>
          </div>
        )}

        {activeTab === 'elderly' && (
          <div className="space-y-3">
            <h3 className="font-bold text-gray-800 text-sm">รายชื่อผู้สูงอายุในระบบ</h3>
            {elderly.map(el => (
              <div key={el.id} className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-xs space-y-2 relative">
                <div className="flex items-center gap-3">
                  <img
                    src={el.profileImage || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120'}
                    alt={el.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full object-cover border border-slate-100"
                  />
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">คุณ{el.name} {el.surname}</h4>
                    <p className="text-xs text-gray-500">อายุ: {el.age} ปี • เพศ: {el.gender} • เลือดกรุ๊ป {el.bloodGroup}</p>
                    <p className="text-[10px] text-gray-400 truncate max-w-[180px] mt-0.5">📞 {el.phone}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-50 text-[11px] text-gray-600 space-y-1">
                  <p><strong>โรคประจำตัว:</strong> {el.chronicDiseases.join(', ')}</p>
                  <p><strong>ผู้ติดต่อฉุกเฉิน:</strong> {el.emergencyContact} ({el.emergencyPhone})</p>
                </div>

                <button
                  onClick={() => onDeleteElderly(el.id)}
                  className="absolute right-3 top-3 text-red-500 p-1.5 hover:bg-red-50 rounded-xl"
                  title="ลบผู้ใช้นี้"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'volunteers' && (
          <div className="space-y-3">
            <h3 className="font-bold text-gray-800 text-sm">รายชื่ออาสาสมัครและประวัติการยืนยันตัวตน</h3>
            {volunteers.map(vol => (
              <div key={vol.id} className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-xs space-y-2 relative">
                <div className="flex items-center gap-3">
                  <img
                    src={vol.profileImage}
                    alt={vol.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full object-cover border border-slate-100"
                  />
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">คุณ{vol.name} {vol.surname}</h4>
                    <p className="text-xs text-gray-500">อายุ: {vol.age} ปี • อารมณ์ทำงาน: ⭐ {vol.rating} ({vol.reviewCount} เคส)</p>
                    <p className="text-[10px] text-emerald-600 font-medium">✨ {vol.organization}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-50 text-[11px] text-gray-600 space-y-1">
                  <p><strong>ความสามารถ:</strong> {vol.capabilities.join(', ')}</p>
                  <p><strong>เวลาว่าง:</strong> {vol.availableTime}</p>
                </div>

                <div className="flex items-center gap-1.5 mt-1">
                  <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded text-[9px] border border-emerald-100 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    ตรวจสอบบัตรอาสาเรียบร้อย
                  </span>
                </div>

                <button
                  onClick={() => onDeleteVolunteer(vol.id)}
                  className="absolute right-3 top-3 text-red-500 p-1.5 hover:bg-red-50 rounded-xl"
                  title="ลบผู้ใช้นี้"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'sos' && (
          <div className="space-y-3">
            <h3 className="font-bold text-gray-800 text-sm">ประวัติบันทึกแจ้งขอความช่วยเหลือ (SOS)</h3>
            {[...sosRequests].reverse().map(req => (
              <div key={req.id} className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-400 font-mono">ID: {req.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    req.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {req.status === 'completed' ? 'ช่วยเหลือเสร็จสิ้น' : 'กำลังดำเนินการ'}
                  </span>
                </div>

                <div className="text-xs text-gray-700 space-y-1">
                  <p><strong>ผู้สูงอายุ:</strong> คุณ{req.elderlyName} (📞 {req.elderlyPhone})</p>
                  {req.volunteerName && <p><strong>อาสาสมัคร:</strong> คุณ{req.volunteerName} (📞 {req.volunteerPhone})</p>}
                  <p className="text-[10px] text-gray-400">📅 วันที่ {req.date} เวลา {req.time} น.</p>
                </div>

                {req.rating && (
                  <div className="bg-amber-50/50 p-2 rounded-xl text-xs border border-amber-100">
                    <p className="font-bold text-amber-700">⭐ {req.rating} คะแนนรีวิว</p>
                    {req.reviewComment && <p className="text-gray-500 text-[11px] mt-0.5 italic">"{req.reviewComment}"</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Export Printable PDF Modal (Simulated Report) */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]">
            {/* Modal Print Area */}
            <div className="p-6 overflow-y-auto space-y-6" id="printable-area">
              <div className="text-center border-b border-gray-200 pb-4">
                <h1 className="text-2xl font-black text-slate-800 flex items-center justify-center gap-2">
                  <span>สูงวัยอุ่นใจ (Senior Care Connect)</span>
                </h1>
                <p className="text-xs text-gray-500 mt-1">รายงานสรุปผลการช่วยเหลือและการปฏิบัติการเหตุฉุกเฉิน</p>
                <p className="text-[10px] text-gray-400 mt-0.5">วันที่พิมพ์รายงาน: {new Date().toLocaleDateString('th-TH')}</p>
              </div>

              {/* Stats Block */}
              <div className="space-y-4">
                <h3 className="font-extrabold text-gray-800 text-sm uppercase tracking-wider border-l-4 border-slate-800 pl-2">
                  1. ดัชนีชี้วัดประสิทธิภาพ (KPIs Report)
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-[10px] text-gray-500">จำนวนการกด SOS ทั้งหมด</p>
                    <p className="text-lg font-bold text-gray-800">{totalSOS} ครั้ง</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-[10px] text-gray-500">อัตราความช่วยเหลือสำเร็จ</p>
                    <p className="text-lg font-bold text-emerald-600">
                      {Math.round((completedSOS / (totalSOS || 1)) * 100)}%
                    </p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-[10px] text-gray-500">คะแนนความพึงพอใจเฉลี่ย</p>
                    <p className="text-lg font-bold text-amber-500">⭐ {averageRating} / 5</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-[10px] text-gray-500">ระยะเวลาเข้าช่วยเหลือเฉลี่ย</p>
                    <p className="text-lg font-bold text-slate-800">2.4 นาที</p>
                  </div>
                </div>
              </div>

              {/* Users Summary Table */}
              <div className="space-y-3">
                <h3 className="font-extrabold text-gray-800 text-sm uppercase tracking-wider border-l-4 border-slate-800 pl-2">
                  2. สถิติข้อมูลผู้ลงทะเบียน (User Demographics)
                </h3>
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700">
                      <th className="p-2 border">หมวดหมู่</th>
                      <th className="p-2 border text-right">จำนวน (คน)</th>
                      <th className="p-2 border text-right">สัดส่วน</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 border">ผู้สูงอายุที่ลงทะเบียน</td>
                      <td className="p-2 border text-right font-semibold">{elderly.length}</td>
                      <td className="p-2 border text-right">{Math.round((elderly.length / (elderly.length + volunteers.length || 1)) * 100)}%</td>
                    </tr>
                    <tr>
                      <td className="p-2 border">อาสาสมัครกู้ภัย/ดูแล</td>
                      <td className="p-2 border text-right font-semibold">{volunteers.length}</td>
                      <td className="p-2 border text-right">{Math.round((volunteers.length / (elderly.length + volunteers.length || 1)) * 100)}%</td>
                    </tr>
                    <tr className="font-bold bg-slate-50">
                      <td className="p-2 border">รวมทั้งสิ้น</td>
                      <td className="p-2 border text-right">{elderly.length + volunteers.length}</td>
                      <td className="p-2 border text-right">100%</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Footer Stamp */}
              <div className="border-t border-dashed border-gray-300 pt-4 text-center">
                <p className="text-[10px] text-gray-400 font-mono">SIGNED: SYSTEM ADMINISTRATOR SECTOR (ONLINE CERTIFIED)</p>
                <p className="text-[9px] text-slate-500 mt-1">พิมพ์รายงานนี้โดยกดปุ่มสั่งพิมพ์ด้านล่างเพื่อออกเป็นไฟล์ PDF จริงทางคอมพิวเตอร์ของคุณ</p>
              </div>
            </div>

            {/* Modal Controls */}
            <div className="bg-gray-50 px-6 py-4 flex gap-3 border-t border-gray-100">
              <button
                onClick={() => setShowExportModal(false)}
                className="flex-1 bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 font-bold py-3 rounded-2xl text-xs"
              >
                ปิดหน้าต่าง
              </button>
              <button
                onClick={printReport}
                className="flex-1 bg-slate-800 text-white font-bold py-3 rounded-2xl hover:bg-slate-900 transition-all text-xs flex items-center justify-center gap-1.5"
              >
                <FileText className="w-4 h-4" />
                <span>สั่งพิมพ์ / บันทึก PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

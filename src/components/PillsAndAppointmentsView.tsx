import React, { useState } from 'react';
import { PillReminder, DoctorAppointment } from '../types';
import { Pill, Calendar, Clock, Plus, Trash2, CheckCircle2, ChevronLeft, Building, User } from 'lucide-react';

interface PillsAndAppointmentsViewProps {
  pills: PillReminder[];
  appointments: DoctorAppointment[];
  onTogglePill: (pillId: string) => void;
  onAddPill: (pill: Omit<PillReminder, 'id' | 'taken'>) => void;
  onAddAppointment: (appointment: Omit<DoctorAppointment, 'id'>) => void;
  onBack: () => void;
}

export default function PillsAndAppointmentsView({
  pills,
  appointments,
  onTogglePill,
  onAddPill,
  onAddAppointment,
  onBack,
}: PillsAndAppointmentsViewProps) {
  const [activeTab, setActiveTab] = useState<'pills' | 'appointments'>('pills');
  
  // Add medicine state
  const [showAddPill, setShowAddPill] = useState(false);
  const [pillName, setPillName] = useState('');
  const [pillTime, setPillTime] = useState('08:00');
  const [pillDosage, setPillDosage] = useState('1 เม็ด');

  // Add appointment state
  const [showAddAppt, setShowAddAppt] = useState(false);
  const [apptDoctor, setApptDoctor] = useState('');
  const [apptHospital, setApptHospital] = useState('');
  const [apptDate, setApptDate] = useState('2026-07-15');
  const [apptTime, setApptTime] = useState('09:00');
  const [apptNote, setApptNote] = useState('');

  const handlePillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pillName.trim()) return;
    onAddPill({
      elderlyId: pills[0]?.elderlyId || 'e1',
      name: pillName,
      time: pillTime,
      dosage: pillDosage
    });
    setPillName('');
    setShowAddPill(false);
  };

  const handleApptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apptDoctor.trim() || !apptHospital.trim()) return;
    onAddAppointment({
      elderlyId: appointments[0]?.elderlyId || 'e1',
      doctorName: apptDoctor,
      hospital: apptHospital,
      date: apptDate,
      time: apptTime,
      note: apptNote
    });
    setApptDoctor('');
    setApptHospital('');
    setApptNote('');
    setShowAddAppt(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto pb-10">
      {/* Header */}
      <div className="sticky top-0 bg-white shadow-xs px-4 py-4 flex items-center justify-between border-b border-gray-100 z-10">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 text-gray-700">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="text-xl font-bold text-gray-800">ตารางกินยา & นัดแพทย์</span>
        <div className="w-10"></div>
      </div>

      {/* Tabs */}
      <div className="p-4">
        <div className="bg-white p-1.5 rounded-2xl shadow-xs border border-gray-100 flex gap-2">
          <button
            onClick={() => setActiveTab('pills')}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
              activeTab === 'pills'
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <Pill className="w-4 h-4" />
            <span>เตือนกินยา</span>
            <span className="bg-emerald-50 text-emerald-600 rounded-full px-1.5 py-0.5 text-[10px] font-extrabold ml-1">
              {pills.filter(p => !p.taken).length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
              activeTab === 'appointments'
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>นัดหมายแพทย์</span>
            <span className="bg-emerald-50 text-emerald-600 rounded-full px-1.5 py-0.5 text-[10px] font-extrabold ml-1">
              {appointments.length}
            </span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 space-y-4">
        {activeTab === 'pills' ? (
          <div className="space-y-3">
            {/* Pill Lists */}
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-800 text-base">รายการยากินวันนี้</h3>
              <p className="text-xs text-gray-500">ติ๊กถูกเมื่อกินยาแล้ว</p>
            </div>

            {pills.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-dashed border-gray-200 text-center text-gray-400">
                <Pill className="w-12 h-12 mx-auto stroke-[1.5] text-gray-300 mb-2" />
                <p className="font-bold text-sm">ไม่มีบันทึกเตือนกินยา</p>
                <p className="text-xs mt-1">กดเพิ่มเพื่อบันทึกยาใหม่ได้เลยค่ะ</p>
              </div>
            ) : (
              <div className="space-y-2">
                {pills.map(pill => (
                  <div
                    key={pill.id}
                    onClick={() => onTogglePill(pill.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 flex items-center justify-between ${
                      pill.taken
                        ? 'bg-emerald-50/50 border-emerald-100 opacity-70'
                        : 'bg-white border-gray-100 hover:border-emerald-200 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl transition-all ${
                        pill.taken ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-50 text-orange-500'
                      }`}>
                        <Pill className="w-5 h-5" />
                      </div>
                      <div>
                        <p className={`font-bold text-sm text-gray-800 ${pill.taken ? 'line-through text-gray-400' : ''}`}>
                          {pill.name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                          <span className="flex items-center gap-0.5"><Clock className="w-3.5 h-3.5" /> {pill.time} น.</span>
                          <span>•</span>
                          <span>{pill.dosage}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      {pill.taken ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-100" />
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-gray-300 hover:border-emerald-500 transition-colors" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Pill Form */}
            {!showAddPill ? (
              <button
                onClick={() => setShowAddPill(true)}
                className="w-full border-2 border-dashed border-emerald-300 text-emerald-600 font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-50/50 transition-all text-sm active:scale-95 mt-2"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>เพิ่มเตือนความจำยากิน</span>
              </button>
            ) : (
              <form onSubmit={handlePillSubmit} className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-sm space-y-3 animate-[slideDown_0.2s_ease-out]">
                <h4 className="font-bold text-gray-800 text-sm">เพิ่มยาตัวใหม่</h4>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="ชื่อยา (เช่น ยาแก้ความดัน, วิตามินซี)"
                    value={pillName}
                    onChange={e => setPillName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-emerald-500"
                    required
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="time"
                      value={pillTime}
                      onChange={e => setPillTime(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-emerald-500 font-bold text-gray-700"
                      required
                    />
                    <input
                      type="text"
                      placeholder="ปริมาณ (เช่น 1 เม็ด)"
                      value={pillDosage}
                      onChange={e => setPillDosage(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-emerald-500"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowAddPill(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 py-2 rounded-lg text-xs font-bold"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg text-xs font-bold shadow-xs"
                  >
                    บันทึกยา
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {/* Appointments lists */}
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-800 text-base">การนัดตรวจทั้งหมด</h3>
              <p className="text-xs text-gray-500">กรุณางดน้ำ/อาหารตามคำแนะนำแพทย์</p>
            </div>

            {appointments.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-dashed border-gray-200 text-center text-gray-400">
                <Calendar className="w-12 h-12 mx-auto stroke-[1.5] text-gray-300 mb-2" />
                <p className="font-bold text-sm">ไม่มีประวัตินัดหมายแพทย์</p>
                <p className="text-xs mt-1">เพิ่มนัดตรวจเพื่อป้องกันการลืมนะคะ</p>
              </div>
            ) : (
              <div className="space-y-3">
                {appointments.map(appt => (
                  <div key={appt.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs space-y-3 hover:border-emerald-100 transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-gray-400" />
                            {appt.doctorName}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                            <Building className="w-3.5 h-3.5 text-gray-400" />
                            {appt.hospital}
                          </p>
                        </div>
                      </div>

                      <div className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-xl text-right">
                        <p className="text-[10px] font-bold">{appt.date}</p>
                        <p className="text-[11px] font-black mt-0.5">{appt.time} น.</p>
                      </div>
                    </div>

                    {appt.note && (
                      <div className="bg-slate-50 p-2.5 rounded-xl text-[11px] text-slate-600 leading-relaxed border-l-4 border-emerald-500">
                        <span className="font-bold text-slate-700 block mb-0.5">⚠️ คำแนะนำแพทย์:</span>
                        {appt.note}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Add Appointment form */}
            {!showAddAppt ? (
              <button
                onClick={() => setShowAddAppt(true)}
                className="w-full border-2 border-dashed border-emerald-300 text-emerald-600 font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-50/50 transition-all text-sm active:scale-95 mt-2"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>ลงทะเบียนนัดพบแพทย์</span>
              </button>
            ) : (
              <form onSubmit={handleApptSubmit} className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-sm space-y-3 animate-[slideDown_0.2s_ease-out]">
                <h4 className="font-bold text-gray-800 text-sm">เพิ่มข้อมูลนัดแพทย์</h4>
                <div className="space-y-2 text-xs">
                  <input
                    type="text"
                    placeholder="ชื่อแพทย์ผู้รักษา (เช่น นพ.สมยศ)"
                    value={apptDoctor}
                    onChange={e => setApptDoctor(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-emerald-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="ชื่อคลินิก/โรงพยาบาล"
                    value={apptHospital}
                    onChange={e => setApptHospital(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-emerald-500"
                    required
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={apptDate}
                      onChange={e => setApptDate(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-emerald-500 font-bold text-gray-700"
                      required
                    />
                    <input
                      type="time"
                      value={apptTime}
                      onChange={e => setApptTime(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-emerald-500 font-bold text-gray-700"
                      required
                    />
                  </div>
                  <textarea
                    placeholder="คำเตือน/สิ่งที่ต้องเตรียมตัว (เช่น งดน้ำและอาหารหลังเที่ยงคืน)"
                    value={apptNote}
                    onChange={e => setApptNote(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-emerald-500 h-16 resize-none"
                  />
                </div>
                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowAddAppt(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 py-2 rounded-lg text-xs font-bold"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg text-xs font-bold shadow-xs"
                  >
                    บันทึกนัดหมาย
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

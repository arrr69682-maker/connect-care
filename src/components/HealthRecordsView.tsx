import React, { useState, useRef, useEffect } from 'react';
import { HealthRecord } from '../types';
import { Heart, Activity, Droplets, Scale, Plus, Calendar, Clock, ChevronLeft } from 'lucide-react';

interface HealthRecordsViewProps {
  records: HealthRecord[];
  onAddRecord: (record: Omit<HealthRecord, 'id' | 'date' | 'time'>) => void;
  onBack: () => void;
}

export default function HealthRecordsView({ records, onAddRecord, onBack }: HealthRecordsViewProps) {
  const [systolic, setSystolic] = useState('120');
  const [diastolic, setDiastolic] = useState('80');
  const [heartRate, setHeartRate] = useState('72');
  const [bloodSugar, setBloodSugar] = useState('110');
  const [weight, setWeight] = useState('58.5');
  const [showAddForm, setShowAddForm] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Filter records sorted by date/time
  const sortedRecords = [...records].sort((a, b) => {
    return new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime();
  }).slice(-7); // Last 7 records for the chart

  useEffect(() => {
    // Draw Trend Chart using native canvas
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear and scale
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const width = canvas.width;
    const height = canvas.height;
    const padding = 35;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Drawing Grid & background
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();

      // Labels (Systolic range 60 to 160)
      const labelVal = 160 - (100 / 4) * i;
      ctx.fillStyle = '#64748b';
      ctx.font = '10px sans-serif';
      ctx.fillText(labelVal.toString(), 10, y + 4);
    }

    if (sortedRecords.length === 0) return;

    // Draw lines
    const getX = (index: number) => {
      if (sortedRecords.length <= 1) return padding + chartWidth / 2;
      return padding + (chartWidth / (sortedRecords.length - 1)) * index;
    };

    const getY = (val: number) => {
      const minVal = 60;
      const maxVal = 160;
      const pct = (val - minVal) / (maxVal - minVal);
      return padding + chartHeight - chartHeight * pct;
    };

    // Draw Systolic Line (BP High - Teal)
    ctx.beginPath();
    sortedRecords.forEach((rec, idx) => {
      const x = getX(idx);
      const y = getY(rec.systolic);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#4CAF7A';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw Systolic dots
    sortedRecords.forEach((rec, idx) => {
      const x = getX(idx);
      const y = getY(rec.systolic);
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#4CAF7A';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
    });

    // Draw Diastolic Line (BP Low - Orange)
    ctx.beginPath();
    sortedRecords.forEach((rec, idx) => {
      const x = getX(idx);
      const y = getY(rec.diastolic);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#FF8A65';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw Diastolic dots
    sortedRecords.forEach((rec, idx) => {
      const x = getX(idx);
      const y = getY(rec.diastolic);
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#FF8A65';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
    });

    // Draw Date Labels below
    sortedRecords.forEach((rec, idx) => {
      const x = getX(idx);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px sans-serif';
      const formattedDate = rec.date.substring(5); // MM-DD
      ctx.fillText(formattedDate, x - 12, height - 10);
    });

  }, [sortedRecords]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sysNum = parseInt(systolic);
    const diaNum = parseInt(diastolic);
    const hrNum = parseInt(heartRate);
    const sugarNum = bloodSugar ? parseInt(bloodSugar) : undefined;
    const weightNum = weight ? parseFloat(weight) : undefined;

    let status: 'normal' | 'warning' | 'danger' = 'normal';
    if (sysNum >= 140 || diaNum >= 90 || (sugarNum && sugarNum >= 180)) {
      status = 'danger';
    } else if (sysNum >= 130 || diaNum >= 85 || (sugarNum && sugarNum >= 140)) {
      status = 'warning';
    }

    onAddRecord({
      elderlyId: records[0]?.elderlyId || 'e1',
      systolic: sysNum,
      diastolic: diaNum,
      heartRate: hrNum,
      bloodSugar: sugarNum,
      weight: weightNum,
      status
    });

    setShowAddForm(false);
  };

  const latestRecord = records[records.length - 1] || {
    systolic: 120,
    diastolic: 80,
    heartRate: 72,
    bloodSugar: 110,
    weight: 58.5,
    status: 'normal',
    date: '2026-07-03',
    time: '08:30'
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto pb-10">
      {/* Header */}
      <div className="sticky top-0 bg-white shadow-xs px-4 py-4 flex items-center justify-between border-b border-gray-100 z-10">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 text-gray-700">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="text-xl font-bold text-gray-800">สุขภาพของฉัน</span>
        <div className="w-10"></div>
      </div>

      <div className="p-4 space-y-4">
        {/* Latest Stats Cards - Grid layout styled with custom rounded corners */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-100 flex items-center gap-3">
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">ความดันโลหิต</p>
              <p className="text-lg font-bold text-gray-800">{latestRecord.systolic}/{latestRecord.diastolic}</p>
              <p className="text-[10px] text-gray-400">mmHg</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-100 flex items-center gap-3">
            <div className="p-3 bg-red-50 rounded-xl text-red-500">
              <Heart className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">ชีพจร / ชีพชีพ</p>
              <p className="text-lg font-bold text-gray-800">{latestRecord.heartRate}</p>
              <p className="text-[10px] text-gray-400">ครั้ง/นาที</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-100 flex items-center gap-3">
            <div className="p-3 bg-sky-50 rounded-xl text-sky-500">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">ระดับน้ำตาล</p>
              <p className="text-lg font-bold text-gray-800">{latestRecord.bloodSugar || '--'}</p>
              <p className="text-[10px] text-gray-400">mg/dL</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-100 flex items-center gap-3">
            <div className="p-3 bg-orange-50 rounded-xl text-orange-500">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">น้ำหนักตัว</p>
              <p className="text-lg font-bold text-gray-800">{latestRecord.weight || '--'}</p>
              <p className="text-[10px] text-gray-400">กิโลกรัม</p>
            </div>
          </div>
        </div>

        {/* BP status banner */}
        <div className={`p-4 rounded-2xl shadow-xs border flex items-center justify-between ${
          latestRecord.status === 'danger'
            ? 'bg-red-50 border-red-200 text-red-800'
            : latestRecord.status === 'warning'
            ? 'bg-orange-50 border-orange-200 text-orange-800'
            : 'bg-emerald-50 border-emerald-200 text-emerald-800'
        }`}>
          <div>
            <p className="font-bold text-sm">สถานะสุขภาพล่าสุด</p>
            <p className="text-xs opacity-90 mt-0.5">
              {latestRecord.status === 'danger' && '⚠️ ความดันหรือค่าน้ำตาลอยู่ในเกณฑ์อันตราย ควรปรึกษาแพทย์'}
              {latestRecord.status === 'warning' && '⚠️ เริ่มมีสภาวะความดันค่อนข้างสูง ควรควบคุมเค็มและพักผ่อนให้เพียงพอ'}
              {latestRecord.status === 'normal' && '✅ ร่างกายสมบูรณ์แข็งแรงดี รักษามาตรฐานนี้ต่อไปนะคะ'}
            </p>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
            latestRecord.status === 'danger'
              ? 'bg-red-200 text-red-900'
              : latestRecord.status === 'warning'
              ? 'bg-orange-200 text-orange-900'
              : 'bg-emerald-200 text-emerald-900'
          }`}>
            {latestRecord.status === 'danger' ? 'อันตราย' : latestRecord.status === 'warning' ? 'เฝ้าระวัง' : 'ปกติ'}
          </span>
        </div>

        {/* Blood Pressure Graph card */}
        <div className="bg-white p-4 rounded-2xl shadow-xs border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-bold text-gray-800 text-base">กราฟแสดงแนวโน้มความดันโลหิต</h3>
              <p className="text-xs text-gray-500 mt-0.5">แสดงข้อมูลล่าสุด 7 ครั้ง (mmHg)</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-medium">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>SYS (สูง)</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-orange-400"></span>DIA (ต่ำ)</span>
            </div>
          </div>
          <canvas ref={canvasRef} width={320} height={180} className="w-full h-[180px]" />
        </div>

        {/* Buttons to open Form or Record */}
        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full bg-emerald-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-emerald-100 hover:bg-emerald-600 transition-all text-base active:scale-[0.98]"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
            <span>บันทึกค่าสุขภาพใหม่</span>
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-sm space-y-4 animate-[slideDown_0.2s_ease-out]">
            <h3 className="font-bold text-gray-800 text-base flex items-center gap-2 border-b border-gray-100 pb-2">
              <Activity className="text-emerald-500 w-5 h-5" />
              <span>กรอกข้อมูลสุขภาพใหม่</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">ความดันบน (Systolic)</label>
                <input
                  type="number"
                  value={systolic}
                  onChange={e => setSystolic(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-center font-bold text-gray-800 focus:outline-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">ความดันล่าง (Diastolic)</label>
                <input
                  type="number"
                  value={diastolic}
                  onChange={e => setDiastolic(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-center font-bold text-gray-800 focus:outline-emerald-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-gray-600 mb-1 text-center">ชีพจร (Heart Rate)</label>
                <input
                  type="number"
                  value={heartRate}
                  onChange={e => setHeartRate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2 py-2 text-center font-bold text-gray-800 focus:outline-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-600 mb-1 text-center">น้ำตาล (Blood Sugar)</label>
                <input
                  type="number"
                  value={bloodSugar}
                  onChange={e => setBloodSugar(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2 py-2 text-center font-bold text-gray-800 focus:outline-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-600 mb-1 text-center">น้ำหนัก (Weight kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={e => setWeight(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2 py-2 text-center font-bold text-gray-800 focus:outline-emerald-500"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl text-sm"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl text-sm shadow-sm"
              >
                บันทึกสำเร็จ
              </button>
            </div>
          </form>
        )}

        {/* History Log list */}
        <div className="space-y-2">
          <h3 className="font-bold text-gray-800 text-base">ประวัติการบันทึกล่าสุด</h3>
          <div className="space-y-2">
            {[...records].reverse().map(rec => (
              <div key={rec.id} className="bg-white p-3 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${
                    rec.status === 'danger' ? 'bg-red-50 text-red-500' : rec.status === 'warning' ? 'bg-orange-50 text-orange-400' : 'bg-emerald-50 text-emerald-500'
                  }`}>
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-800">
                      ความดัน {rec.systolic}/{rec.diastolic} mmHg
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5">
                      <span className="flex items-center gap-0.5"><Calendar className="w-2.5 h-2.5" />{rec.date}</span>
                      <span className="flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />{rec.time}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs text-gray-500">ชีพจร: <span className="font-bold text-gray-800">{rec.heartRate}</span></p>
                  {rec.bloodSugar && <p className="text-[10px] text-gray-400">น้ำตาล: <span className="font-semibold text-gray-600">{rec.bloodSugar}</span></p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

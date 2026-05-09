import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Gavel, 
  User, 
  Bell, 
  Plus,
  ChevronRight,
  Search,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SpotlightCard } from '@/src/components/SpotlightCard';

interface Hearing {
  id: string;
  date: string;
  room: string;
  judge: string;
  caseNumber: string;
  status: string;
  type: string;
}

export default function HearingTracker() {
  const navigate = useNavigate();
  const [hearings, setHearings] = useState<Hearing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cnrInput, setCnrInput] = useState('');
  const [isCheckingCnr, setIsCheckingCnr] = useState(false);

  const handleCheckStatus = async (overrideCnr?: string) => {
    const targetCnr = overrideCnr || cnrInput;
    if (!targetCnr.trim() || targetCnr.length < 10) {
      alert("Please enter a valid CNR number (minimum 10 characters).");
      return;
    }
    setIsCheckingCnr(true);
    try {
      const res = await fetch(`/api/ecourts/status/${targetCnr}`);
      if (!res.ok) throw new Error("Failed to fetch from eCourts");
      const data = await res.json();
      
      const newHearing: Hearing = {
        id: data.id,
        date: data.date,
        room: data.room,
        judge: data.judge,
        caseNumber: data.caseNumber,
        status: data.status,
        type: data.type
      };
      
      setHearings(prev => [newHearing, ...prev]);
      if (!overrideCnr) setCnrInput('');
      alert(`eCourts Sync Complete: Case ${data.caseNumber} is scheduled for ${data.date}.`);
    } catch (err) {
      console.error(err);
      alert("Failed to pull status from eCourts. Please try again later.");
    } finally {
      setIsCheckingCnr(false);
    }
  };

  useEffect(() => {
    fetch('/api/hearings')
      .then(res => res.json())
      .then(data => {
        // Map backend hearing to the frontend Hearing interface
        const mapped = data.map((h: any) => ({
          id: h.id || Math.random().toString(),
          date: h.date || h.next_hearing_date || 'TBD',
          room: h.room || h.room_number || 'TBD',
          judge: h.judge || 'Hon. Judge',
          caseNumber: h.caseNumber || h.cnr || h.cnr_number || 'N/A',
          status: 'upcoming',
          type: h.purpose || 'Legal Proceeding'
        }));
        setHearings(mapped);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b border-white/5 pb-10">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-3">Judicial Calendaring</div>
          <h1 className="text-4xl font-semibold mb-3 text-white uppercase tracking-tight">Hearing Tracker</h1>
          <p className="text-slate-500 max-w-2xl text-sm italic">
            Consolidated timeline of upcoming proceedings. SMS inquiries can be made to **9766899899**.
          </p>
        </div>
        <div className="flex gap-4">
          <Button 
            variant="outline"
            className="border-white/10 hover:bg-white/5 text-slate-300 rounded-lg h-12 px-6 font-bold uppercase tracking-widest text-[10px]"
            onClick={() => {
              const cnr = prompt("Enter CNR Number for Status Inquiry:");
              if (cnr) handleCheckStatus(cnr);
            }}
          >
            <Search className="w-4 h-4 mr-2" />
            CNR Inquiry
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-12 px-8 font-extrabold uppercase tracking-widest text-[11px] shadow-lg shadow-blue-600/10"
            onClick={() => window.open('https://ecourts.gov.in/ecourts_home/', '_blank')}
          >
            <Gavel className="w-4 h-4 mr-2" />
            e-Courts Portal
          </Button>
        </div>
      </div>

      {/* SMS & CNR Search Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <SpotlightCard className="p-6 bg-blue-600/5 border-blue-500/20 flex items-center gap-6">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
             <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-blue-400 mb-1">eCourts SMS Inquiry</h3>
            <p className="text-sm text-slate-300 font-bold">SMS <span className="text-white">ECOURTS &lt;CNR Number&gt;</span> to <span className="text-white">9766899899</span></p>
          </div>
        </SpotlightCard>

        <SpotlightCard className="p-6 bg-slate-900/40 border-white/5 flex items-center gap-4">
          <Input 
            placeholder="Enter 16-character CNR Number..." 
            className="bg-black/20 border-white/10 h-12 text-xs font-mono tracking-tighter"
            value={cnrInput}
            onChange={(e) => setCnrInput(e.target.value)}
            onKeyDown={(e) => { if(e.key === 'Enter') handleCheckStatus(); }}
          />
          <Button 
            className="h-12 bg-white text-slate-950 font-black text-[9px] uppercase tracking-widest px-6 hover:bg-slate-200 disabled:opacity-50"
            onClick={() => handleCheckStatus()}
            disabled={isCheckingCnr}
          >
            {isCheckingCnr ? 'Pulling...' : 'Check Status'}
          </Button>
        </SpotlightCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Timeline View */}
        <div className="lg:col-span-8 space-y-8">
           <div className="flex items-center justify-between mb-2">
             <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Active Proceedings</h2>
             <div className="flex items-center gap-2 text-[10px] font-mono text-slate-700 uppercase tracking-widest">
               <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
               Live Sync Active
             </div>
           </div>

           <div className="space-y-4">
              {hearings.map((hearing, idx) => (
                <motion.div 
                  key={hearing.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group"
                >
                  <SpotlightCard className="p-6 bg-slate-950/40 hover:border-blue-500/20 transition-all">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-start gap-6">
                        <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-blue-400 group-hover:bg-blue-400/10 transition-colors shrink-0">
                          <Gavel className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-[10px] font-mono text-blue-500 font-black tracking-widest uppercase">{hearing.date}</span>
                            <div className="h-1 w-1 rounded-full bg-slate-800" />
                            <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">{hearing.caseNumber}</span>
                          </div>
                          <h3 className="text-xl font-bold text-white uppercase tracking-tight mb-3 transition-colors group-hover:text-blue-400">{hearing.type}</h3>
                          <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 text-[11px] text-slate-500 font-medium">
                            <div className="flex items-center gap-2.5">
                              <MapPin className="w-3.5 h-3.5 text-slate-700" />
                              {hearing.room}
                            </div>
                            <div className="flex items-center gap-2.5">
                              <User className="w-3.5 h-3.5 text-slate-700" />
                              {hearing.judge}
                            </div>
                            <div className="flex items-center gap-2.5">
                              <Clock className="w-3.5 h-3.5 text-slate-700" />
                              Session Commencing 10:30
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-4 pl-12 md:pl-0 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-8">
                         <span className="px-3 py-1 rounded bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.15em]">
                            {hearing.status}
                         </span>
                         <Button variant="ghost" size="sm" className="h-8 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-white group-hover:border-white/10 border border-transparent">
                            Details
                         </Button>
                      </div>
                    </div>
                  </SpotlightCard>
                </motion.div>
              ))}
           </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="lg:col-span-4 space-y-10">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6 px-1 flex items-center justify-between">
              Critical Alerts
              <Bell className="w-3.5 h-3.5 text-blue-400" />
            </h3>
            <div className="space-y-4">
              <NotificationItem 
                title="Immediate Adjournment" 
                desc="Case BA/1042/2026 has been re-listed for tomorrow due to administrative recess." 
                time="15m ago"
              />
              <NotificationItem 
                title="Document Status" 
                desc="Bail Application Draft #4 is ready for signature." 
                time="5h ago"
              />
            </div>
          </div>

          <SpotlightCard className="bg-blue-600/5 border-blue-500/20 p-8">
            <h3 className="font-bold text-lg text-white uppercase tracking-tight mb-4">Pro-Bono Network</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-8 italic">
              Connect with DLSA recognized counselors within your current prison jurisdiction for primary assistance.
            </p>
            <Button 
              className="w-full bg-white text-slate-950 hover:bg-slate-200 font-black text-[10px] uppercase tracking-widest h-12 shadow-lg"
              onClick={() => navigate('/legal-aid')}
            >
              Authorized Directory
            </Button>
          </SpotlightCard>
        </div>
      </div>
    </div>
  );
}

function NotificationItem({ title, desc, time }: { title: string, desc: string, time: string }) {
  return (
    <div className="flex gap-3 text-sm group cursor-pointer">
      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
      <div>
        <div className="font-medium text-slate-200">{title}</div>
        <div className="text-xs text-slate-500 line-clamp-2 mt-0.5">{desc}</div>
        <div className="text-[10px] text-slate-600 mt-1 font-mono uppercase">{time}</div>
      </div>
    </div>
  );
}

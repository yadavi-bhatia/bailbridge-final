import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  History, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Calendar,
  ChevronRight,
  ArrowUpRight,
  FileText,
  Shield,
  Activity,
  MessageSquare,
  Scale,
  Zap,
  ShieldAlert,
  Search,
  Bell,
  Globe,
  MoreVertical,
  Plus,
  Play,
  Copy,
  Upload,
  QrCode,
  MapPin,
  Lock,
  ExternalLink,
  Files,
  ShieldCheck
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SpotlightCard } from '@/src/components/SpotlightCard';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Dashboard() {
  const navigate = useNavigate();
  const [cases, setCases] = useState<any[]>([]);
  const [reminders, setReminders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/cases').then(res => res.json()),
      fetch('/api/reminders').then(res => res.json())
    ])
      .then(([casesData, remindersData]) => {
        setCases(casesData);
        setReminders(remindersData);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const latestCase = cases.length > 0 ? cases[cases.length - 1] : null;

  // Check for extracted FIR data
  const storedFIR = localStorage.getItem('bailbridge_extracted_fir');
  const extractedDetails = storedFIR ? JSON.parse(storedFIR) : null;

  return (
    <div className="min-h-screen bg-[#0a0c12] text-slate-200 selection:bg-blue-500/30 -mt-20 pt-20">
      {/* Top Header Filter/Search Mockup */}
      <div className="border-b border-white/5 bg-[#0d0f17]/80 backdrop-blur-md px-8 py-4 sticky top-20 z-40">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                placeholder="Search cases, hearings, documents..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl h-11 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-600 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">⌘ K</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-slate-400 cursor-pointer hover:text-white transition-colors">
              <Globe className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">English</span>
            </div>
            <div className="relative cursor-pointer hover:scale-110 transition-transform">
              <Bell className="w-5 h-5 text-slate-400" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white border-2 border-[#0d0f17]">3</span>
            </div>
            <div className="flex items-center gap-3 border-l border-white/10 pl-6 cursor-pointer group">
               <div className="text-right">
                  <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">Sunita Devi</p>
                  <p className="text-[10px] text-slate-500 font-medium italic">Family Member</p>
               </div>
               <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/40 overflow-hidden flex items-center justify-center">
                  <Activity className="w-5 h-5 text-blue-400" />
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto p-8 space-y-8">
        {/* Top 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Case Status */}
          <SpotlightCard className="p-6 bg-[#11131c] border-white/5" spotlightColor="rgba(59, 130, 246, 0.1)">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                 </div>
                 <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Case Status</h4>
              </div>
              <MoreVertical className="w-4 h-4 text-slate-600" />
            </div>
            <div className="mb-4">
               <h3 className="text-2xl font-black text-white tracking-tight uppercase leading-none">Undertrial</h3>
               <p className="text-xs text-slate-500 font-mono mt-2 tracking-tight">Case No. {latestCase?.case_id || '2412/2024'}</p>
            </div>
            <Badge className="bg-emerald-500/10 text-emerald-400 border-none px-4 py-1.5 rounded-full text-[10px] font-black uppercase">Active</Badge>
          </SpotlightCard>

          {/* Card 2: Bailable Offence */}
          <SpotlightCard className="p-6 bg-[#11131c] border-white/5" spotlightColor="rgba(168, 85, 247, 0.1)">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                    <Scale className="w-4 h-4" />
                 </div>
                 <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Bailable Offence</h4>
              </div>
              <MoreVertical className="w-4 h-4 text-slate-600" />
            </div>
            <div className="mb-4">
               <h3 className="text-2xl font-black text-white tracking-tight uppercase leading-none">Yes</h3>
               <p className="text-xs text-slate-500 font-mono mt-2 tracking-tight">Section {latestCase?.classification?.bns_code || '498A IPC'}</p>
            </div>
            <Badge className="bg-purple-500/10 text-purple-400 border-none px-4 py-1.5 rounded-full text-[10px] font-black uppercase">Bailable</Badge>
          </SpotlightCard>

          {/* Card 3: Next Hearing */}
          <SpotlightCard 
            className="p-6 bg-[#11131c] border-white/5 cursor-pointer hover:bg-slate-800/60 transition-all" 
            spotlightColor="rgba(244, 63, 94, 0.1)"
            onClick={() => navigate('/hearings')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
                    <Calendar className="w-4 h-4" />
                 </div>
                 <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Next Hearing</h4>
              </div>
              <MoreVertical className="w-4 h-4 text-slate-600" />
            </div>
            <div className="mb-2">
               <h3 className="text-2xl font-black text-white tracking-tight uppercase leading-none">28 May 2026</h3>
               <p className="text-xs text-slate-500 font-mono mt-2 italic font-bold">Wed • 11:00 AM</p>
            </div>
            <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest pt-2 border-t border-white/5 mt-2">Judicial Magistrate First Class • Room No. 3</div>
          </SpotlightCard>

          {/* Card 4: Legal Aid Readiness */}
          <SpotlightCard 
            className="p-6 bg-[#11131c] border-white/5 cursor-pointer hover:bg-slate-800/60 transition-all" 
            spotlightColor="rgba(234, 179, 8, 0.1)"
            onClick={() => navigate('/legal-aid')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                    <Shield className="w-4 h-4" />
                 </div>
                 <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Legal Aid Readiness</h4>
              </div>
              <MoreVertical className="w-4 h-4 text-slate-600" />
            </div>
            <div className="mb-4">
               <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-black text-white tracking-tight uppercase leading-none">80%</h3>
                  <span className="text-xs text-slate-500 font-black uppercase tracking-tighter">Ready</span>
               </div>
               <p className="text-[10px] text-slate-500 mt-2 uppercase font-black italic tracking-wide opacity-50">Almost there!</p>
            </div>
            <div className="space-y-2">
               <Progress value={80} className="h-1.5 bg-slate-900/60" indicatorClassName="bg-amber-500" />
               <div className="flex justify-end uppercase text-[8px] font-black tracking-[0.2em] text-slate-600">4/5 Completed</div>
            </div>
          </SpotlightCard>
        </div>

        {/* Second Row Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           {/* Intake Summary Card */}
           <SpotlightCard className="lg:col-span-5 p-8 bg-[#11131c]/60 border-white/5">
              <div className="flex items-center gap-3 mb-10">
                 <div className="w-5 h-5 rounded bg-blue-500/10 flex items-center justify-center">
                    <FileText className="w-3.5 h-3.5 text-blue-400" />
                 </div>
                 <h2 className="text-md font-black text-white uppercase tracking-tight">Intake Summary</h2>
              </div>
              
              <div className="space-y-10">
                 <div>
                    <h5 className="text-[9px] font-black uppercase text-slate-600 tracking-[0.3em] mb-4">Incident Description</h5>
                    <p className="text-sm text-slate-400 leading-relaxed italic font-medium">
                       {latestCase?.description || "My brother was arrested on 12 May 2025 in connection with a family dispute. Police claimed harassment under Sec 498A. We need help with bail."}
                    </p>
                 </div>

                 <div className="grid grid-cols-2 gap-y-10 gap-x-12">
                    <SummaryItem icon={CheckCircle2} label="Offence" value={latestCase?.classification?.offence_name || "498A IPC"} color="cyan" />
                    <SummaryItem icon={Calendar} label="FIR Date" value="12 May 2025" color="blue" />
                    <SummaryItem icon={MapPin} label="Police Station" value="Tilak Nagar PS, Delhi" color="teal" />
                    <SummaryItem icon={Plus} label="Arrest Date" value="12 May 2025" color="sky" />
                 </div>

                 <Button 
                    variant="ghost" 
                    className="w-full border border-white/5 bg-white/[0.01] hover:bg-white/[0.05] text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 py-7 transition-all"
                    onClick={() => navigate('/intake')}
                  >
                    View Full Intake <ChevronRight className="w-3.5 h-3.5 ml-2 text-blue-600" />
                 </Button>
              </div>
           </SpotlightCard>

           {/* Know Your Rights Card */}
           <SpotlightCard className="lg:col-span-3 p-8 border-emerald-500/10 bg-emerald-500/[0.01]">
              <div className="flex items-center gap-3 mb-10">
                 <div className="w-5 h-5 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <Shield className="w-3.5 h-3.5" />
                 </div>
                 <h2 className="text-md font-black text-white uppercase tracking-tight">Know Your Rights</h2>
              </div>

              <div className="space-y-5 mb-10">
                 <RightItem text="You have the right to legal aid." />
                 <RightItem text="You have the right to bail in bailable offences." />
                 <RightItem text="You have the right to meet your lawyer." />
                 <RightItem text="You have the right against self-incrimination." />
                 <Button variant="link" className="text-[10px] font-black text-emerald-400/80 hover:text-emerald-400 uppercase p-0 h-auto tracking-widest mt-2 transition-colors">
                   View All Rights <ExternalLink className="w-3 h-3 ml-2" />
                 </Button>
              </div>

              <div className="space-y-6 pt-8 border-t border-white/5">
                 <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-rose-400 animate-pulse" />
                    <h5 className="text-[9px] font-black uppercase text-rose-400 tracking-[0.2em]">Urgent Actions</h5>
                 </div>
                 <div className="space-y-3">
                    <p className="text-[11px] text-slate-400 flex items-center gap-3 font-medium">
                       <span className="w-2 h-2 rounded-full border-2 border-rose-500/50 bg-rose-500 animate-pulse" /> Next hearing in 7 days
                    </p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-3 font-medium">
                       <span className="w-2 h-2 rounded-full border-2 border-rose-500/50 bg-rose-500 animate-pulse" /> Upload remaining documents
                    </p>
                 </div>
                 <Button className="w-full bg-rose-600/90 hover:bg-rose-600 text-white font-black text-[10px] uppercase tracking-[0.2em] py-7 shadow-lg shadow-rose-900/20">
                    Take Action Now <Zap className="w-3.5 h-3.5 ml-2" />
                 </Button>
              </div>
           </SpotlightCard>

           {/* Document Checklist Card */}
           <SpotlightCard className="lg:col-span-4 p-8 bg-[#11131c]">
              <div className="flex items-center gap-3 mb-10">
                 <div className="w-5 h-5 rounded bg-blue-500/10 flex items-center justify-center">
                    <Files className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                 <h2 className="text-md font-black text-white uppercase tracking-tight">Document Checklist</h2>
              </div>

              <div className="space-y-6 mb-10">
                 <ChecklistItem label="FIR Copy" status="Uploaded" />
                 <ChecklistItem label="Arrest Memo" status="Uploaded" />
                 <ChecklistItem label="ID Proof" status="Uploaded" />
                 <ChecklistItem label="Address Proof" status="Pending" />
                 <ChecklistItem label="Affidavit (Optional)" status="Not Uploaded" />
              </div>

              <Button 
                variant="outline" 
                className="w-full border-2 border-dashed border-white/10 hover:border-blue-500/30 bg-white/[0.01] hover:bg-white/[0.05] text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 py-10 transition-all"
                onClick={() => navigate('/documents')}
              >
                <Upload className="w-4 h-4 mr-2 text-blue-400" /> Upload Documents
              </Button>
           </SpotlightCard>
        </div>

        {/* Third Row Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           {/* Hearing Tracker Timeline */}
           <SpotlightCard 
            className="p-8 cursor-pointer hover:bg-white/[0.02] transition-all bg-[#0e1017] group"
            onClick={() => navigate('/hearings')}
           >
              <div className="flex items-center justify-between mb-10 pb-4 border-b border-white/5">
                 <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    <h2 className="text-md font-black text-white uppercase tracking-tight">Hearing Tracker</h2>
                 </div>
                 <Button variant="ghost" size="sm" className="text-[9px] font-black uppercase text-slate-600 hover:text-blue-400">View All</Button>
              </div>

              <div className="relative pl-14 space-y-12 before:absolute before:left-[1.625rem] before:top-2 before:bottom-2 before:w-0.5 before:bg-white/5">
                 <TimelineItem date="12 May 2025" event="First Production" status="Completed" current />
                 <TimelineItem date="21 May 2025" event="Bail Plea Hearing" status="Completed" />
                 <TimelineItem date="28 May 2025" event="Next Hearing" status="Upcoming" />
                 <TimelineItem date="11 June 2025" event="Arguments" status="Tentative" />
              </div>
           </SpotlightCard>

           {/* Family Script Card */}
           <SpotlightCard 
            className="p-8 bg-[#0e1017] cursor-pointer hover:bg-slate-800/40 transition-all group"
            onClick={() => navigate('/scripts')}
           >
              <div className="flex items-center justify-between mb-10">
                 <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-blue-400" />
                    <h2 className="text-md font-black text-white uppercase tracking-tight">Family Script (Multilingual)</h2>
                 </div>
                 <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-blue-400 transition-colors" />
              </div>

              <div className="flex gap-2 mb-8 flex-wrap">
                 {['English', 'हिंदी', 'தமிழ்', 'తెలుగు', 'اردو'].map(lang => (
                    <button key={lang} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all tracking-widest ${lang === 'English' ? 'bg-blue-600/90 text-white shadow-lg shadow-blue-900/20' : 'bg-white/5 text-slate-600 hover:bg-white/10 hover:text-slate-300'}`}>
                      {lang}
                    </button>
                 ))}
              </div>

              <div className="p-8 bg-[#0a0c12]/60 border border-white/5 rounded-2xl mb-10 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-10">
                    <MessageSquare className="w-12 h-12 text-blue-400" />
                 </div>
                 <p className="text-sm text-slate-400 leading-relaxed font-medium italic relative z-10">
                    "My name is Sunita Devi. I am the mother of the accused. We are a law-abiding family. This is a false case. He is not a threat to anyone and will attend all hearings. We request bail."
                 </p>
              </div>

              <div className="flex gap-4">
                 <Button variant="outline" className="flex-1 bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20 text-blue-400 text-[9px] font-black uppercase tracking-[0.2em] h-14 transition-all" onClick={(e) => { e.stopPropagation(); navigate('/scripts'); }}>
                   <Play className="w-4 h-4 mr-2" /> Play Audio
                 </Button>
                 <Button variant="outline" className="flex-1 border-white/10 hover:border-white/20 bg-white/[0.01] hover:bg-white/[0.05] text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] h-14 transition-all" onClick={(e) => { e.stopPropagation(); navigate('/scripts'); }}>
                   <Copy className="w-4 h-4 mr-2" /> Use This Script
                 </Button>
              </div>
           </SpotlightCard>

           {/* Evidence Vault Card */}
           <SpotlightCard 
            className="p-8 cursor-pointer hover:bg-white/[0.02] transition-all bg-[#0e1017]"
            onClick={() => navigate('/evidence')}
           >
              <div className="flex items-center justify-between mb-10">
                 <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <h2 className="text-md font-black text-white uppercase tracking-tight">Evidence Vault</h2>
                 </div>
                 <Badge className="bg-emerald-500/10 text-emerald-400 border-none px-3 py-1 text-[8px] font-black uppercase tracking-widest">Secure • Encrypted</Badge>
              </div>

              <div className="border-2 border-dashed border-white/10 rounded-2xl p-10 mb-10 text-center bg-[#0a0c12]/40 hover:border-blue-500/30 hover:bg-blue-500/[0.02] transition-all group">
                 <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-5 text-blue-400 group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6" />
                 </div>
                 <p className="text-[11px] font-black text-slate-200 uppercase tracking-[0.2em] mb-2">Drag & drop files here</p>
                 <p className="text-[9px] text-slate-600 uppercase font-bold">or click to upload</p>
                 <p className="text-[8px] text-slate-700 mt-6 font-mono font-black border-t border-white/5 pt-4 uppercase leading-relaxed">End-to-end encrypted storage</p>
              </div>

              <div className="space-y-5">
                 <h5 className="text-[9px] font-black uppercase text-slate-600 tracking-[0.3em]">Latest Upload</h5>
                 <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between group-hover:border-emerald-500/20 transition-all">
                    <div className="flex items-center gap-4 overflow-hidden">
                       <FileText className="w-6 h-6 text-rose-500 shrink-0" />
                       <div className="overflow-hidden">
                          <p className="text-[11px] font-black text-slate-200 truncate pr-4 uppercase tracking-tighter">FIR_Copy_2412_2024.pdf</p>
                          <p className="text-[9px] text-slate-600 font-mono font-bold mt-1">12 May 2025 • 2.4 MB</p>
                       </div>
                    </div>
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    </div>
                 </div>
                 <Button 
                    variant="ghost" 
                    className="w-full text-[9px] font-black uppercase text-slate-700 tracking-[0.3em] py-5 border border-white/[0.03] hover:text-blue-400 transition-all"
                    onClick={(e) => { e.stopPropagation(); navigate('/evidence'); }}
                  >
                   View All Evidence
                 </Button>
              </div>
           </SpotlightCard>

           {/* QR Handoff Card */}
           <SpotlightCard className="p-8 bg-[#0e1017]">
              <div className="flex items-center gap-3 mb-10">
                 <QrCode className="w-5 h-5 text-blue-400" />
                 <h2 className="text-md font-black text-white uppercase tracking-tight">QR Handoff</h2>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed font-medium mb-10">
                 Share this code with your lawyer or legal volunteer to provide fast context.
              </p>

              <div className="bg-white p-6 rounded-3xl mx-auto w-fit mb-10 shadow-[0_0_80px_rgba(59,130,246,0.15)] relative group cursor-pointer">
                 <div className="absolute inset-0 bg-blue-600/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                 <div className="w-44 h-44 bg-white flex items-center justify-center overflow-hidden relative z-10">
                    {/* Mock QR Code */}
                    <div className="w-full h-full border-[10px] border-black relative">
                       <div className="absolute top-2 left-2 w-10 h-10 border-[6px] border-black" />
                       <div className="absolute top-2 right-2 w-10 h-10 border-[6px] border-black" />
                       <div className="absolute bottom-2 left-2 w-10 h-10 border-[6px] border-black" />
                       <div className="grid grid-cols-6 grid-rows-6 gap-1 p-3 h-full w-full opacity-90 mt-2">
                          {[...Array(36)].map((_, i) => (
                            <div key={i} className={`bg-black ${Math.random() > 0.45 ? 'opacity-100' : 'opacity-[0.05]'}`} />
                          ))}
                       </div>
                    </div>
                 </div>
              </div>

              <div className="text-center space-y-8">
                 <div className="space-y-3">
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Case No. 2412/2024</p>
                    <Button variant="outline" className="w-full border-white/10 hover:border-blue-500/30 bg-white/[0.01] hover:bg-blue-500/[0.05] text-slate-500 hover:text-blue-400 text-[9px] font-black uppercase tracking-[0.2em] h-12 transition-all">
                       <Upload className="w-3.5 h-3.5 mr-2 rotate-180" /> Download QR
                    </Button>
                 </div>
                 <div className="flex flex-col gap-2">
                    <p className="text-[9px] text-slate-700 font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                       <Clock className="w-3.5 h-3.5" /> Code valid for 7 days
                    </p>
                    <div className="h-1 w-24 bg-white/5 rounded-full mx-auto" />
                 </div>
              </div>
           </SpotlightCard>
        </div>

        {/* Footer Disclaimer */}
        <div className="pt-20 pb-10 text-center border-t border-white/5">
           <div className="flex items-center justify-center gap-6 mb-4">
              <ShieldAlert className="w-4 h-4 text-slate-700" />
              <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.3em]">
                BailBridge is not a law firm. We connect families with legal resources.
              </p>
              <ShieldAlert className="w-4 h-4 text-slate-700" />
           </div>
           <div className="flex items-center justify-center gap-3">
              <span className="h-px w-20 bg-white/5" />
              <p className="text-[9px] text-slate-700 font-black uppercase tracking-[0.4em]">
                 Made with <span className="text-rose-600 animate-pulse">❤️</span> for families across Bharat
              </p>
              <span className="h-px w-20 bg-white/5" />
           </div>
        </div>
      </div>
    </div>
  );
}

function SummaryItem({ icon: Icon, label, value, color }: { icon: any, label: string, value: string, color: string }) {
  const colors: Record<string, string> = {
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    teal: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
    sky: 'bg-sky-500/10 text-sky-400 border-sky-500/20'
  };

  return (
    <div className="flex items-center gap-5 group">
       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-500 group-hover:rounded-xl group-hover:scale-110 ${colors[color]}`}>
          <Icon className="w-6 h-6" />
       </div>
       <div className="overflow-hidden">
          <p className="text-[9px] font-black uppercase text-slate-700 tracking-[0.3em] mb-1.5 group-hover:text-slate-500 transition-colors">{label}</p>
          <p className="text-sm font-black text-slate-200 truncate uppercase tracking-tighter group-hover:text-white transition-colors">{value}</p>
       </div>
    </div>
  );
}

function RightItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-4 group cursor-pointer">
       <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition-all">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
       </div>
       <p className="text-sm text-slate-500 group-hover:text-slate-300 font-medium transition-all">{text}</p>
    </div>
  );
}

function ChecklistItem({ label, status }: { label: string, status: string }) {
  const isOk = status === 'Uploaded';
  const isPending = status === 'Pending';
  
  return (
    <div className="flex items-center justify-between group cursor-pointer hover:translate-x-1 transition-transform">
       <div className="flex items-center gap-4">
          <div className={`w-2.5 h-2.5 rounded-full border-2 ${isOk ? 'bg-emerald-500 border-emerald-500/30' : isPending ? 'bg-amber-500 border-amber-500/30' : 'bg-slate-800 border-white/5'}`} />
          <span className="text-[13px] font-bold text-slate-400 group-hover:text-white transition-colors tracking-tight">{label}</span>
       </div>
       <div className="flex items-center gap-3">
          <span className={`text-[10px] font-black uppercase tracking-widest ${isOk ? 'text-emerald-500/80' : isPending ? 'text-amber-500/80' : 'text-slate-700'}`}>
             {status}
          </span>
          {isOk && <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shadow-lg shadow-emerald-900/10"><CheckCircle2 className="w-3 h-3 text-emerald-500" /></div>}
          {isPending && <div className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center"><Clock className="w-3 h-3 text-amber-500" /></div>}
          {!isOk && !isPending && <div className="w-5 h-5 rounded-full border border-slate-800" />}
       </div>
    </div>
  );
}

function TimelineItem({ date, event, status, current }: { date: string, event: string, status: string, current?: boolean }) {
  const isCompleted = status === 'Completed';
  const isUpcoming = status === 'Upcoming';
  
  return (
    <div className="relative group">
       <div className={`absolute -left-[3.125rem] top-1.5 w-5 h-5 rounded-full border-4 z-10 transition-all duration-500 ${
         isCompleted ? 'bg-emerald-500 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 
         isUpcoming ? 'bg-blue-600 border-blue-600/30 shadow-[0_0_15px_rgba(37,99,235,0.3)] animate-pulse' : 
         'bg-[#0a0c12] border-slate-800 group-hover:border-slate-700'
       }`} />
       
       <div className="transition-all duration-300 group-hover:translate-x-2">
          <span className="text-[10px] font-mono font-black text-slate-600 uppercase italic mb-1.5 block group-hover:text-slate-500 tracking-tighter">{date}</span>
          <div className="flex items-center gap-4">
             <h4 className={`text-[13px] font-black uppercase tracking-tight transition-colors ${current ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>{event}</h4>
             <Badge className={`px-2.5 py-0.5 text-[8px] font-black rounded-lg border-none pointer-events-none tracking-widest ${
               isCompleted ? 'bg-emerald-500/10 text-emerald-400' : 
               isUpcoming ? 'bg-blue-500/10 text-blue-400' : 
               'bg-white/5 text-slate-700'
             }`}>
               {status}
             </Badge>
          </div>
       </div>
    </div>
  );
}

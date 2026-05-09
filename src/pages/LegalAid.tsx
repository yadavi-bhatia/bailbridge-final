import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Gavel, ArrowRight, Plus, ArrowUpRight, ExternalLink, ChevronRight, Info, MapPin, Phone, Mail, Clock, CheckCircle2, FileText, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { SpotlightCard } from '@/src/components/SpotlightCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import MapsLocator from '@/src/components/MapsLocator';

export default function LegalAid() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [firData, setFirData] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('bailbridge_extracted_fir');
    if (stored) {
      setFirData(JSON.parse(stored));
    }
  }, []);

  const steps = [
    { id: 1, title: 'Identity', description: 'Applicant details' },
    { id: 2, title: 'Details', description: 'Offence summary' },
    { id: 3, title: 'Support', description: 'Nearest DLSA' },
    { id: 4, title: 'Finalize', description: 'Review & Submit' }
  ];

  return (
    <div className="min-h-screen bg-[#0a0c12] text-slate-200 selection:bg-teal-500/30 -mt-20 pt-28">
      <div className="max-w-[1440px] mx-auto px-8 pb-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b border-white/5 pb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
               <div className="w-6 h-6 rounded bg-teal-500/10 flex items-center justify-center text-teal-400">
                  <Shield className="w-3.5 h-3.5" />
               </div>
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-teal-400">Article 39A • Free Legal Aid</span>
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight uppercase leading-none mb-4">Legal Aid Draft</h1>
            <p className="text-slate-500 max-w-2xl text-sm italic leading-relaxed font-medium">
              Drafting NALSA Form 1 for state-sponsored legal assistance. This application will be routed to the District Legal Services Authority (DLSA).
            </p>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="text-right mr-4 hidden md:block">
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Application Readiness</p>
                <p className="text-xs font-bold text-teal-400">Step {step} of 4</p>
             </div>
             <Progress value={(step / 4) * 100} className="w-32 h-1.5 bg-white/5" indicatorClassName="bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.5)]" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Application Area */}
          <div className="lg:col-span-8 space-y-8">
            {/* Applicant Details Card */}
            <SpotlightCard className="p-10 bg-[#11131c] border-white/5 relative overflow-hidden" spotlightColor="rgba(20, 184, 166, 0.05)">
               <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 border border-teal-500/20">
                       <User className="w-5 h-5" />
                    </div>
                    <div>
                       <h2 className="text-lg font-black text-white uppercase tracking-tight">Applicant Identification</h2>
                       <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">NALSA Form 1 • Section A</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-[9px] font-black uppercase text-slate-600 hover:text-teal-400">Edit Details</Button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12">
                  <InfoField label="Full Name" value="Sunita Devi" />
                  <InfoField label="Identity Reference" value="XXXX-XXXX-8821" subValue="Aadhar Masked for Privacy" />
                  <InfoField label="Relationship" value="Mother of Accused" />
                  <InfoField label="Annual Income" value="₹1,24,000" subValue="Eligible for Free Aid (< ₹3L)" tag="ELIGIBLE" />
                  <div className="md:col-span-2 p-5 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-4">
                     <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                     <p className="text-xs text-slate-400 leading-relaxed font-medium">
                        Verification depends on physical submission of an income certificate at the e-Seva Kendra.
                     </p>
                  </div>
               </div>
            </SpotlightCard>

            {/* Offence Summary Card */}
            <SpotlightCard className="p-10 bg-[#11131c] border-white/5" spotlightColor="rgba(20, 184, 166, 0.05)">
               <div className="flex items-center gap-4 mb-10">
                 <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400 border border-rose-500/20">
                    <Gavel className="w-5 h-5" />
                 </div>
                 <div>
                    <h2 className="text-lg font-black text-white uppercase tracking-tight">Offence Summary</h2>
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Case Context & Legal Basis</p>
                 </div>
               </div>

               <div className="space-y-10">
                  <div className="grid grid-cols-2 gap-10">
                     <InfoField label="Primary Section" value={firData?.sections_charged || "498A IPC"} color="rose" />
                     <InfoField label="FIR Number" value={firData?.fir_number || "2412/2024"} color="rose" />
                  </div>
                  
                  <div>
                    <h5 className="text-[9px] font-black uppercase text-slate-600 tracking-[0.3em] mb-4">Brief Narrative</h5>
                    <div className="p-6 bg-[#0a0c12]/60 border border-white/10 rounded-2xl">
                       <p className="text-sm text-slate-300 leading-relaxed italic font-medium">
                          {firData?.summary || "Accused was taken into custody during a family dispute investigation. Requesting legal aid for bail application and representation during magistrate appearance."}
                       </p>
                    </div>
                  </div>
               </div>
            </SpotlightCard>

            {/* Interactive Resource Locator */}
            <div className="space-y-6">
               <div className="flex items-center justify-between">
                  <div>
                     <h2 className="text-lg font-black text-white uppercase tracking-tight">Interactive Resource Locator</h2>
                     <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Satellite Intelligence • Find Local Support</p>
                  </div>
                  <Badge variant="outline" className="border-indigo-500/20 text-indigo-400 text-[9px] font-black uppercase px-3 h-6 tracking-widest">Live GMP Feed</Badge>
               </div>
               
               <MapsLocator />
               
               <div className="flex gap-4">
                  <div className="flex-1 p-5 rounded-2xl bg-rose-500/5 border border-rose-500/10 flex items-center gap-4">
                     <Shield className="w-5 h-5 text-rose-500 shrink-0" />
                     <div>
                        <p className="text-[10px] text-rose-500 font-bold uppercase tracking-widest mb-0.5">Physical Safety</p>
                        <p className="text-[11px] text-slate-400 font-medium">Verify your location before visiting police stations to ensure jurisdictional alignment.</p>
                     </div>
                  </div>
                  <div className="flex-1 p-5 rounded-2xl bg-teal-500/5 border border-teal-500/10 flex items-center gap-4">
                     <Gavel className="w-5 h-5 text-teal-500 shrink-0" />
                     <div>
                        <p className="text-[10px] text-teal-500 font-bold uppercase tracking-widest mb-0.5">Free Advocacy</p>
                        <p className="text-[11px] text-slate-400 font-medium">NGOs listed on this map provide representation under Article 39A compliance.</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Navigation CTA */}
            <div className="flex items-center justify-between pt-6">
               <Button variant="ghost" className="text-[11px] font-black uppercase tracking-widest text-slate-600 hover:text-white" onClick={() => navigate('/dashboard')}>
                  Save Draft
               </Button>
               <Button className="bg-teal-600 hover:bg-teal-500 text-white font-black px-10 py-7 text-[12px] uppercase tracking-[0.2em] shadow-lg shadow-teal-900/20 group">
                  Continue to Support {step === 4 ? 'Submission' : 'Details'} <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
               </Button>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-8">
            {/* Nearest DLSA Support Card */}
            <SpotlightCard className="p-8 bg-[#11131c] border-white/5" spotlightColor="rgba(20, 184, 166, 0.1)">
               <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
                  <MapPin className="w-4 h-4 text-teal-400" />
                  <h3 className="text-sm font-black text-white uppercase tracking-tight">Nearest DLSA Office</h3>
               </div>
               
               <div className="space-y-6">
                  <div className="p-4 bg-teal-500/5 border border-teal-500/10 rounded-2xl">
                     <h4 className="text-[13px] font-black text-white uppercase mb-2">District Legal Services Authority</h4>
                     <p className="text-[11px] text-slate-400 leading-relaxed mb-4">City Court Complex, Bengaluru - 560001</p>
                     <div className="flex items-center gap-3 text-[10px] font-bold text-teal-400/80">
                        <Clock className="w-3.5 h-3.5" /> 10:00 AM - 5:00 PM (Mon-Sat)
                     </div>
                  </div>

                  <div className="space-y-3">
                     <ContactItem icon={Phone} label="Helpline" value="+91-80-2222-1234" />
                     <ContactItem icon={Mail} label="Email" value="dlsa-bangalore@karnataka.gov.in" />
                  </div>

                  <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 text-[9px] font-black uppercase tracking-widest py-6">
                     <ArrowUpRight className="w-3.5 h-3.5 mr-2" /> Open In Google Maps
                  </Button>
               </div>
            </SpotlightCard>

            {/* Document Checklist Side-Card */}
            <SpotlightCard className="p-8 border-amber-500/10 bg-amber-500/[0.01]">
               <div className="flex items-center gap-3 mb-8">
                  <FileText className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm font-black text-white uppercase tracking-tight">Required for Submission</h3>
               </div>

               <div className="space-y-4 mb-8">
                  <DocumentRequirement label="Income Certificate" desc="Issued by local Tehsildar" status="required" />
                  <DocumentRequirement label="FIR Copy" desc="Digital copy from CCIS" status="attached" />
                  <DocumentRequirement label="Applicant ID" desc="Aadhar, Ration Card, etc." status="required" />
                  <DocumentRequirement label="Accused ID" desc="Jail identification no." status="optional" />
               </div>

               <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <p className="text-[10px] text-amber-500 font-bold leading-relaxed">
                     Tip: You can get these documents scanned at the e-Seva Kendra near your court.
                  </p>
               </div>
            </SpotlightCard>

            {/* Help/Instruction Card */}
            <div className="p-8 bg-blue-600/10 border border-blue-500/20 rounded-3xl">
               <div className="flex items-center gap-3 mb-4">
                  <Info className="w-4 h-4 text-blue-400" />
                  <h3 className="text-[10px] font-black uppercase text-blue-400 tracking-widest">Procedural Help</h3>
               </div>
               <p className="text-xs text-slate-400 leading-relaxed mb-6 font-medium">
                  Once submitted, the Member Secretary of DLSA will assign a panel lawyer within 24-48 working hours.
               </p>
               <Button variant="link" className="text-[10px] font-black text-blue-400 uppercase p-0 h-auto tracking-widest hover:text-blue-300">
                  Read NALSA Guidelines <ExternalLink className="w-3 h-3 ml-2" />
               </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoField({ label, value, subValue, tag, color = 'teal' }: { label: string, value: string, subValue?: string, tag?: string, color?: string }) {
  const colors: Record<string, string> = {
    teal: 'text-teal-400',
    rose: 'text-rose-400',
    amber: 'text-amber-400'
  };

  return (
    <div className="space-y-1.5 group">
       <div className="flex items-center justify-between">
          <h5 className="text-[9px] font-black uppercase text-slate-700 tracking-[0.3em] group-hover:text-slate-500 transition-colors">{label}</h5>
          {tag && <Badge className="bg-teal-500/10 text-teal-400 border-none text-[8px] font-black px-1.5 h-4 tracking-widest">{tag}</Badge>}
       </div>
       <p className="text-lg font-black text-slate-100 uppercase tracking-tight group-hover:text-white transition-colors">{value}</p>
       {subValue && <p className="text-[10px] text-slate-600 font-medium italic">{subValue}</p>}
    </div>
  );
}

function ContactItem({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex items-center gap-4 group cursor-pointer">
       <div className="w-7 h-7 rounded bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-teal-500/10 transition-all">
          <Icon className="w-3.5 h-3.5 text-slate-500 group-hover:text-teal-400" />
       </div>
       <div className="overflow-hidden">
          <p className="text-[8px] font-black uppercase text-slate-600 tracking-widest mb-0.5">{label}</p>
          <p className="text-[11px] font-bold text-slate-300 group-hover:text-white transition-colors truncate pr-2">{value}</p>
       </div>
    </div>
  );
}

function DocumentRequirement({ label, desc, status }: { label: string, desc: string, status: 'required' | 'attached' | 'optional' }) {
  const isAttached = status === 'attached';
  const isOptional = status === 'optional';

  return (
    <div className="flex items-start justify-between group">
       <div>
          <h6 className={`text-[12px] font-bold transition-colors ${isAttached ? 'text-teal-400' : 'text-slate-200 group-hover:text-white'}`}>{label}</h6>
          <p className="text-[10px] text-slate-600 font-medium">{desc}</p>
       </div>
       {isAttached ? (
          <CheckCircle2 className="w-4 h-4 text-teal-500 mt-1" />
       ) : isOptional ? (
          <div className="text-[9px] font-black text-slate-700 uppercase mt-1">Optional</div>
       ) : (
          <div className="w-4 h-4 rounded-full border-2 border-amber-500/30 mt-1" />
       )}
    </div>
  );
}

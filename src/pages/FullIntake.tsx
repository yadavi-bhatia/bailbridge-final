import { useState, useEffect, useRef, ChangeEvent, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Mic, 
  Globe, 
  Zap, 
  Shield, 
  ArrowRight, 
  Plus, 
  Upload, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  Clock,
  Sparkles,
  Search,
  BookOpen,
  Volume2,
  Activity,
  Gavel,
  Scale,
  X,
  ExternalLink,
  Video
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { SpotlightCard } from '@/src/components/SpotlightCard';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function FullIntake() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('English');
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [bailScore, setBailScore] = useState<number | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modal states
  const [showConstitution, setShowConstitution] = useState(false);
  const [showRights, setShowRights] = useState(false);
  const [connectingVolunteer, setConnectingVolunteer] = useState(false);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      simulateScan();
    }
  };

  const simulateScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    setTimeout(() => {
      setIsScanning(false);
      setBailScore(74); // Mock score from Jatayu Agent logic
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#0a0c12] text-slate-200 selection:bg-blue-500/30 -mt-20 pt-28 pb-20">
      <div className="max-w-[1440px] mx-auto px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b border-white/5 pb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
               <div className="w-6 h-6 rounded bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <Activity className="w-3.5 h-3.5" />
               </div>
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400">Judicial Intake Protocol • v2.4</span>
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight uppercase leading-none mb-4">Full Case Intake</h1>
            <p className="text-slate-500 max-w-2xl text-sm italic leading-relaxed font-medium">
              Comprehensive legal diagnostic using the **Jatayu Situation Classifier**. Provide incident details or upload official documents to generate a preliminary bail eligibility analysis.
            </p>
          </div>
          
          <div className="flex items-center gap-8">
             <div className="text-right">
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Diagnostic Progress</p>
                <div className="flex items-center gap-4">
                   <Progress value={45} className="w-32 h-1.5 bg-white/5" indicatorClassName="bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                   <span className="text-xs font-bold text-blue-400">45%</span>
                </div>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Intake Area */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Top Upload Section */}
            <SpotlightCard className="p-1 w-full bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border-blue-500/20 shadow-2xl shadow-blue-900/10 rounded-[32px]">
               <div className="p-8 bg-[#0d0f17]/90 rounded-[28px] backdrop-blur-xl">
                  <div className="flex items-center justify-between mb-8">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                           <Upload className="w-6 h-6" />
                        </div>
                        <div>
                           <h2 className="text-xl font-bold text-white tracking-tight">AI Document Scanner</h2>
                           <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mt-1">Upload FIR or Case Papers</p>
                        </div>
                     </div>
                     {bailScore && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center gap-6 pr-4"
                        >
                           <div className="text-right">
                              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Bail Score</p>
                              <p className="text-2xl font-black text-emerald-400 leading-none">High Chance</p>
                           </div>
                           <div className="w-16 h-16 rounded-full border-4 border-emerald-500/20 flex items-center justify-center relative">
                              <svg className="absolute inset-0 w-full h-full -rotate-90">
                                 <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" className="text-emerald-500" strokeDasharray="175.9" strokeDashoffset={175.9 * (1 - 0.74)} />
                              </svg>
                              <span className="text-xl font-black text-white">{bailScore}</span>
                           </div>
                        </motion.div>
                     )}
                  </div>

                  <div 
                    className={`border-2 border-dashed rounded-3xl p-10 text-center transition-all cursor-pointer group relative overflow-hidden ${uploadedFile ? 'border-emerald-500/30 bg-emerald-500/[0.02]' : 'border-white/5 bg-[#0a0c12]/40 hover:border-blue-500/30'}`}
                    onClick={() => fileInputRef.current?.click()}
                  >
                     <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                     <AnimatePresence mode="wait">
                        {isScanning ? (
                           <motion.div 
                             key="scanning"
                             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                             className="space-y-6 py-4"
                           >
                              <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 mx-auto animate-pulse">
                                 <Sparkles className="w-8 h-8" />
                              </div>
                              <div className="max-w-md mx-auto space-y-3">
                                 <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest">
                                    <span className="text-blue-400">Scanning Legal Terminology</span>
                                    <span className="text-slate-500">{scanProgress}%</span>
                                 </div>
                                 <Progress value={scanProgress} className="h-1.5 bg-white/5" indicatorClassName="bg-blue-500" />
                              </div>
                           </motion.div>
                        ) : uploadedFile ? (
                           <motion.div 
                             key="uploaded"
                             initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                             className="space-y-4"
                           >
                              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mx-auto border border-emerald-500/20">
                                 <CheckCircle2 className="w-7 h-7" />
                              </div>
                              <div>
                                 <p className="text-sm font-bold text-white mb-1 uppercase tracking-tight">{uploadedFile.name}</p>
                                 <p className="text-[10px] text-emerald-500 uppercase font-black tracking-widest">Scanning Complete • { (uploadedFile.size / (1024 * 1024)).toFixed(2) } MB</p>
                              </div>
                           </motion.div>
                        ) : (
                           <motion.div 
                             key="idle"
                             initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                             className="space-y-4"
                           >
                              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform">
                                 <Upload className="w-6 h-6" />
                              </div>
                              <div>
                                 <p className="text-sm font-bold text-slate-300">Drop your FIR or Legal Papers here</p>
                                 <p className="text-[10px] text-slate-600 uppercase font-black tracking-widest mt-2">Bail score generated instantly</p>
                              </div>
                           </motion.div>
                        )}
                     </AnimatePresence>
                  </div>
               </div>
            </SpotlightCard>

            {/* Main Narrative Form */}
            <SpotlightCard className="p-10 bg-[#11131c] border-white/5">
               <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                       <FileText className="w-5 h-5" />
                    </div>
                    <div>
                       <h2 className="text-lg font-black text-white uppercase tracking-tight">Incident Narrative</h2>
                       <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Section B • Oral Statement</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                     <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                        {['English', 'Hindi', 'Kannada'].map(lang => (
                           <button 
                             key={lang}
                             onClick={() => setLanguage(lang)}
                             className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${language === lang ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-400'}`}
                           >
                              {lang}
                           </button>
                        ))}
                     </div>
                     <button className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 hover:bg-rose-500/20 transition-all">
                        <Volume2 className="w-4 h-4" />
                     </button>
                  </div>
               </div>

               <div className="relative group">
                  <div className="absolute top-6 left-6 flex items-center gap-2 pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity">
                     <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                     <span className="text-[10px] font-black uppercase text-blue-500 tracking-widest">Listening Engine Active</span>
                  </div>
                  
                  <textarea 
                    placeholder="Describe the incident in detail... Include dates, times, and names mentioned in the FIR. Starting chronologically helps the Aruna Agent."
                    className="w-full bg-[#0a0c12]/60 border border-white/10 rounded-[32px] p-10 text-lg text-slate-300 italic font-medium leading-relaxed min-h-[350px] focus:outline-none focus:border-indigo-500/30 transition-all placeholder:text-slate-800"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  />

                  <div className="absolute bottom-8 right-8 flex items-center gap-4">
                     <Button 
                       onClick={() => setIsListening(!isListening)}
                       className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-xl ${isListening ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}
                     >
                        <Mic className="w-6 h-6" />
                     </Button>
                  </div>
               </div>

               <div className="mt-8 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <Info className="w-4 h-4 text-slate-700" />
                     <p className="text-[10px] text-slate-700 font-bold uppercase tracking-widest italic">Characters: {inputText.length} | Legal Weight: {inputText.length > 200 ? 'High' : 'Low'}</p>
                  </div>
                  <Button 
                    onClick={() => {
                        alert("Intake submitted to Aruna Agent for processing. Check your Dashbaord for the updated status.");
                        navigate('/dashboard');
                    }}
                    className="bg-white text-slate-950 hover:bg-slate-200 font-black px-12 py-8 text-sm uppercase tracking-[0.2em] shadow-xl group rounded-2xl"
                  >
                     Submit Intensive Intake <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                  </Button>
               </div>
            </SpotlightCard>
          </div>

          {/* Sidebar Components */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Guidance Panel */}
            <SpotlightCard className="p-8 bg-[#11131c] border-white/5" spotlightColor="rgba(99, 102, 241, 0.05)">
               <div className="flex items-center gap-3 mb-8">
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-sm font-black text-white uppercase tracking-tight">Intake Guidelines</h3>
               </div>
               
               <div className="space-y-6">
                  <GuidanceItem 
                    title="Be Chronological" 
                    desc="Start from the first phone call or visit from the authorities." 
                  />
                  <GuidanceItem 
                    title="Exact Wording" 
                    desc="If the police used specific terms, mention them as they were said." 
                  />
                  <GuidanceItem 
                    title="Alibi Markers" 
                    desc="Mention if you were at work, hospital, or another location at the time." 
                  />
               </div>

               <div className="mt-10 p-5 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl">
                  <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" /> Pro-Tip
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed italic">
                    If you speak in Hindi or Kannada, our AI will automatically translate and legally code it for the bail application.
                  </p>
               </div>
            </SpotlightCard>

            {/* Rights Information */}
            <SpotlightCard className="p-8 bg-black/20 border-emerald-500/10">
               <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                     <Shield className="w-4 h-4 text-emerald-500" />
                     <h3 className="text-sm font-black text-white uppercase tracking-tight">Your Rights (Art. 22)</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-[10px] font-black text-emerald-500 uppercase tracking-widest"
                    onClick={() => setShowRights(true)}
                  >
                     See All
                  </Button>
               </div>

               <div className="space-y-4">
                  <RightBox icon={CheckCircle2} text="Right to be informed of grounds of arrest." />
                  <RightBox icon={CheckCircle2} text="Right to consult a legal practitioner." />
                  <RightBox icon={CheckCircle2} text="Right to be produced before Magistrate (24 hrs)." />
               </div>

               <Button 
                 variant="link" 
                 className="text-[10px] font-black text-emerald-400 uppercase p-0 h-auto tracking-widest mt-8 hover:text-emerald-300"
                 onClick={() => setShowConstitution(true)}
               >
                 Read Full Constitution Extract <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
               </Button>
            </SpotlightCard>

            {/* Need Help? */}
            <div className={`p-8 rounded-[32px] group cursor-pointer transition-all border ${connectingVolunteer ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-rose-500/5 border-rose-500/10 hover:bg-rose-500/10'}`}>
                <div className="flex items-center gap-3 mb-4">
                   {connectingVolunteer ? <Activity className="w-4 h-4 text-indigo-500 animate-pulse" /> : <AlertTriangle className="w-4 h-4 text-rose-500" />}
                   <h3 className={`text-[10px] font-black uppercase tracking-widest ${connectingVolunteer ? 'text-indigo-500' : 'text-rose-500'}`}>
                      {connectingVolunteer ? 'Connecting to Portal...' : 'Struggling with details?'}
                   </h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-medium mb-6">
                   {connectingVolunteer ? "Please wait. A multilingual legal volunteer will be with you shortly to assist with the intake narrative." : "Our legal volunteers can assist you in documenting the incident via a secure video call."}
                </p>
                <Button 
                  onClick={() => {
                      setConnectingVolunteer(true);
                      setTimeout(() => setConnectingVolunteer(false), 5000);
                  }}
                  variant={connectingVolunteer ? "secondary" : "outline"}
                  className={`w-full py-6 text-[10px] font-black uppercase tracking-widest ${connectingVolunteer ? 'bg-indigo-600 text-white border-none' : 'border-rose-500/20 text-rose-500'}`}
                  disabled={connectingVolunteer}
                >
                   {connectingVolunteer ? <Video className="w-4 h-4 mr-2" /> : null}
                   {connectingVolunteer ? 'Joining Video Queue' : 'Connect with Volunteer'}
                </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showConstitution && (
          <Modal title="Article 39A & Article 21" onClose={() => setShowConstitution(false)}>
            <div className="space-y-6 text-slate-300">
               <div>
                  <h4 className="text-emerald-400 font-bold mb-2 uppercase text-xs tracking-widest">Article 21: Protection of Life and Liberty</h4>
                  <p className="italic leading-relaxed font-serif text-lg">"No person shall be deprived of his life or personal liberty except according to procedure established by law."</p>
                  <p className="text-xs text-slate-500 mt-2">BailBridge uses this as our foundational principle to ensure no undertrial is detained without just cause.</p>
               </div>
               <div className="pt-6 border-t border-white/5">
                  <h4 className="text-emerald-400 font-bold mb-2 uppercase text-xs tracking-widest">Article 39A: Equal Justice and Free Legal Aid</h4>
                  <p className="leading-relaxed">"The State shall secure that the operation of the legal system promotes justice, on a basis of equal opportunity, and shall, in particular, provide free legal aid, by suitable legislation or schemes or in any other way, to ensure that opportunities for securing justice are not denied to any citizen by reason of economic or other disabilities."</p>
               </div>
               <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white mt-4" onClick={() => setShowConstitution(false)}>Acknowledge & Close</Button>
            </div>
          </Modal>
        )}

        {showRights && (
          <Modal title="Legal Rights of the Arrested" onClose={() => setShowRights(false)}>
            <div className="space-y-4">
               <RightsItem 
                 title="Production within 24 Hours" 
                 desc="As per Art 22(2) and Sec 58 BNSS, you must be produced before a Magistrate within 24 hours of arrest." 
               />
               <RightsItem 
                 title="Grounds of Arrest" 
                 desc="You have a right to know the specific sections and allegations against you immediately." 
               />
               <RightsItem 
                 title="D.K. Basu Compliance" 
                 desc="Police MUST prepare an arrest memo and have it signed by a witness. A family member must be notified." 
               />
               <RightsItem 
                 title="Female Accused" 
                 desc="No woman can be arrested after sunset or before sunrise, except in extraordinary circumstances by a female officer." 
               />
               <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white mt-6" onClick={() => setShowRights(false)}>Understood</Button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

function Modal({ title, children, onClose }: { title: string, children: ReactNode, onClose: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-xl bg-[#0d0f17] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl"
      >
        <div className="flex justify-between items-center px-8 py-6 border-b border-white/5 bg-white/[0.02]">
          <h2 className="text-sm font-black text-white uppercase tracking-widest">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-8 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}

function RightsItem({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-emerald-500/20 transition-all">
       <h4 className="text-xs font-black text-emerald-400 uppercase mb-2 group-hover:text-emerald-300">{title}</h4>
       <p className="text-[11px] text-slate-400 leading-relaxed font-medium">{desc}</p>
    </div>
  );
}

function GuidanceItem({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="border-l-2 border-indigo-500/20 pl-4 py-1">
       <h4 className="text-[12px] font-black text-slate-200 uppercase tracking-tight mb-1">{title}</h4>
       <p className="text-[11px] text-slate-500 leading-relaxed italic">{desc}</p>
    </div>
  );
}

function RightBox({ icon: Icon, text }: { icon: any, text: string }) {
  return (
    <div className="flex items-start gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
       <Icon className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
       <p className="text-[11px] text-slate-400 font-medium leading-relaxed">{text}</p>
    </div>
  );
}

function ArrowUpRight(props: any) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </svg>
  );
}

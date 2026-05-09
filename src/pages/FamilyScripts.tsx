import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  Copy, 
  Check, 
  Info, 
  Sparkles, 
  Volume2, 
  ChevronRight, 
  ShieldCheck, 
  Mic, 
  Stethoscope, 
  Users,
  Search,
  BookOpen,
  Zap,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SpotlightCard } from '@/src/components/SpotlightCard';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Script {
  id: string;
  language: string;
  labelCode: string;
  title: string;
  content: string;
  scenario: string;
}

export default function FamilyScripts() {
  const navigate = useNavigate();
  const [selectedLang, setSelectedLang] = useState('English');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [summary, setSummary] = useState("Accused was taken into custody. We are seeking bail and legal assistance.");
  const [dynamicScripts, setDynamicScripts] = useState<any>(null);
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('bailbridge_case_data');
    if (stored) {
      const data = JSON.parse(stored);
      if (data.summary) setSummary(data.summary);
      if (data.script) setDynamicScripts(data.script);
    }
  }, []);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (id: string, text: string, lang: string) => {
    if (isSpeaking === id) {
      window.speechSynthesis.cancel();
      setIsSpeaking(null);
      return;
    }

    window.speechSynthesis.cancel();
    
    const speak = () => {
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      
      if (lang === 'Hindi') {
        utterance.lang = 'hi-IN';
        const hiVoice = voices.find(v => v.lang.includes('hi'));
        if (hiVoice) utterance.voice = hiVoice;
      } else if (lang === 'Kannada') {
        utterance.lang = 'kn-IN';
        const knVoice = voices.find(v => v.lang.includes('kn'));
        if (knVoice) utterance.voice = knVoice;
      } else {
        utterance.lang = 'en-IN';
      }

      utterance.onend = () => setIsSpeaking(null);
      utterance.onerror = () => setIsSpeaking(null);
      setIsSpeaking(id);
      window.speechSynthesis.speak(utterance);
    };

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        speak();
        window.speechSynthesis.onvoiceschanged = null;
      };
    } else {
      speak();
    }
  };

  const getScripts = (): Script[] => {
    if (!dynamicScripts) {
      return [
        {
          id: 's1',
          language: 'English',
          labelCode: 'EN',
          title: 'Formal Intake & Submission',
          scenario: 'To be read at the Police Station or Jail during first visit.',
          content: `My name is Sunita Devi. I am the mother of the accused. We are a law-abiding family. Regarding the allegation: "${summary}". He has no prior criminal record and will cooperate fully with the investigation. We request that his constitutional rights be respected and we are in the process of moving for bail.`
        },
        {
          id: 's2',
          language: 'Hindi',
          labelCode: 'HI',
          title: 'पहला संवाद (First Contact)',
          scenario: 'पुलिस अधिकारियों या कानूनी स्वयंसेवकों से बात करते समय उपयोग करें।',
          content: `मेरा नाम सुनीता देवी है। मैं आरोपी की माँ हूँ। हम कानून का पालन करने वाले परिवार हैं। आरोप के बारे में: "${summary}"। उनका कोई पिछला आपराधिक रिकॉर्ड नहीं है और वे जांच में पूरा सहयोग करेंगे। हम अनुरोध करते हैं कि उनके संवैधानिक अधिकारों का सम्मान किया जाए।`
        },
        {
          id: 's3',
          language: 'Kannada',
          labelCode: 'KA',
          title: 'ಸಹಾಯಕ್ಕಾಗಿ ವಿನಂತಿ (Request for Aid)',
          scenario: 'ಸ್ಥಳೀಯ ಅಧಿಕಾರಿಗಳು ಅಥವಾ ಇ-ಸೇವಾ ಕೇಂದ್ರದ ಸಿಬ್ಬಂದಿಗೆ ಮೌಖಿಕವಾಗಿ ಹೇಳಲು.',
          content: `ನನ್ನ ಹೆಸರು ಸುನೀತಾ ದೇವಿ. ನಾನು ಆರೋಪಿಯ ತಾಯಿ. ನಾವು ಕಾನೂನು ಪಾಲಿಸುವ ಕುಟುಂಬ. ಆರೋಪಕ್ಕೆ ಸಂಬಂಧಿಸಿದಂತೆ: "${summary}". ಅವರಿಗೆ ಯಾವುದೇ ಹಳೆಯ ಅಪರಾಧ ದಾಖಲೆಗಳಿಲ್ಲ ಮತ್ತು ಅವರು ತನಿಖೆಗೆ ಸಂಪೂರ್ಣ ಸಹಕರಿಸುತ್ತಾರೆ. ಅವರ ಸಾಂವಿಧಾನಿಕ ಹಕ್ಕುಗಳನ್ನು ಗೌರವಿಸಬೇಕೆಂದು ನಾವು ವಿನಂತಿಸುತ್ತೇವೆ.`
        }
      ];
    }

    const langKeyMap: any = { 'English': 'en', 'Hindi': 'hi', 'Kannada': 'kn' };
    const k = langKeyMap[selectedLang];

    return [
      {
         id: 'd1',
         language: selectedLang,
         labelCode: selectedLang.substring(0, 2).toUpperCase(),
         title: 'Standard Situation Brief',
         scenario: 'Clear summary for formal submission.',
         content: dynamicScripts[k]
      },
      {
         id: 'd2',
         language: selectedLang,
         labelCode: selectedLang.substring(0, 2).toUpperCase(),
         title: 'Police Interaction Script',
         scenario: 'Specific for station visits and ground requests.',
         content: dynamicScripts.scenarios.police[k]
      },
      {
         id: 'd3',
         language: selectedLang,
         labelCode: selectedLang.substring(0, 2).toUpperCase(),
         title: 'Court / Bail Hearing Script',
         scenario: 'To be read before a Magistrate if no lawyer is present.',
         content: dynamicScripts.scenarios.court[k]
      },
      {
         id: 'd4',
         language: selectedLang,
         labelCode: selectedLang.substring(0, 2).toUpperCase(),
         title: 'Legal Aid Request',
         scenario: 'For NALSA/DLSA volunteers.',
         content: dynamicScripts.scenarios.legal_aid[k]
      }
    ];
  };

  const scripts = getScripts();

  return (
    <div className="min-h-screen bg-[#0a0c12] text-slate-200 selection:bg-indigo-500/30 -mt-20 pt-28 pb-20">
      <div className="max-w-[1440px] mx-auto px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 border-b border-white/5 pb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
               <div className="w-6 h-6 rounded bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <MessageSquare className="w-3.5 h-3.5" />
               </div>
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Communication Nodes • Multilingual</span>
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight uppercase leading-none mb-4">Family Scripts</h1>
            <p className="text-slate-500 max-w-2xl text-sm italic leading-relaxed font-medium">
              Verified communication templates designed to ensure legal clarity and protect the rights of families during judicial interactions.
            </p>
          </div>
          
          <div className="flex gap-3">
             {['English', 'Hindi', 'Kannada'].map(lang => (
                <Button 
                  key={lang}
                  variant={selectedLang === lang ? 'default' : 'ghost'}
                  onClick={() => setSelectedLang(lang)}
                  className={`text-[10px] font-black uppercase tracking-widest px-6 h-12 transition-all duration-500 ${
                    selectedLang === lang 
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/30' 
                    : 'text-slate-600 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {lang}
                </Button>
             ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content: Script Cards */}
          <div className="lg:col-span-8 space-y-10">
            <AnimatePresence mode="wait">
              {scripts.filter(s => s.language === selectedLang || selectedLang === 'All').map((script) => (
                <motion.div
                  key={script.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                   <SpotlightCard 
                    className={`p-10 border-white/5 relative overflow-hidden group ${script.id === 's1' ? 'bg-[#11131c]' : 'bg-[#0e1017]'}`}
                    spotlightColor="rgba(99, 102, 241, 0.05)"
                   >
                     {/* Recommendation Badge */}
                     {script.id === 's1' && (
                       <div className="absolute top-0 right-10 -translate-y-1/2 bg-indigo-600 text-white px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.3em] flex items-center gap-2 shadow-xl shadow-indigo-900/40">
                         <Sparkles className="w-3.5 h-3.5" /> Recommended Default
                       </div>
                     )}

                     <div className="flex items-start justify-between mb-10">
                        <div className="flex items-center gap-6">
                           <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                              <span className="text-xl font-black italic">{script.labelCode}</span>
                           </div>
                           <div>
                              <h2 className="text-xl font-bold text-white tracking-tight leading-none mb-2">{script.title}</h2>
                              <div className="flex items-center gap-2">
                                <Info className="w-3 h-3 text-slate-600" />
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{script.scenario}</p>
                              </div>
                           </div>
                        </div>
                        <div className="flex gap-2">
                           <Button 
                             onClick={() => handleCopy(script.id, script.content)}
                             variant="outline" 
                             className="border-white/10 hover:border-indigo-500/30 bg-white/[0.01] hover:bg-indigo-500/[0.05] text-slate-500 hover:text-indigo-400 h-10 px-4 transition-all"
                           >
                             {copiedId === script.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                           </Button>
                           <Button 
                             variant="outline" 
                             className={`border-white/10 h-10 px-4 transition-all ${isSpeaking === script.id ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500' : 'bg-white/[0.01] text-slate-500 hover:border-indigo-500/30 hover:bg-indigo-500/[0.05] hover:text-indigo-400'}`}
                             onClick={() => handleSpeak(script.id, script.content, script.language)}
                           >
                             <Volume2 className={`w-4 h-4 ${isSpeaking === script.id ? 'animate-pulse' : ''}`} />
                           </Button>
                        </div>
                     </div>

                     <div className={`p-8 bg-[#0a0c12]/60 border rounded-3xl relative overflow-hidden transition-all duration-500 group-hover:border-indigo-500/20 ${script.id === 's1' ? 'border-indigo-500/20' : 'border-white/5'}`}>
                        <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                           <MessageSquare className="w-32 h-32 text-indigo-400" />
                        </div>
                        <p className="text-lg text-slate-300 leading-relaxed font-medium italic relative z-10 selection:bg-indigo-500/40">
                           {script.content}
                        </p>
                     </div>

                     <div className="mt-8 flex items-center justify-between pt-8 border-t border-white/5">
                        <div className="flex items-center gap-4">
                           <div className="flex -space-x-2">
                              {[1, 2, 3].map(i => (
                                 <div key={i} className={`w-6 h-6 rounded-full border-2 border-[#11131c] bg-slate-800 flex items-center justify-center text-[8px] font-black ${i === 1 ? 'text-teal-400' : 'text-slate-600'}`}>0{i}</div>
                              ))}
                           </div>
                           <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">Used by 1.2k families</p>
                        </div>
                        <Button variant="ghost" className="text-[10px] font-black uppercase text-slate-500 tracking-widest hover:text-indigo-400">
                          Customise Content <ChevronRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                     </div>
                   </SpotlightCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Guidance Sidebar */}
          <div className="lg:col-span-4 space-y-10">
            {/* Advice Panel */}
            <SpotlightCard className="p-8 bg-[#11131c] border-white/5" spotlightColor="rgba(244, 63, 94, 0.05)">
               <div className="flex items-center gap-3 mb-8">
                  <ShieldCheck className="w-4 h-4 text-rose-500" />
                  <h3 className="text-sm font-black text-white uppercase tracking-tight">Legal Safeguards</h3>
               </div>
               
               <div className="space-y-6">
                  <GuidanceItem 
                    icon={Mic} 
                    title="Speak Calmly" 
                    desc="Authorities respond better to neutral, prepared communication." 
                    color="indigo"
                  />
                  <GuidanceItem 
                    icon={Zap} 
                    title="Stick to Script" 
                    desc="Avoid adding speculative details that are not in the FIR." 
                    color="amber"
                  />
                  <GuidanceItem 
                    icon={Stethoscope} 
                    title="Mention Health" 
                    desc="If the accused has medical needs, add it to the script immediately." 
                    color="teal"
                  />
               </div>
               
               <div className="mt-10 pt-8 border-t border-white/5">
                  <div className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-2xl">
                     <p className="text-[10px] text-rose-500 font-black leading-relaxed uppercase tracking-widest flex items-center gap-2">
                        <AlertTriangle className="w-3 h-3" /> Constitutional Caveat
                     </p>
                     <p className="text-[11px] text-slate-500 leading-relaxed mt-2 font-medium">
                        Remember: Article 20(3) protects you from being a witness against yourself. The script is designed to protect this right.
                     </p>
                  </div>
               </div>
            </SpotlightCard>

            {/* When to use Panel */}
            <div className="p-8 bg-[#0e1017] border border-white/5 rounded-3xl space-y-8">
               <div className="flex items-center gap-3">
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.3em]">Usage Protocol</h3>
               </div>
               
               <div className="space-y-8">
                  <ScenarioItem 
                    num="01"
                    title="Police Enquiry"
                    desc="Use for initial verbal contact during house searches or enquiry."
                  />
                  <ScenarioItem 
                    num="02"
                    title="Legal Counsel"
                    desc="Read to a DLSA volunteer or potential panel lawyer for quick context."
                  />
                  <ScenarioItem 
                    num="03"
                    title="Prison Visit"
                    desc="Use to communicate with prison staff regarding accused's status."
                  />
               </div>

               <Button 
                variant="outline" 
                className="w-full border-white/10 hover:bg-white/5 text-[9px] font-black uppercase tracking-widest py-7 h-auto group"
                onClick={() => navigate('/legal-aid')}
               >
                 Draft Full Formal Petition <ChevronRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
               </Button>
            </div>

            {/* Quick Filter/Search Mockup */}
            <div className="relative group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 transition-colors group-focus-within:text-indigo-400" />
               <input 
                placeholder="Search scripts..." 
                className="w-full bg-white/5 border border-white/5 rounded-2xl h-14 pl-12 pr-4 text-xs font-medium focus:outline-none focus:border-indigo-500/30 transition-all placeholder:text-slate-700" 
               />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GuidanceItem({ icon: Icon, title, desc, color }: { icon: any, title: string, desc: string, color: string }) {
  const colors: Record<string, string> = {
    indigo: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20',
    amber: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    teal: 'text-teal-400 bg-teal-400/10 border-teal-400/20',
    rose: 'text-rose-400 bg-rose-400/10 border-rose-400/20'
  };

  return (
    <div className="flex items-start gap-4">
       <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border mt-0.5 ${colors[color]}`}>
          <Icon className="w-4 h-4" />
       </div>
       <div>
          <h4 className="text-[13px] font-black text-slate-100 uppercase tracking-tight mb-1">{title}</h4>
          <p className="text-[11px] text-slate-500 leading-relaxed font-bold tracking-tight">{desc}</p>
       </div>
    </div>
  );
}

function ScenarioItem({ num, title, desc }: { num: string, title: string, desc: string }) {
  return (
    <div className="group cursor-pointer">
       <div className="flex items-center gap-3 mb-2">
          <span className="text-[10px] font-mono font-black text-slate-700 group-hover:text-indigo-600 transition-colors">{num}</span>
          <h4 className="text-[12px] font-black text-slate-300 uppercase tracking-widest">{title}</h4>
       </div>
       <p className="text-[11px] text-slate-600 font-medium italic group-hover:text-slate-400 transition-colors leading-relaxed ml-2 border-l border-white/5 pl-4">{desc}</p>
    </div>
  );
}

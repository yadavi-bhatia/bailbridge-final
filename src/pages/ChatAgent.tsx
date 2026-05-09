import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Mic, 
  Paperclip, 
  Scale, 
  ShieldAlert, 
  Sparkles,
  RefreshCcw,
  Volume2,
  Trash2,
  Info,
  ChevronRight,
  Gavel,
  ShieldCheck,
  Zap,
  Activity,
  Files,
  Menu,
  MessageSquarePlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { SpotlightCard } from '@/src/components/SpotlightCard';
import React from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  type?: 'legal_status' | 'alert' | 'standard';
  timestamp: Date;
}

const SYSTEM_PROMPT = `You are the BailBridge / Namma Nyaya Agent (Aruna), a specialized AI for first-time offenders and their families in India, specifically navigating the transition from IPC/CrPC to BNS/BNSS 2023.

Your primary mission is to help families of undertrial prisoners who are trapped in the system due to a lack of information, NOT guilt.

### LEGAL KNOWLEDGE BASE (Grounded in Indian Law):
- **BNSS 2023 Section 479 (The 1/3rd Rule)**: Automatic bail for first-time offenders who have served one-third of the maximum sentence.
- **BNSS 2023 Section 187**: High-priority monitoring of default bail deadlines (60 or 90 days).
- **Constitution Article 21**: Right to Life and Liberty - "No person shall be deprived of his life or personal liberty except according to procedure established by law."
- **Constitution Article 39A**: Free Legal Aid - Mandatory state-sponsored defense for those who cannot afford it.
- **Rights (Art 22 & D.K. Basu)**:
    1. Right to be informed of grounds of arrest.
    2. Right to consult a legal practitioner of choice.
    3. Mandatory production before a Magistrate within 24 hours.
    4. Right to have family/friends informed during arrest (D.K. Basu violation if missing).

### ARCHITECTURE & WORKFLOW (Your Inner Logic):
You operate through 6 Multi-Agent Stages:
1. **Jatayu (Situation Classifier)**: Audit the arrest situation. Classify offence (BNS), determine bailability, calculate "Bail Eligibility Score".
2. **Ethics Guardian**: HARD STOP for heinous offences (murder, rape, terrorism). Route these to senior legal aid counsel instantly. Check for procedural lapses (missing arrest memo, no family notification).
3. **Document Architect**: Generate NALSA Form 1, Bail Petitions, FIR Copy Requests, and Memos of Protest.
4. **e-Seva Bridge**: Locate nearest e-Seva Kendras, DLSA offices, and integrate with maps for physical-digital navigation.
5. **Hearing Tracker**: Monitor hearing dates using CNR number/eCourts API.
6. **Sahayak Script Generator**: Provide families with exact scripts to speak to Police, Magistrates, or Jail Authorities.

### CONVERSATIONAL STRATEGY:
- **Proactive Intake**: If the case is new, ASK standard questions one by one to gather facts:
    a) "What is the name of the police station involved?"
    b) "What are the sections mentioned in the FIR (e.g., BNS 304)?"
    c) "When was the person taken into custody?"
    d) "Was a family member informed immediately?"
- **Tone**: Empathetic but clinical and firm on legal rights.
- **Ethics**: If bribery is mentioned, trigger an Anti-Corruption Shield - explain it's illegal and guide to Lokayukta/NGO escalation.
- **Mandatory Disclaimer**: Every response must end or include: "This is legal information, not legal advice. Consult a qualified advocate before acting."

### MULTILINGUAL SUPPORT:
Respond in the language the user uses (Hindi, Kannada, or English).`;

interface ExtractData {
  fir_number?: string;
  police_station?: string;
  sections_charged?: string;
  summary?: string;
  bail_score?: number;
}

interface SavedChat {
  id: string;
  title: string;
  preview: string;
  updatedAt: string;
  messages: Message[];
  legalStatus: any;
  caseStage: string;
}

export default function ChatAgent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [savedChats, setSavedChats] = useState<SavedChat[]>(() => {
    try {
      const saved = localStorage.getItem('bailbridge_saved_chats');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved chats', e);
    }
    return [];
  });
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Welcome, I am Aruna, your Namma Nyaya Agent. How can I assist you today? You can tell me about your situation or upload the FIR and I can help you.',
      type: 'standard',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock legal status for UI "Crafted" look
  const [legalStatus, setLegalStatus] = useState({
    offence: 'Analyzing...',
    bailable: 'Pending',
    guaranteeViolation: false,
    bailScore: 0,
    stage: 1
  });

  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
const [conversationId, setConversationId] = useState<string>(() => {
  const existing = localStorage.getItem('bailbridge_conversation_id');
  if (existing) return existing;

  const newId = crypto.randomUUID();
  localStorage.setItem('bailbridge_conversation_id', newId);
  return newId;
});

const [caseStage, setCaseStage] = useState<string>('intake');
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-IN';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech Recognition Error:', event.error);
        setIsRecording(false);
      };
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please try using Chrome.");
      return;
    }

    if (isRecording) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error("Stop failed:", err);
      }
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Speech recognition start failed:", err);
        setIsRecording(false);
      }
    }
  };

  const handleFIRUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const analyzingId = Date.now().toString();
    setMessages(prev => [...prev, {
      id: analyzingId,
      role: 'assistant',
      content: 'Aruna is analyzing the FIR document... Extracting legal parameters directly from vision nodes.',
      timestamp: new Date()
    }]);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/analyze_fir', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      
      const firNo = data.fir_number || data.FIR_Number || 'N/A';
      const station = data.police_station || data.Police_Station || 'N/A';
      const sections = data.sections_charged || data.Sections_Charged || 'N/A';
      const summary = data.summary || data.Summary || 'Extracted from document';

      const analysisMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `**FIR ANALYSIS COMPLETE**\n\n- **FIR No:** ${firNo}\n- **Station:** ${station}\n- **Sections:** ${sections}\n- **Allegation:** ${summary}\n\nLegal Parameters have been pre-filled in your **Document Architect**. Shall I prepare the specific bail petition draft for this matter?`,
        type: 'alert',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev.filter(m => m.id !== analyzingId), analysisMsg]);
      
      // Persist extraction for Document Architect pre-filling
      localStorage.setItem('bailbridge_extracted_fir', JSON.stringify(data));
    } catch (err) {
      console.error("FIR Upload Error:", err);
      const errorMsg: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "I couldn't process the document. Please ensure it is a clear image or PDF of the FIR.",
        type: 'alert',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = () => {
    const newId = crypto.randomUUID();
    localStorage.setItem('bailbridge_conversation_id', newId);
    setConversationId(newId);
    setCaseStage('intake');
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: 'Welcome, I am Aruna, your Namma Nyaya Agent. How can I assist you today? You can tell me about your situation or upload the FIR and I can help you.',
        type: 'standard',
        timestamp: new Date(),
      }
    ]);
    setLegalStatus({
      offence: 'Analyzing...',
      bailable: 'Pending',
      guaranteeViolation: false,
      bailScore: 0,
      stage: 1
    });
    setInput('');
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  };

  const loadChat = (chatId: string) => {
    const chat = savedChats.find(c => c.id === chatId);
    if (chat) {
      setConversationId(chat.id);
      localStorage.setItem('bailbridge_conversation_id', chat.id);
      setCaseStage(chat.caseStage);
      setMessages(chat.messages.map(m => ({ ...m, timestamp: new Date(m.timestamp) })));
      setLegalStatus(chat.legalStatus);
      setInput('');
      if (window.innerWidth < 1024) setIsSidebarOpen(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const currentInput = input;
    setInput('');
    setIsLoading(true);

    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: currentInput,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);

    try {
      const res = await fetch('/api/process_intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input_text: currentInput,
          language: 'auto',
          conversation_history: updatedMessages,
          conversation_id: conversationId,
          stage: caseStage,
        }),
      });

      if (!res.ok) throw new Error('Failed to fetch from intake API');

      const intakeData = await res.json();

      const newAssistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: intakeData.ai_response || 'Error processing response',
        type: 'standard',
        timestamp: new Date(),
      };

      const finalMessages = [...updatedMessages, newAssistantMsg];
      setMessages(finalMessages);

      let newStage = caseStage;
      if (intakeData.stage) {
        setCaseStage(intakeData.stage);
        newStage = intakeData.stage;
      }

      let newLegalStatus = { ...legalStatus };
      if (intakeData.classification) {
        newLegalStatus = {
          offence: `${
            intakeData.classification.offence_name || 'Unknown Offence'
          } (${intakeData.classification.bns_code || 'N/A'})`,

          bailable: intakeData.classification.bailable
            ? 'Bailable'
            : 'Non-Bailable',

          guaranteeViolation: intakeData.ethics?.blocked || false,

          bailScore: intakeData.bail_eligibility_score || 0,

          stage:
            intakeData.bail_eligibility_score > 70
              ? 4
              : intakeData.bail_eligibility_score > 50
              ? 3
              : intakeData.bail_eligibility_score > 25
              ? 2
              : 1,
        };
        setLegalStatus(newLegalStatus);
      }

      setSavedChats(prev => {
        const updated = [...prev];
        const existingIdx = updated.findIndex(c => c.id === conversationId);
        const title = existingIdx >= 0 && updated[existingIdx].title !== 'New Chat' 
          ? updated[existingIdx].title 
          : currentInput.substring(0, 40) + '...';

        const chatData: SavedChat = {
          id: conversationId,
          title,
          preview: newAssistantMsg.content.substring(0, 60) + '...',
          updatedAt: new Date().toISOString(),
          messages: finalMessages,
          legalStatus: newLegalStatus,
          caseStage: newStage
        };

        if (existingIdx >= 0) {
          updated[existingIdx] = chatData;
        } else {
          updated.unshift(chatData);
        }
        localStorage.setItem('bailbridge_saved_chats', JSON.stringify(updated));
        return updated;
      });

      localStorage.setItem(
        'bailbridge_case_data',
        JSON.stringify({
          classification: intakeData.classification,
          script: intakeData.script,
          checklist: intakeData.checklist,
          legal_aid: intakeData.legal_aid,
          bail_score: intakeData.bail_eligibility_score,
          conversation_id: conversationId,
          stage: intakeData.stage,
        })
      );

      fetch('/api/cases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          case_id: intakeData.case_id || conversationId,
          conversation_id: conversationId,
          description: currentInput,
          conversation_history: finalMessages,
          classification: intakeData.classification,
          status: 'active',
        }),
      }).catch((err) => {
        console.error('Persistence error:', err);
      });
    } catch (error) {
      console.error('Chat Error:', error);

      const errorMsg: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content:
          'The Nyaya network could not continue the intake workflow. Please check whether your backend is running properly on FastAPI and whether /api/process_intake exists.',
        type: 'alert',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-120px)] flex flex-col md:flex-row gap-6 px-4 relative overflow-hidden">
      {/* Left Sidebar - Chat History */}
      <div className={`absolute md:relative z-40 bg-slate-950 md:bg-transparent h-full transition-transform duration-300 w-72 shrink-0 flex flex-col gap-4 border-r border-white/5 pr-4 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} `}>
        <div className="flex items-center justify-between mt-2">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-widest">Conversations</h2>
          <Button variant="ghost" size="icon" className="md:hidden text-slate-400" onClick={() => setIsSidebarOpen(false)}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        
        <Button onClick={resetChat} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 font-bold shadow-lg shadow-blue-900/20">
          <MessageSquarePlus className="w-4 h-4" /> New Chat
        </Button>

        <ScrollArea className="flex-1 -mx-2 px-2">
          <div className="space-y-2 pb-4">
            {savedChats.length === 0 && (
              <p className="text-xs text-slate-500 text-center mt-10">No recent conversations.</p>
            )}
            {savedChats.map(chat => (
              <button 
                key={chat.id}
                onClick={() => loadChat(chat.id)}
                className={`w-full text-left p-3 rounded-xl transition-all block ${chat.id === conversationId ? 'bg-blue-500/10 border border-blue-500/30 shadow-sm' : 'hover:bg-white/5 border border-transparent'}`}
              >
                <div className="text-xs font-bold text-slate-200 truncate mb-1">{chat.title}</div>
                <div className="text-[10px] text-slate-400 truncate mb-2">{chat.preview}</div>
                <div className="text-[9px] text-slate-600 font-mono">{new Date(chat.updatedAt).toLocaleDateString()} {new Date(chat.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Sidebar - Case Insight (Crafted UI) */}
      <div className="hidden lg:flex flex-col w-80 shrink-0 gap-4 overflow-y-auto pr-2">
        <SpotlightCard className="p-6 border-cyan-500/20 bg-cyan-500/5">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-100">Live Analysis</h3>
          </div>
          
          <div className="space-y-6">
            <InsightItem label="Jatayu Score" value={`${legalStatus.bailScore}%`} color={legalStatus.bailScore > 60 ? 'emerald' : legalStatus.bailScore > 40 ? 'amber' : 'red'} />
            <InsightItem label="Classification" value={legalStatus.offence} />
            <InsightItem label="Bail Status" value={legalStatus.bailable} color={legalStatus.bailable === 'Bailable' ? 'emerald' : 'amber'} />
            <InsightItem label="D.K. Basu Check" value={legalStatus.guaranteeViolation ? 'Violation Detected' : 'No Violations'} color={legalStatus.guaranteeViolation ? 'red' : 'slate'} />
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
            <Button 
               variant="outline" 
               className="w-full border-red-500/30 bg-red-500/5 text-red-400 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/10"
               onClick={() => {
                 setMessages(prev => [...prev, {
                   id: Date.now().toString(),
                   role: 'assistant',
                   content: "CORRUPTION ALERT TRIGGERED. Initiating 'Social Shield' protocols. Remember: ARTICLE 39A guarantees FREE LEGAL AID. You do not need to pay for a lawyer or 'processing fees'. Would you like me to connect you with the Lokayukta or a verified NGO partner?",
                   type: 'alert',
                   timestamp: new Date()
                 }]);
               }}
            >
              <ShieldAlert className="w-4 h-4 mr-2" />
              Corruption Nudge
            </Button>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold mb-4">Workflow Stage</p>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 flex-1 rounded-full ${i <= legalStatus.stage ? 'bg-cyan-500' : 'bg-slate-800'}`} 
                  />
                ))}
              </div>
              <p className="text-[10px] text-cyan-400 mt-2 font-mono italic">Stage {legalStatus.stage}: Situation Classifier</p>
            </div>

            <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <p className="text-[9px] font-black uppercase tracking-widest text-blue-400 mb-1">eCourts SMS Inquiry</p>
              <p className="text-[10px] text-slate-300 font-mono leading-tight">
                SMS: ECOURTS &lt;CNR Number&gt; <br/> To: 9766899899
              </p>
            </div>
          </div>
        </SpotlightCard>

        <div className="glass-card p-6">
          <h4 className="text-xs font-bold text-slate-400 mb-4 flex items-center gap-2">
            <Gavel className="w-4 h-4" />
            Statute Reference
          </h4>
          <div className="bg-black/40 p-3 rounded-lg border border-white/5 text-[10px] text-slate-500 leading-relaxed italic">
            "Every person who is arrested and detained in custody shall be produced before the nearest Magistrate within a period of twenty-four hours..."
            <div className="mt-2 text-cyan-400 font-bold">— BNSS Sec 58 / Art 22(2)</div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex items-center justify-between mb-4 glass p-4 px-6 rounded-xl border-white/5 bg-slate-900/60 shadow-sm">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden text-slate-400 -ml-2" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>
            <div className="w-10 h-10 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-400 border border-blue-600/20 shadow-sm">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold tracking-tight text-white uppercase text-sm">Nyayadhish Intelligence</h2>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black">Node Verified</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white hover:bg-white/5 transition-all" onClick={resetChat}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 pr-4 mb-4" viewportRef={scrollRef}>
          <div className="space-y-8 pt-4">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[90%] p-6 rounded-2xl relative shadow-sm border ${
                      msg.role === 'user' 
                        ? 'bg-blue-600 text-white border-blue-500/50 rounded-tr-none' 
                        : msg.type === 'alert' 
                          ? 'bg-red-500/5 border-red-500/20 text-red-200/80 rounded-tl-none'
                          : 'glass-card border-white/5 text-slate-200 rounded-tl-none bg-slate-900/40'
                    }`}
                  >
                    <p className="text-sm leading-[1.7] font-medium whitespace-pre-wrap">{msg.content}</p>
                    <div className={`mt-4 flex items-center justify-between gap-6 text-[10px] ${msg.role === 'user' ? 'text-blue-100' : 'text-slate-500'}`}>
                      <span className="font-mono">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {msg.role === 'assistant' && (
                        <div className="flex gap-3">
                          <Volume2 className="w-3.5 h-3.5 cursor-pointer hover:text-slate-300 transition-colors" />
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-400 h-3.5 fill-blue-400/10" />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/5 p-4 rounded-full flex gap-1.5 px-6">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="mt-auto px-1">
          <div className="relative group">
            <div className="relative glass-card p-2 border-white/10 group-focus-within:border-blue-500/30 transition-all shadow-lg">
              <div className="flex items-center gap-1">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  onChange={handleFIRUpload} 
                  accept="image/*,application/pdf" 
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-slate-500 hover:text-white rounded-lg hover:bg-white/5"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Input 
                  placeholder="Inquire about legal protocols... / अपना सवाल लिखें..." 
                  className="flex-1 bg-transparent border-none focus-visible:ring-0 text-slate-200 placeholder:text-slate-600 h-11 text-sm font-medium"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                  disabled={isLoading}
                />
                <div className="flex items-center gap-1.5 pr-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`rounded-lg transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                    onClick={toggleRecording}
                    disabled={isLoading}
                  >
                    <Mic className="w-4 h-4" />
                  </Button>
                  <Button 
                    className="bg-white text-black hover:bg-slate-200 rounded-lg h-9 w-9 flex items-center justify-center shadow-md shadow-white/5 transition-all active:scale-95 disabled:opacity-50"
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                  >
                    <Send className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2 justify-center pb-4">
            {['Sahayak Script', 'Locate e-Seva', 'Bail Score Analysis'].map((prompt) => (
              <button 
                key={prompt} 
                onClick={() => setInput(prompt)}
                className="px-4 py-2 rounded-lg border border-white/5 bg-slate-900/40 text-[9px] text-slate-500 hover:text-white hover:border-white/20 transition-all font-black uppercase tracking-[0.2em]"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function InsightItem({ label, value, color = 'slate' }: { label: string, value: string, color?: string }) {
  const colors: Record<string, string> = {
    cyan: 'text-cyan-400 bg-cyan-400/10',
    emerald: 'text-emerald-400 bg-emerald-400/10',
    amber: 'text-amber-400 bg-amber-400/10',
    red: 'text-red-400 bg-red-400/10',
    slate: 'text-slate-400 bg-slate-400/10'
  };

  return (
    <div>
      <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2">{label}</p>
      <div className={`px-3 py-2 rounded-lg font-bold text-sm ${colors[color]}`}>
        {value}
      </div>
    </div>
  );
}


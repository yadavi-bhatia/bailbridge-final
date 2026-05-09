import { ReactNode } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Scale, 
  MessageSquare, 
  Files, 
  ArrowRight,
  Globe,
  Zap,
  Lock,
  Gavel,
  Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TextType } from '@/src/components/TextType';
import { SpotlightCard } from '@/src/components/SpotlightCard';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden selection:bg-blue-500/30">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-bold mb-10 uppercase tracking-[0.2em] shadow-sm">
              <Shield className="w-3 h-3 fill-current" />
              India's Premier Legal Navigator
            </div>
            
            <h1 className="text-6xl md:text-8xl font-medium tracking-tight mb-8 leading-[1] text-white">
              Smarter Legal Support <br/>
              <span className="text-slate-500 italic font-light">for the Justice Seekers.</span>
            </h1>
            
            <div className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-16 font-normal">
              <TextType 
                phrases={[
                  "AI-Powered Case Navigation.",
                  "Support in English, Hindi, & Kannada.",
                  "Secure Legal Document Architecture.",
                  "Bridging the Gap for Undertrial Families."
                ]}
                className="text-slate-300"
                cursorColor="#3b82f6"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 h-14 rounded-lg text-lg font-semibold group shadow-lg shadow-blue-600/20"
                onClick={() => navigate('/chat')}
              >
                Access Nyaya Agent
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="glass border-white/10 hover:bg-white/5 px-10 h-14 rounded-lg text-lg font-semibold"
                onClick={() => navigate('/dashboard')}
              >
                Dashboard
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Features - Grounded Aesthetic */}
      <section className="py-24 px-4 border-y border-white/5 bg-slate-950/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[300px]">
            {/* Main AI Chat Feature */}
            <SpotlightCard className="md:col-span-8 p-10 flex flex-col justify-between group h-full">
              <div>
                <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center mb-6">
                  <MessageSquare className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-3xl font-semibold mb-4 text-white uppercase tracking-tight">Nyayadhish Intelligence</h3>
                <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
                  A multi-stage expert system grounded in the Bharatiya Nyaya Sanhita (BNS). 
                  Classifies offences and interprets legal procedures in real-time.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-4">
                <Badge className="bg-white/5 text-slate-400 border-white/10">BNS v1.0</Badge>
                <div className="h-px flex-1 bg-white/5" />
                <span className="text-xs font-mono text-slate-600">AGENTIC WORKFLOW</span>
              </div>
            </SpotlightCard>

            {/* Evidence Feature */}
            <SpotlightCard className="md:col-span-4 p-8 flex flex-col justify-center h-full">
              <Shield className="w-10 h-10 text-emerald-400 mb-6" />
              <h3 className="text-xl font-semibold mb-2 text-white">Immutable Vault</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                SHA-256 cryptographic hashing ensures the historical integrity of your case evidence.
              </p>
              <Button variant="ghost" className="p-0 h-auto text-blue-400 hover:text-blue-300 flex items-center gap-2 group">
                Review security protocols <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </SpotlightCard>

            {/* Docs Feature */}
            <SpotlightCard className="md:col-span-4 p-8 h-full bg-slate-900/20">
              <Files className="w-8 h-8 text-slate-400 mb-6" />
              <h3 className="text-lg font-semibold mb-2 text-white">Document Architect</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Automated drafting of regular bail applications and FIR request letters.
              </p>
            </SpotlightCard>

            {/* Language Feature */}
            <SpotlightCard className="md:col-span-4 p-8 flex items-center gap-8 h-full bg-slate-900/20">
              <div className="shrink-0">
                <Globe className="w-10 h-10 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Regional Depth</h3>
                <p className="text-slate-500 text-sm">Vernacular support for judicial nuances in KA/MH/DL jurisdictions.</p>
              </div>
            </SpotlightCard>

            {/* Stats Feature */}
            <SpotlightCard className="md:col-span-4 p-8 bg-blue-600/5 h-full">
               <Gavel className="w-8 h-8 text-blue-400 mb-4" />
               <h3 className="text-lg font-semibold text-white">Procedural Scripts</h3>
               <p className="text-slate-500 text-sm">Empowerment through knowledge of court etiquette and rights.</p>
            </SpotlightCard>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-32 px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-medium mb-12 tracking-tight text-white uppercase italic">"Justice delayed is justice denied."</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-slate-500 border-t border-white/5 pt-12">
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl font-light text-white">400k+</span>
              <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Undertrials</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl font-light text-white">12h</span>
              <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Response Time</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl font-light text-white">100%</span>
              <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Encryption</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl font-light text-white">24/7</span>
              <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Assistance</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Badge({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${className}`}>
      {children}
    </span>
  );
}


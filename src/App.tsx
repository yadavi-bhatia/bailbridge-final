import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Scale, 
  MessageSquare, 
  LayoutDashboard, 
  Files, 
  Calendar, 
  ShieldCheck, 
  MapPin, 
  Menu, 
  X,
  Lock,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import LandingPage from './pages/LandingPage';
import ChatAgent from './pages/ChatAgent';
import Dashboard from './pages/Dashboard';
import HearingTracker from './pages/HearingTracker';
import EvidenceVault from './pages/EvidenceVault';
import DocumentArchitect from './pages/DocumentArchitect';
import LegalAid from './pages/LegalAid';
import FamilyScripts from './pages/FamilyScripts';
import FullIntake from './pages/FullIntake';

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'NYAYA AGENT', path: '/chat', icon: MessageSquare },
    { name: 'INTAKE', path: '/intake', icon: FileText },
    { name: 'CASE MONITOR', path: '/dashboard', icon: LayoutDashboard },
    { name: 'HEARINGS', path: '/hearings', icon: Calendar },
    { name: 'LEGAL AID', path: '/legal-aid', icon: ShieldCheck },
    { name: 'FAMILY SCRIPTS', path: '/scripts', icon: MessageSquare },
    { name: 'EVIDENCE VAULT', path: '/evidence', icon: Lock },
    { name: 'DOC ARCHITECT', path: '/documents', icon: Files },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5 px-6 h-20 flex items-center justify-between">
      <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.location.href = '/'}>
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-transform group-hover:scale-105">
          <Scale className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold tracking-tight text-white leading-none">BAILBRIDGE</span>
          <span className="text-[9px] font-black tracking-[0.2em] text-blue-400 mt-1 uppercase">Justice Architect</span>
        </div>
      </div>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-10">
        {navItems.map((item) => (
          <Link 
            key={item.path}
            to={item.path} 
            className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] transition-all hover:text-blue-400 ${
              location.pathname === item.path ? 'text-blue-400' : 'text-slate-500'
            }`}
          >
            <item.icon className="w-3.5 h-3.5" />
            {item.name}
          </Link>
        ))}
        <div className="h-6 w-px bg-white/10" />
        <Button size="sm" className="bg-white text-black hover:bg-slate-200 rounded-lg font-bold px-6 text-[10px] uppercase tracking-wider h-10">
          PRO LOGIN
        </Button>
      </div>

      {/* Mobile Nav */}
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger render={<Button variant="ghost" size="icon" className="text-slate-400" />}>
            <Menu className="w-6 h-6" />
          </SheetTrigger>
          <SheetContent side="right" className="bg-slate-950 border-white/5 text-white p-8">
            <div className="flex flex-col gap-8 mt-12">
              {navItems.map((item) => (
                <Link 
                  key={item.path}
                  to={item.path} 
                  onClick={() => setIsOpen(false)}
                  className={`flex flex-col items-start transition-colors hover:text-blue-400 ${
                    location.pathname === item.path ? 'text-blue-400' : 'text-slate-500'
                  }`}
                >
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] mb-1">{item.name}</span>
                  <div className={`h-1 w-8 bg-blue-600 rounded-full transition-all ${location.pathname === item.path ? 'opacity-100' : 'opacity-0'}`} />
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen text-slate-100 selection:bg-blue-500/30 font-sans">
        <Navigation />
        <main className="pt-20 pb-24">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/chat" element={<ChatAgent />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/hearings" element={<HearingTracker />} />
            <Route path="/evidence" element={<EvidenceVault />} />
            <Route path="/documents" element={<DocumentArchitect />} />
            <Route path="/legal-aid" element={<LegalAid />} />
            <Route path="/scripts" element={<FamilyScripts />} />
            <Route path="/intake" element={<FullIntake />} />
          </Routes>
        </main>
        
        {/* Multilingual Disclaimer Overlay (Bottom) */}
        <div className="fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-md border-t border-white/5 py-4 px-6 text-center z-[60]">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 text-[9px] text-slate-500 font-medium leading-relaxed">
            <p>“This is legal information, not legal advice. Consult a qualified advocate before acting.”</p>
            <p>“यह कानूनी जानकारी है, कानूनी सलाह नहीं। एक योग्य वकील से सलाह लें।”</p>
            <p>“ಇದು ಕಾನೂನು ಮಾಹಿತಿ, ಕಾನೂನು ಸಲಹೆಯಲ್ಲ. ಅರ್ಹ ವಕೀಲರನ್ನು ಸಮಾಲೋಚಿಸಿ.”</p>
          </div>
        </div>
      </div>
    </Router>
  );
}

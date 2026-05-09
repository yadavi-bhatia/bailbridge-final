import { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Upload, 
  File, 
  CheckCircle2, 
  Clock, 
  Lock,
  ArrowUpRight,
  Database,
  ExternalLink,
  ShieldCheck,
  Search,
  Activity,
  ShieldAlert,
  FileText,
  LockKeyhole,
  Unlock,
  KeyRound,
  Trash2,
  AlertCircle,
  Hash,
  Eye,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { SpotlightCard } from '@/src/components/SpotlightCard';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Evidence {
  id: string;
  displayName: string;
  description: string;
  fileName: string;
  type: string;
  hash: string;
  timestamp: string;
  status: 'verified' | 'pending';
  size: string;
}

export default function EvidenceVault() {
  const navigate = useNavigate();
  const [evidenceItems, setEvidenceItems] = useState<Evidence[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Upload Form State
  const [uploadForm, setUploadForm] = useState({
    name: '',
    description: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Vault Lock State
  const [vaultPassword, setVaultPassword] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPasswordSetup, setShowPasswordSetup] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load persisted data
    const savedItems = localStorage.getItem('bailbridge_vault_items');
    if (savedItems) setEvidenceItems(JSON.parse(savedItems));

    const savedPass = localStorage.getItem('bailbridge_vault_password');
    if (savedPass) setVaultPassword(savedPass);
  }, []);

  useEffect(() => {
    localStorage.setItem('bailbridge_vault_items', JSON.stringify(evidenceItems));
  }, [evidenceItems]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleUploadSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !uploadForm.name) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Mock hash generation
    const mockHash = Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    setTimeout(() => {
      const newItem: Evidence = {
        id: Date.now().toString(),
        displayName: uploadForm.name,
        description: uploadForm.description,
        fileName: selectedFile.name,
        type: selectedFile.type || 'application/octet-stream',
        size: `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`,
        hash: mockHash,
        timestamp: new Date().toLocaleString(),
        status: 'verified'
      };

      setEvidenceItems(prev => [newItem, ...prev]);
      setIsUploading(false);
      setUploadForm({ name: '', description: '' });
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }, 2000);
  };

  const setupPassword = () => {
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    if (newPassword.length < 4) {
      setPasswordError('Password too short');
      return;
    }
    localStorage.setItem('bailbridge_vault_password', newPassword);
    setVaultPassword(newPassword);
    setShowPasswordSetup(false);
    setIsUnlocked(true);
    setPasswordError('');
  };

  const unlockVault = () => {
    if (passwordInput === vaultPassword) {
      setIsUnlocked(true);
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password');
    }
  };

  const lockVault = () => {
    setIsUnlocked(false);
    setPasswordInput('');
  };

  return (
    <div className="min-h-screen bg-[#0a0c12] text-slate-200 selection:bg-teal-500/30 -mt-20 pt-28 pb-20">
      <div className="max-w-[1280px] mx-auto px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b border-white/5 pb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
               <div className="w-6 h-6 rounded bg-teal-500/10 flex items-center justify-center text-teal-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
               </div>
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-teal-400">Zero-Trust • End-to-End Encrypted</span>
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight uppercase leading-none mb-4">Evidence Vault</h1>
            <p className="text-slate-500 max-w-2xl text-sm italic leading-relaxed font-medium">
              Secure digital repository for sensitive case documents, multimedia files, and alibi evidence.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right mr-4 hidden md:block">
               <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Vault Status</p>
               <p className={`text-xs font-bold ${isUnlocked ? 'text-teal-400' : 'text-rose-400'}`}>
                 {isUnlocked ? 'DECRYPTED & UNLOCKED' : 'ENCRYPTED & LOCKED'}
               </p>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-500 ${isUnlocked ? 'bg-teal-500/10 border-teal-500/30 text-teal-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'}`}>
               {isUnlocked ? <Unlock className="w-5 h-5" /> : <LockKeyhole className="w-5 h-5" />}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Upload Experience */}
          <div className="lg:col-span-5 space-y-8">
            <SpotlightCard className="p-8 bg-[#11131c] border-white/5" spotlightColor="rgba(20, 184, 166, 0.05)">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                   <Upload className="w-5 h-5" />
                </div>
                <div>
                   <h2 className="text-lg font-black text-white uppercase tracking-tight">Deposit Evidence</h2>
                   <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Immutable Chain of Custody</p>
                </div>
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-2 block">Document Name (Required)</label>
                    <Input 
                      placeholder="e.g., CCTV Footage_MainGate_12May" 
                      className="bg-black/40 border-white/5 h-12 text-sm focus:border-teal-500/50 transition-all"
                      value={uploadForm.name}
                      onChange={(e) => setUploadForm({...uploadForm, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-2 block">Notes / Context (Optional)</label>
                    <textarea 
                      placeholder="Brief description of how this aids the case..." 
                      className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-sm focus:outline-none focus:border-teal-500/50 transition-all min-h-[100px] resize-none"
                      value={uploadForm.description}
                      onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                    />
                  </div>
                </div>

                <div 
                  className={`border-2 border-dashed rounded-3xl p-10 text-center transition-all cursor-pointer group ${selectedFile ? 'border-teal-500/50 bg-teal-500/[0.02]' : 'border-white/5 bg-[#0a0c12]/40 hover:border-blue-500/30'}`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  <div className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-all group-hover:scale-110 ${selectedFile ? 'bg-teal-500/20 text-teal-400' : 'bg-blue-500/10 text-blue-400'}`}>
                    <Upload className="w-6 h-6" />
                  </div>
                  {selectedFile ? (
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-white pr-2 truncate">{selectedFile.name}</p>
                      <p className="text-[10px] text-teal-500 font-black uppercase tracking-widest">{(selectedFile.size / (1024*1024)).toFixed(2)} MB • Ready</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                       <p className="text-sm font-bold text-slate-300">Click or drag & drop</p>
                       <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Max 500MB per file</p>
                    </div>
                  )}
                </div>

                {isUploading ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest">
                       <span className="text-blue-400">Encrypting & Uploading</span>
                       <span className="text-slate-500">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-1.5 bg-white/5" indicatorClassName="bg-blue-500" />
                  </div>
                ) : (
                  <Button 
                    type="submit" 
                    disabled={!selectedFile || !uploadForm.name}
                    className={`w-full h-14 font-black text-xs uppercase tracking-[0.2em] shadow-xl transition-all ${!selectedFile || !uploadForm.name ? 'bg-slate-800 text-slate-600' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20'}`}
                  >
                     Secure Deposit to Vault
                  </Button>
                )}
              </form>
            </SpotlightCard>

            <div className="p-6 bg-amber-500/5 border border-amber-500/10 rounded-3xl flex gap-4">
               <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
               <div className="space-y-1">
                  <h4 className="text-[10px] font-black uppercase text-amber-500 tracking-widest">Chain of Custody Notice</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                    Evidence deposited here is cryptographically hashed. Modifying the original file will break the verification seal.
                  </p>
               </div>
            </div>
          </div>

          {/* Right Column: Protected Vault Access */}
          <div className="lg:col-span-7 space-y-8">
            <div className="flex items-center justify-between mb-2">
                 <div className="flex items-center gap-3">
                    <Database className="w-4 h-4 text-slate-600" />
                    <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Vault Documents</h2>
                 </div>
                 {isUnlocked && (
                   <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase text-rose-400 hover:text-rose-300" onClick={lockVault}>
                      <Lock className="w-3.5 h-3.5 mr-2" /> Lock Vault
                   </Button>
                 )}
            </div>

            <div className="relative min-h-[500px]">
              <AnimatePresence mode="wait">
                {/* Case 1: No Password Set */}
                {!vaultPassword && !showPasswordSetup && (
                  <motion.div 
                    key="no-pass"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center gap-6 p-12 bg-white/[0.02] border border-dashed border-white/10 rounded-[40px] text-center"
                  >
                    <div className="w-20 h-20 rounded-[30px] bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                       <ShieldAlert className="w-10 h-10" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-white tracking-tight">Vault Access Unconfigured</h3>
                      <p className="text-sm text-slate-500 max-w-xs mx-auto">Sensitive documents require a parent-level access key for viewing.</p>
                    </div>
                    <Button 
                      onClick={() => setShowPasswordSetup(true)}
                      className="bg-amber-600 hover:bg-amber-500 text-white font-black uppercase h-14 px-8 tracking-widest text-[10px]"
                    >
                      Set Vault Password & Lock
                    </Button>
                  </motion.div>
                )}

                {/* Case 2: Password Setup */}
                {showPasswordSetup && (
                  <motion.div 
                    key="setup"
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                    className="p-10 bg-[#11131c] border border-teal-500/20 rounded-[40px] shadow-2xl shadow-teal-900/10"
                  >
                    <div className="text-center mb-10">
                       <KeyRound className="w-12 h-12 text-teal-400 mx-auto mb-4" />
                       <h3 className="text-xl font-bold text-white tracking-tight">Configure Secure Access</h3>
                       <p className="text-xs text-slate-500 mt-2">Enter a password to encrypt your vault view.</p>
                    </div>
                    <div className="space-y-6 max-w-sm mx-auto">
                       <Input 
                        type="password" 
                        placeholder="New Password" 
                        className="h-14 bg-black/40 text-center font-mono tracking-[0.5em]"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                       />
                       <Input 
                        type="password" 
                        placeholder="Confirm Password" 
                        className="h-14 bg-black/40 text-center font-mono tracking-[0.5em]"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                       />
                       {passwordError && <p className="text-[10px] text-rose-500 text-center font-bold uppercase">{passwordError}</p>}
                       <div className="flex gap-4">
                          <Button variant="ghost" className="flex-1 h-12 text-[10px] font-black uppercase tracking-widest" onClick={() => setShowPasswordSetup(false)}>Cancel</Button>
                          <Button className="flex-1 bg-teal-600 hover:bg-teal-500 text-white h-12 text-[10px] font-black uppercase tracking-widest" onClick={setupPassword}>Apply Lock</Button>
                       </div>
                    </div>
                  </motion.div>
                )}

                {/* Case 3: Locked Vault */}
                {vaultPassword && !isUnlocked && (
                  <motion.div 
                    key="locked"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center gap-8 p-20 bg-[#11131c]/50 backdrop-blur-xl border border-white/5 rounded-[40px] text-center h-[500px]"
                  >
                    <div className="relative">
                       <div className="absolute inset-0 bg-rose-500/20 blur-3xl animate-pulse" />
                       <div className="w-24 h-24 rounded-[32px] bg-[#0a0c12] border border-rose-500/30 flex items-center justify-center text-rose-500 relative z-10">
                          <Lock className="w-10 h-10" />
                       </div>
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Decryption Key Required</h3>
                      <p className="text-[11px] text-slate-600 uppercase font-black tracking-[0.3em]">Vault contents are currently hidden</p>
                    </div>
                    <div className="w-full max-w-xs space-y-4">
                       <Input 
                        type="password" 
                        placeholder="••••••••" 
                        className="h-14 bg-black/60 text-center font-mono tracking-[1em] text-white border-white/10 focus:border-rose-500/40"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && unlockVault()}
                       />
                       {passwordError && <p className="text-[10px] text-rose-500 font-bold uppercase">{passwordError}</p>}
                       <Button 
                        onClick={unlockVault}
                        className="w-full bg-slate-100 hover:bg-white text-slate-950 font-black uppercase py-7 tracking-widest text-[11px]"
                       >
                         Unlock Repository
                       </Button>
                    </div>
                  </motion.div>
                )}

                {/* Case 4: Unlocked & Content */}
                {isUnlocked && (
                  <motion.div 
                    key="content"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    {evidenceItems.length === 0 ? (
                      <div className="text-center p-20 border border-dashed border-white/5 rounded-3xl">
                         <Info className="w-10 h-10 text-slate-800 mx-auto mb-4" />
                         <p className="text-slate-600 font-bold uppercase text-[11px] tracking-widest">No Documents Discovered</p>
                      </div>
                    ) : (
                      <ScrollArea className="h-[600px] pr-4">
                         {evidenceItems.map((item) => (
                           <div key={item.id}>
                             <EvidenceCard item={item} />
                           </div>
                         ))}
                      </ScrollArea>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-slate-700" />
              <p className="text-[10px] text-slate-700 font-bold uppercase tracking-[0.2em]">BailBridge Cryptographic Module v2.0</p>
           </div>
           <div className="flex gap-4">
              <Button variant="ghost" className="text-[10px] font-black uppercase text-slate-500 tracking-widest hover:text-white transition-colors">Usage Logs</Button>
              <Button variant="ghost" className="text-[10px] font-black uppercase text-slate-500 tracking-widest hover:text-white transition-colors">Privacy Shield</Button>
           </div>
        </div>
      </div>
    </div>
  );
}

function EvidenceCard({ item }: { item: Evidence }) {
  return (
    <SpotlightCard className="p-6 bg-[#11131c]/60 border-white/5 hover:border-teal-500/20 transition-all group mb-4" spotlightColor="rgba(20, 184, 166, 0.05)">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Thumbnail Replacement */}
        <div className="w-20 h-24 lg:w-24 lg:h-32 rounded-2xl bg-black/40 border border-white/5 flex flex-col items-center justify-center shrink-0 group-hover:border-teal-500/20 transition-all">
           <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 mb-2">
             <FileText className="w-5 h-5" />
           </div>
           <span className="text-[8px] font-black uppercase text-slate-700 tracking-widest">Preview</span>
        </div>

        <div className="flex-1 space-y-4">
           <div className="flex items-start justify-between">
              <div>
                 <h4 className="text-base font-bold text-white tracking-tight uppercase group-hover:text-teal-400 transition-colors">{item.displayName}</h4>
                 <div className="flex items-center gap-3 mt-1">
                    <p className="text-[11px] text-slate-500 font-medium italic">{item.description || 'No description provided'}</p>
                    <span className="w-1 h-1 rounded-full bg-slate-800" />
                    <span className="text-[10px] font-mono text-slate-600 font-bold">{item.size}</span>
                 </div>
              </div>
              <div className="flex items-center gap-2">
                 <Badge className="bg-teal-500/10 text-teal-500 border-none px-3 py-1 text-[8px] font-bold tracking-widest uppercase">
                   <CheckCircle2 className="w-2.5 h-2.5 mr-1.5 inline" /> Verified
                 </Badge>
                 <Button variant="ghost" size="sm" className="h-8 w-8 text-slate-700 hover:text-white">
                    <ExternalLink className="w-4 h-4" />
                 </Button>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/5">
              <div className="bg-black/20 p-3 rounded-xl border border-white/[0.02]">
                 <div className="flex items-center gap-2 mb-1.5">
                    <Hash className="w-3 h-3 text-slate-600" />
                    <span className="text-[9px] font-black uppercase text-slate-600 tracking-widest">Fingerprint (SHA256)</span>
                 </div>
                 <p className="text-[10px] font-mono text-slate-500 truncate">{item.hash}</p>
              </div>
              <div className="bg-black/20 p-3 rounded-xl border border-white/[0.02]">
                 <div className="flex items-center gap-2 mb-1.5">
                    <Clock className="w-3 h-3 text-slate-600" />
                    <span className="text-[9px] font-black uppercase text-slate-600 tracking-widest">Entry Timestamp</span>
                 </div>
                 <p className="text-[10px] font-mono text-teal-500/70 font-bold">{item.timestamp}</p>
              </div>
           </div>
        </div>
      </div>
    </SpotlightCard>
  );
}

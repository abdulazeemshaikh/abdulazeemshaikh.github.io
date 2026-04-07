import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Instagram, Mail, ArrowUpRight, Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import { TextShimmer } from './components/TextShimmer';
import ResponsiveHeroBanner from './components/ResponsiveHeroBanner';
import { LiquidMetalButton } from './components/LiquidMetalButton';
import { UnicornBackground } from './components/UnicornBackground';
import { SplineBackground } from './components/SplineBackground';
// ...

export default function App() {
  const [formName, setFormName] = useState<string>('');
  const [formContact, setFormContact] = useState<string>('');
  const [showForm, setShowForm] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const [investFormName, setInvestFormName] = useState<string>('');
  const [investFormContact, setInvestFormContact] = useState<string>('');
  const [investFormAmount, setInvestFormAmount] = useState<string>('');
  const [showInvestForm, setShowInvestForm] = useState<boolean>(false);
  const [isInvestSubmitted, setIsInvestSubmitted] = useState<boolean>(false);
  const [showComingSoon, setShowComingSoon] = useState<boolean>(false);

  const projects = [
    {
      id: 'zalt',
      title: 'ZALT',
      tagline: 'Your self‑improving personal AI companion that can do everything',
      description: 'It is able to automate, run and control your entire life. It understands you and your language. No tricky prompts. No learning special commands. Just talk to it like a friend, and it handles your entire life. It gets smarter on its own, every single day. And when you need it to, it becomes your entire operating system. Simple. Powerful. Yours.',
      color: 'from-blue-500/20 to-purple-500/20'
    },
    {
      id: 'crystals',
      title: 'CRYSTALS',
      tagline: 'Making life simple',
      description: 'Crystals are modular, lightweight apps that save you time and money. Built privacy-first, each Crystal replaces a bloated SaaS tool you\'d otherwise pay for monthly.',
      color: 'from-amber-500/20 to-yellow-500/20'
    },
    {
      id: 'auren',
      title: 'AUREN',
      tagline: 'Hardware that disappears so you can focus.',
      description: 'Hardware that disappears so you can focus. AUREN builds the simplest, most powerful devices on Earth: computers, phones, headphones, and AR glasses. Under the hood, our custom chips and the Photon light‑based processor crush everything else while sipping power. The Data Vault replaces entire data centers with a tiny box that uses 99% less electricity. Clean, fast, invisible.',
      color: 'from-purple-500/20 to-pink-500/20'
    },
    {
      id: 'azureim',
      title: 'AZUREIM',
      tagline: 'Travel without limits, on Earth and beyond.',
      description: 'Travel without limits, on Earth and beyond. AZUREIM makes movement effortless and instant. Air‑powered bikes, floating cars, hybrid planes, cargo airships, and rockets that launch with a spin and air propulsion. We\'re building the space elevator and selling real estate in orbit. Getting anywhere—or off the planet—has never been smoother or faster.',
      color: 'from-cyan-500/20 to-blue-500/20'
    },
    {
      id: 'intrinsic',
      title: 'INTRINSIC',
      tagline: 'Robots that care, materials that change everything.',
      description: 'Robots that care, materials that change everything. INTRINSIC builds personal robots that clean your teeth, cut your nails and hair, park your car, and even project live translations inside mosques. Our Colossus Lab creates graphene, antimatter, and quantum tech. And we wirelessly beam electricity through air while harvesting wind from passing cars. The physical world, automated and upgraded.',
      color: 'from-orange-500/20 to-red-500/20'
    },
    {
      id: 'elemental',
      title: 'ELEMENTAL',
      tagline: 'Pure essentials for a cleaner life.',
      description: 'Pure essentials for a cleaner life. ELEMENTAL gives you food with no preservatives, water that\'s the cheapest and cleanest on Earth, and utensils you can eat or compost. No gimmicks, no waste, no complexity. Just natural, honest products that are good for you and the planet.',
      color: 'from-green-500/20 to-teal-500/20'
    }
  ];

  const activeProjects = projects.filter(p => p.id === 'zalt' || p.id === 'crystals');
  const comingSoonProjects = projects.filter(p => p.id !== 'zalt' && p.id !== 'crystals');

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    const email = 'abdulazeemshaikhbusiness@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // ...
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const waitlistData = {
      name: formName,
      contact: formContact,
      timestamp: new Date().toISOString()
    };
    
    // Mock saving to localStorage since Firebase was declined
    const existingWaitlist = JSON.parse(localStorage.getItem('waitlist_responses') || '[]');
    existingWaitlist.push(waitlistData);
    localStorage.setItem('waitlist_responses', JSON.stringify(existingWaitlist));
    
    setIsSubmitted(true);
  };

  const handleInvestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const investData = {
      name: investFormName,
      contact: investFormContact,
      amount: investFormAmount,
      timestamp: new Date().toISOString()
    };
    
    const existingInvestments = JSON.parse(localStorage.getItem('investment_interest') || '[]');
    existingInvestments.push(investData);
    localStorage.setItem('investment_interest', JSON.stringify(existingInvestments));
    
    setIsInvestSubmitted(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 20,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.6,
        ease: "easeOut"
      },
    },
  };

  const sectionVariants = {
    hidden: { height: 0, opacity: 0, filter: 'blur(10px)' },
    visible: { 
      height: 'auto', 
      opacity: 1, 
      filter: 'blur(0px)',
      transition: {
        height: { duration: 0.4, ease: "easeOut" },
        opacity: { duration: 0.3 },
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FDFDFD] text-zinc-900 font-sans overflow-y-auto flex">
      {/* Full Screen Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
      </div>

      {/* Central Content Area */}
      <main className="flex-1 relative flex flex-col items-center justify-start py-12 md:py-24 px-4 md:px-12 z-10">
        <motion.div
          key="default"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full flex items-center justify-center"
        >
          <div className="flex flex-col gap-4 w-full max-w-7xl mx-auto items-center">
            <ResponsiveHeroBanner 
              greetingNode={
                  <div className="flex flex-col items-center justify-center gap-1">
                    <motion.div variants={itemVariants} className="text-lg text-black/60 whitespace-nowrap">
                      <TextShimmer>
                        {`${getGreeting()}!`}
                      </TextShimmer>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="flex flex-row items-center gap-2.5 text-black/40">
                      <span className="text-sm mr-1">Abdul Azeem Shaikh</span>
                      <a href="https://www.instagram.com/abdulazeemshaikhh/" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">
                        <Instagram size={18} strokeWidth={1.5} />
                      </a>
                      <a href="https://x.com/abdulazeem_s" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </a>
                      <div className="relative flex items-center">
                        <button 
                          onClick={handleCopyEmail}
                          className="hover:text-black transition-all relative group/mail flex items-center justify-center w-8 h-8 rounded-full hover:bg-black/5 active:scale-95"
                        >
                          <AnimatePresence mode="wait">
                            {copied ? (
                              <motion.div
                                key="check"
                                initial={{ scale: 0, opacity: 0, rotate: -45 }}
                                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                exit={{ scale: 0, opacity: 0, rotate: 45 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                              >
                                <Check size={18} strokeWidth={2} className="text-green-600" />
                              </motion.div>
                            ) : (
                              <motion.div
                                key="mail"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Mail size={18} strokeWidth={1.5} />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </button>
                      </div>
                    </motion.div>

                    <div className="mt-2 flex flex-col items-center gap-4">
                      <motion.div variants={itemVariants} className="flex items-center justify-center gap-4">
                        <LiquidMetalButton 
                          label="INVEST"
                          width={80}
                          onClick={() => {
                            setShowInvestForm(!showInvestForm);
                            setShowForm(false);
                          }}
                        />
                      </motion.div>
                    </div>
                    
                    <motion.div 
                      variants={containerVariants}
                      className="mt-4 flex flex-wrap justify-center gap-1 sm:gap-4 w-full pb-8"
                    >
                      {activeProjects.map((project) => (
                        <div key={project.id} className="flex flex-col gap-4 w-[260px]">
                          <motion.div 
                            variants={cardVariants}
                            className={`bg-white p-6 rounded-none text-left relative group min-h-[320px] h-auto w-full transition-all duration-500 ease-in-out overflow-hidden border border-black/5`}
                          >
                            {/* Soft Gradient Background */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-40 blur-3xl -z-10`} />
                            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-white to-transparent -z-10" />
                            
                            {project.id !== 'zalt' && project.id !== 'crystals' && (
                              <div className="absolute top-4 right-4 z-20">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-black/20 bg-black/5 px-2 py-0.5 rounded-sm">
                                  Coming Soon
                                </span>
                              </div>
                            )}
                            
                            <div className="flex flex-col min-h-[272px] justify-between relative z-10">
                              <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                  <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${project.color.replace('/20', '')} shadow-sm`} />
                                  <span className="text-sm font-bold tracking-tight text-black">
                                    {project.title}
                                  </span>
                                </div>
                                <h3 className="text-lg font-medium leading-tight text-black/80">
                                  {project.tagline}
                                </h3>

                                <div className="overflow-hidden">
                                  <p className="text-[11px] text-black/50 leading-relaxed font-medium mt-2">
                                    {project.description}
                                  </p>
                                </div>

                                {project.id === 'zalt' && (
                                  <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="pt-2"
                                  >
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setShowForm(true);
                                        setShowInvestForm(false);
                                      }}
                                      className="px-4 py-2 border border-black text-black bg-transparent hover:bg-black hover:text-white rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 active:scale-95 w-fit"
                                    >
                                      Get early access
                                    </button>
                                  </motion.div>
                                )}
                              </div>
                              
                              <div className="flex justify-end mt-4">
                                {(project.id === 'zalt' || project.id === 'crystals') && (
                                  <div className="flex items-center justify-center transition-all duration-300">
                                    <ArrowUpRight size={18} className="text-black/40" />
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      ))}
                    </motion.div>

                    {/* Coming Soon Section Toggle */}
                    <motion.div variants={itemVariants} className="w-full flex flex-col items-center">
                      <button 
                        onClick={() => setShowComingSoon(!showComingSoon)}
                        className="flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-widest text-black/40 hover:text-black transition-all group"
                      >
                        <span>Upcoming Projects</span>
                        <motion.div
                          animate={{ rotate: showComingSoon ? 180 : 0 }}
                          transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        >
                          <ChevronDown size={14} />
                        </motion.div>
                      </button>

                      <AnimatePresence>
                        {showComingSoon && (
                          <motion.div
                            variants={sectionVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className="overflow-hidden w-full"
                          >
                            <motion.div 
                              variants={containerVariants}
                              className="pt-8 flex flex-wrap justify-center gap-1 sm:gap-4 w-full pb-12"
                            >
                              {comingSoonProjects.map((project) => (
                                <div key={project.id} className="flex flex-col gap-4 w-[260px]">
                                  <motion.div 
                                    variants={cardVariants}
                                    className={`bg-white p-6 rounded-none text-left relative group min-h-[320px] h-auto w-full transition-all duration-500 ease-in-out overflow-hidden border border-black/5`}
                                  >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-40 blur-3xl -z-10`} />
                                    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-white to-transparent -z-10" />
                                    
                                    <div className="absolute top-4 right-4 z-20">
                                      <span className="text-[9px] font-bold uppercase tracking-widest text-black/20 bg-black/5 px-2 py-0.5 rounded-sm">
                                        Coming Soon
                                      </span>
                                    </div>
                                    
                                    <div className="flex flex-col min-h-[272px] justify-between relative z-10">
                                      <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                          <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${project.color.replace('/20', '')} shadow-sm`} />
                                          <span className="text-sm font-bold tracking-tight text-black">
                                            {project.title}
                                          </span>
                                        </div>
                                        <h3 className="text-lg font-medium leading-tight text-black/80">
                                          {project.tagline}
                                        </h3>

                                        <div className="overflow-hidden">
                                          <p className="text-[11px] text-black/50 leading-relaxed font-medium mt-2">
                                            {project.description}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                </div>
                              ))}
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>
              }
            />
          </div>

          <AnimatePresence>
            {(showForm || showInvestForm) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  setShowForm(false);
                  setShowInvestForm(false);
                }}
                className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[90]"
              />
            )}

            {showForm && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0, filter: 'blur(10px)', x: '-50%', y: '-50%' }}
                  animate={{ scale: 1, opacity: 1, filter: 'blur(0px)', x: '-50%', y: '-50%' }}
                  exit={{ scale: 0.9, opacity: 0, filter: 'blur(10px)', x: '-50%', y: '-50%' }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="fixed left-1/2 top-1/2 w-full max-w-[360px] bg-white border border-black/5 z-[100] p-8 rounded-[32px] flex flex-col shadow-2xl shadow-black/10"
                >
                  <button 
                    onClick={() => setShowForm(false)}
                    className="absolute top-6 right-6 text-black/20 hover:text-black transition-colors"
                  >
                    <X size={20} />
                  </button>
                  <div className="mt-2" />

                {isSubmitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-8 flex flex-col items-center justify-center text-center gap-3"
                  >
                    <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center mb-2">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
                      >
                        <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                    </div>
                    <h3 className="text-xl text-black">Thank you</h3>
                  </motion.div>
                ) : (
                  <motion.form 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    onSubmit={handleWaitlistSubmit}
                    className="flex flex-col gap-3"
                  >
                    <motion.div variants={itemVariants} className="flex flex-col gap-1.5 text-left">
                      <label className="text-xs text-black/40">
                        Name
                      </label>
                      <div className="relative w-full">
                        <input 
                          type="text" 
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          placeholder="Full name or first name"
                          className="w-full bg-black/5 border border-black/5 rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-black/5 text-black text-sm placeholder:text-black/20 placeholder:text-[11px] transition-all" 
                        />
                      </div>
                    </motion.div>
                
                    <motion.div variants={itemVariants} className="flex flex-col gap-1.5 text-left">
                      <label className="text-xs text-black/40">
                        Contact
                      </label>
                      <div className="relative w-full">
                        <textarea 
                          rows={3}
                          value={formContact}
                          onChange={(e) => setFormContact(e.target.value)}
                          placeholder="Email, Socials and/or Phone number"
                          className="w-full bg-black/5 border border-black/5 rounded-[18px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/5 text-black text-sm placeholder:text-black/20 placeholder:text-[11px] transition-all resize-none" 
                        />
                      </div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="mt-0.5 flex justify-center">
                      <button 
                        type="submit"
                        disabled={!formName.trim() || !formContact.trim()}
                        className="px-8 py-2.5 bg-black text-white rounded-full text-sm hover:bg-black/90 transition-all disabled:opacity-20 disabled:cursor-not-allowed active:scale-95"
                      >
                        Join waitlist
                      </button>
                    </motion.div>
                  </motion.form>
                )}
              </motion.div>
            )}

            {showInvestForm && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0, filter: 'blur(10px)', x: '-50%', y: '-50%' }}
                  animate={{ scale: 1, opacity: 1, filter: 'blur(0px)', x: '-50%', y: '-50%' }}
                  exit={{ scale: 0.9, opacity: 0, filter: 'blur(10px)', x: '-50%', y: '-50%' }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="fixed left-1/2 top-1/2 w-full max-w-[360px] bg-white border border-black/5 z-[100] p-8 rounded-[32px] flex flex-col shadow-2xl shadow-black/10"
                >
                  <button 
                    onClick={() => setShowInvestForm(false)}
                    className="absolute top-6 right-6 text-black/20 hover:text-black transition-colors"
                  >
                    <X size={20} />
                  </button>
                  <div className="mt-2" />

                {isInvestSubmitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-8 flex flex-col items-center justify-center text-center gap-3"
                  >
                    <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center mb-2">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
                      >
                        <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                    </div>
                    <h3 className="text-xl text-black">Interest received</h3>
                    <p className="text-xs text-black/40">We'll reach out soon.</p>
                  </motion.div>
                ) : (
                  <motion.form 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    onSubmit={handleInvestSubmit}
                    className="flex flex-col gap-3"
                  >
                    <div className="mb-1">
                      <h3 className="text-sm font-bold text-black">Investment Interest</h3>
                      <p className="text-[10px] text-black/40">Help us build the future.</p>
                    </div>

                    <motion.div variants={itemVariants} className="flex flex-col gap-1.5 text-left">
                      <label className="text-xs text-black/40">
                        Full Name
                      </label>
                      <div className="relative w-full">
                        <input 
                          type="text" 
                          value={investFormName}
                          onChange={(e) => setInvestFormName(e.target.value)}
                          placeholder="Full Name"
                          className="w-full bg-black/5 border border-black/5 rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-black/5 text-black text-sm placeholder:text-black/20 placeholder:text-[11px] transition-all" 
                        />
                      </div>
                    </motion.div>
                
                    <motion.div variants={itemVariants} className="flex flex-col gap-1.5 text-left">
                      <label className="text-xs text-black/40">
                        Contact
                      </label>
                      <div className="relative w-full">
                        <textarea 
                          rows={3}
                          value={investFormContact}
                          onChange={(e) => setInvestFormContact(e.target.value)}
                          placeholder="Email, Socials and/or Phone number"
                          className="w-full bg-black/5 border border-black/5 rounded-[18px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/5 text-black text-sm placeholder:text-black/20 placeholder:text-[11px] transition-all resize-none" 
                        />
                      </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="flex flex-col gap-1.5 text-left">
                      <label className="text-xs text-black/40">
                        Target Amount
                      </label>
                      <div className="relative w-full">
                        <input 
                          type="text" 
                          value={investFormAmount}
                          onChange={(e) => setInvestFormAmount(e.target.value)}
                          placeholder="e.g. $10k, $50k..."
                          className="w-full bg-black/5 border border-black/5 rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-black/5 text-black text-sm placeholder:text-black/20 placeholder:text-[11px] transition-all" 
                        />
                      </div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="mt-0.5 flex justify-center">
                      <button 
                        type="submit"
                        disabled={!investFormName.trim() || !investFormContact.trim()}
                        className="px-8 py-2.5 bg-black text-white rounded-full text-sm hover:bg-black/90 transition-all disabled:opacity-20 disabled:cursor-not-allowed active:scale-95"
                      >
                        Submit Interest
                      </button>
                    </motion.div>
                  </motion.form>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* Background Ambient Glow removed */}
    </div>
  );
}

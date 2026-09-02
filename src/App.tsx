import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
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

  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [hoveredWeight, setHoveredWeight] = useState<boolean>(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 250 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX + 15);
      mouseY.set(e.clientY + 15);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const projects = [
    {
      id: 'zalt',
      title: 'ZERODEGREE (ZD)',
      tagline: '',
      description: (
        <>
          ZD is your quiet, capable partner, always close on your phone, laptop, and watch, but never in the way. Talk to it naturally, and it doesn't just answer—it acts. One line can set multiple things in motion: “Order dinner, dim the lights, and text my partner I'm on my way” and it all happens, effortlessly. ZD sits in on meetings for you, takes notes, and gives you a clean summary afterward. Need a fresh system? It spins one up in seconds. It has its own wallet, email, and number, so it can pay, book, and reply like a true assistant. It connects to everything you already use—email, calendar, smart home, files, while keeping your data completely private, right on your device. No cloud, no sharing, no worries. You can type, talk, show a picture, or send a voice note, ZD understands. And it works around the clock, even while you sleep, so you wake up to a day that's already taken care of.
          <br /><br />
          <strong className="font-bold text-black/80">ZD. Effortless. Private. Yours.</strong>
        </>
      ),
      color: 'from-green-500/20 to-teal-500/20'
    }
  ];

  const activeProjects = projects.filter(p => p.id === 'zalt');

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



  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const waitlistData = {
      type: 'waitlist',
      name: formName,
      contact: formContact,
      timestamp: new Date().toISOString()
    };
    
    try {
      const FORMSPREE_ID = 'xgodybnb';
      const endpoint = `https://formspree.io/f/${FORMSPREE_ID}`;
      await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'waitlist',
          name: formName,
          contact: formContact,
          _subject: `New Waitlist Signup: ${formName}`
        }),
      });
    } catch (error) {
      console.error('Submission failed:', error);
    }
    
    // Still save to localStorage as a backup
    const existingWaitlist = JSON.parse(localStorage.getItem('waitlist_responses') || '[]');
    existingWaitlist.push(waitlistData);
    localStorage.setItem('waitlist_responses', JSON.stringify(existingWaitlist));
    
    setIsSubmitted(true);
  };

  const handleInvestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const investData = {
      type: 'invest',
      name: investFormName,
      contact: investFormContact,
      amount: investFormAmount,
      timestamp: new Date().toISOString()
    };
    
    try {
      const FORMSPREE_ID = 'xgodybnb';
      const endpoint = `https://formspree.io/f/${FORMSPREE_ID}`;
      await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'invest',
          name: investFormName,
          contact: investFormContact,
          amount: investFormAmount,
          _subject: `New Investment Interest: ${investFormName}`
        }),
      });
    } catch (error) {
      console.error('Investment submission failed:', error);
    }
    
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
                    

                    <motion.div variants={itemVariants} className="flex flex-row items-center gap-1 text-black/40">
                      <span className="text-sm mr-2">Abdul Azeem Shaikh</span>
                      <div className="flex items-center gap-0.5">
                        <a 
                          href="https://www.instagram.com/abdulazeemshaikhh/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-black transition-all flex items-center justify-center w-8 h-8 rounded-full hover:bg-black/5 active:scale-95"
                        >
                          <Instagram size={18} strokeWidth={1.5} />
                        </a>
                        <a 
                          href="https://x.com/abdulazeem_s" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-black transition-all flex items-center justify-center w-8 h-8 rounded-full hover:bg-black/5 active:scale-95"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
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
                      </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="text-sm text-black/40 mt-1 text-center select-none">
                      I like{' '}
                      <span 
                        onMouseEnter={() => setHoveredCategory('energy')} 
                        onMouseLeave={() => setHoveredCategory(null)} 
                        className="cursor-pointer hover:text-green-600 transition-colors underline decoration-dotted underline-offset-4"
                      >
                        Sustainable Energy
                      </span>
                      ,{' '}
                      <span 
                        onMouseEnter={() => setHoveredCategory('space')} 
                        onMouseLeave={() => setHoveredCategory(null)} 
                        className="cursor-pointer hover:text-blue-500 transition-colors underline decoration-dotted underline-offset-4"
                      >
                        Space
                      </span>
                      ,{' '}
                      <span 
                        onMouseEnter={() => setHoveredCategory('cars')} 
                        onMouseLeave={() => setHoveredCategory(null)} 
                        className="cursor-pointer hover:text-red-500 transition-colors underline decoration-dotted underline-offset-4"
                      >
                        Cars
                      </span>
                      ,{' '}
                      <span 
                        onMouseEnter={() => setHoveredCategory('robots')} 
                        onMouseLeave={() => setHoveredCategory(null)} 
                        className="cursor-pointer hover:text-purple-500 transition-colors underline decoration-dotted underline-offset-4"
                      >
                        Robots
                      </span>
                      {' '}&{' '}
                      <span 
                        onMouseEnter={() => setHoveredCategory('ai')} 
                        onMouseLeave={() => setHoveredCategory(null)} 
                        className="cursor-pointer hover:text-amber-500 transition-colors underline decoration-dotted underline-offset-4"
                      >
                        AI
                      </span>
                    </motion.div>

                    <div className="mt-2 flex flex-col items-center gap-4">
                    </div>
                    
                    <motion.div 
                      variants={containerVariants}
                      className="mt-4 flex flex-wrap justify-center gap-1 sm:gap-4 w-full pb-8"
                    >
                      {activeProjects.filter(p => p.id === 'zalt').map((project) => (
                        <div key={project.id} className="flex flex-col gap-4 w-full max-w-[480px]">
                          <motion.div 
                            variants={cardVariants}
                            onMouseEnter={() => setHoveredCategory('zyfleron')}
                            onMouseLeave={() => setHoveredCategory(null)}
                            className={`bg-white p-6 rounded-none text-left relative group min-h-[320px] h-auto w-full transition-all duration-500 ease-in-out overflow-hidden border border-black/5`}
                          >
                            {/* Soft Gradient Background */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-40 blur-3xl -z-10`} />
                            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-white to-transparent -z-10" />
                            
                            {/* Arrow to zerodegree.ai.studio */}
                            <a 
                               href="https://zerodegree.ai.studio"
                               target="_blank"
                               rel="noopener noreferrer"
                               className="absolute bottom-6 right-6 text-black/30 hover:text-black transition-all duration-300 z-20 hover:scale-110 active:scale-95"
                               title="Visit zerodegree.ai.studio"
                             >
                               <ArrowUpRight size={22} strokeWidth={1.5} />
                             </a>

                            <div className="flex flex-col gap-8 min-h-[272px] relative z-10">
                              {/* Zalt Info */}
                              <div className="w-full flex flex-col justify-between shrink-0">
                                <div className="space-y-4">
                                  <div className="flex items-center justify-center w-full">
                                    <a
                                      href="https://zerodegree.ai.studio"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm font-bold tracking-tight text-black hover:underline cursor-pointer"
                                    >
                                      {project.title}
                                    </a>
                                  </div>
                                  {project.tagline && (
                                    <h3 className="text-lg font-medium leading-tight text-black/80">
                                      {project.tagline}
                                    </h3>
                                  )}

                                  <div className="overflow-hidden">
                                    <p className="text-[11px] text-black/50 leading-relaxed font-medium mt-2">
                                      {project.description}
                                    </p>
                                  </div>
                                </div>

                                  <div className="pt-4">
                                    <LiquidMetalButton 
                                      label="GET EARLY ACCESS"
                                      width={160}
                                      onClick={() => {
                                        window.open('https://zerodegree.ai.studio', '_blank');
                                      }}
                                    />
                                  </div>
                              </div>



                            </div>
                          </motion.div>
                        </div>
                      ))}
                    </motion.div>


                  </div>
              }
            />
          </div>

          <AnimatePresence>
            {hoveredCategory && (
              <motion.div
                style={{
                  position: 'fixed',
                  left: 0,
                  top: 0,
                  x: cursorX,
                  y: cursorY,
                  pointerEvents: 'none',
                  zIndex: 9999,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="text-3xl filter drop-shadow-md select-none"
              >
                {hoveredCategory === 'energy' && '⚡'}
                {hoveredCategory === 'space' && '🚀'}
                {hoveredCategory === 'cars' && '🏎️'}
                {hoveredCategory === 'robots' && '🤖'}
                {hoveredCategory === 'ai' && '🧠'}
                {hoveredCategory === 'zyfleron' && (
                  hoveredWeight ? (
                    <div className="bg-black/90 backdrop-blur-sm text-white text-[10px] tracking-tight font-semibold px-3 py-1.5 rounded-full shadow-2xl border border-white/15 whitespace-nowrap -mt-6 -ml-6 select-none pointer-events-none animate-fade-in">
                      your reminders, your to-dos, the mental load you’ve been dragging
                    </div>
                  ) : (
                    <img src="assets/zalt-feather.png" alt="ZD cursor" className="w-8 h-8 object-contain select-none pointer-events-none" />
                  )
                )}
              </motion.div>
            )}

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

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import { Instagram, Mail, ArrowUpRight, Check, X, ChevronDown, ChevronUp, Heart, MessageCircle, Send, Eye, Pencil, Trash2 } from 'lucide-react';
import { TextShimmer } from './components/TextShimmer';
import ResponsiveHeroBanner from './components/ResponsiveHeroBanner';
import { LiquidMetalButton } from './components/LiquidMetalButton';
import { UnicornBackground } from './components/UnicornBackground';
import { SplineBackground } from './components/SplineBackground';
import CertificatesCarousel from './components/CertificatesCarousel';
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

  // Instagram-style Media Items State
  interface MediaItemData {
    id: string;
    src: string;
    alt: string;
    caption?: string;
  }

  const mediaItems: MediaItemData[] = [
    {
      id: 'moon',
      src: 'assets/moon.png',
      alt: 'Moon visual',
    },
    {
      id: 'silver-emblem',
      src: 'assets/silver-emblem.png',
      alt: 'Emblem visual',
    },
  ];

  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('user_liked_posts');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [postLikes, setPostLikes] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('user_post_likes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [postShares, setPostShares] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('user_post_shares');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [postViews, setPostViews] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('user_post_views');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [uniqueVisitors, setUniqueVisitors] = useState<number | null>(null);
  const visitorCheckStarted = useRef(false);

  interface CommentItem {
    id: string;
    text: string;
  }

  const [postComments, setPostComments] = useState<Record<string, CommentItem[]>>(() => {
    try {
      const saved = localStorage.getItem('user_post_comments');
      if (!saved) return {};
      const parsed = JSON.parse(saved);
      const converted: Record<string, CommentItem[]> = {};
      Object.keys(parsed).forEach((k) => {
        const arr = parsed[k];
        if (Array.isArray(arr)) {
          converted[k] = arr.map((c, i) =>
            typeof c === 'string' ? { id: `local_${k}_${i}`, text: c } : c
          );
        }
      });
      return converted;
    } catch {
      return {};
    }
  });

  const [myCommentIds, setMyCommentIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('user_my_comment_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState<string>('');

  const [savedPosts, setSavedPosts] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('user_saved_posts');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [heartAnimPostId, setHeartAnimPostId] = useState<string | null>(null);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string; id: string } | null>(null);
  const mediaClickTimeout = useRef<number | null>(null);

  const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SHEET_URL || '';

  const syncToBackend = async (payload: { action: string; postId: string; [key: string]: any }) => {
    if (!GOOGLE_SCRIPT_URL) return;
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.warn('Sync failed:', err);
    }
  };

  const fetchGlobalStats = async () => {
    if (!GOOGLE_SCRIPT_URL) return;
    try {
      const res = await fetch(`${GOOGLE_SCRIPT_URL}?action=getAll&t=${Date.now()}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data && typeof data === 'object') {
        if (data.likes) {
          setPostLikes(data.likes);
          localStorage.setItem('user_post_likes', JSON.stringify(data.likes));
        }
        if (data.shares) {
          setPostShares(data.shares);
          localStorage.setItem('user_post_shares', JSON.stringify(data.shares));
        }
        if (data.views) {
          setPostViews(data.views);
          localStorage.setItem('user_post_views', JSON.stringify(data.views));
        }
        if (data.comments) {
          // Unique visitors are stored as hashed visitor IDs in the comments store.
          const visitorEntries = Array.isArray(data.comments['site-visitors-ips'])
            ? data.comments['site-visitors-ips']
            : [];
          const visitorIds = new Set<string>();
          visitorEntries.forEach((entry: any) => {
            const id = typeof entry === 'string' ? entry : entry?.id || entry?.text;
            if (typeof id === 'string' && id.startsWith('visitor_v2_')) visitorIds.add(id);
          });
          setUniqueVisitors(visitorIds.size);

          const formattedComments: Record<string, CommentItem[]> = {};
          Object.keys(data.comments).forEach((postId) => {
            const list = data.comments[postId];
            if (Array.isArray(list)) {
              formattedComments[postId] = list.map((item: any, idx: number) => {
                if (typeof item === 'string') {
                  return { id: `c_${postId}_${idx}`, text: item };
                }
                return { id: item.id || `c_${postId}_${idx}`, text: item.text || '' };
              });
            }
          });
          setPostComments(formattedComments);
          localStorage.setItem('user_post_comments', JSON.stringify(formattedComments));
        }
      }
    } catch {
      // offline or silent fail
    }
  };

  // Poll for global stats from Google Sheet / Apps Script across everyone
  useEffect(() => {
    fetchGlobalStats();
    if (!GOOGLE_SCRIPT_URL) return;
    const interval = setInterval(fetchGlobalStats, 10000);
    return () => clearInterval(interval);
  }, []);

  // Total visitors counter — one count per person/device.
  // A stable device ID is kept in localStorage and a long-lived cookie so
  // refreshes and visits from the same browser never add another count, while
  // different people on the same network are still counted separately.
  useEffect(() => {
    if (!GOOGLE_SCRIPT_URL || visitorCheckStarted.current) return;
    visitorCheckStarted.current = true;

    const getOrCreateVisitorId = () => {
      let visitorId = localStorage.getItem('visitor_device_id_v2') || '';

      if (!visitorId) {
        const cookieMatch = document.cookie.match(/(?:^|;\s*)aas_visitor_v2=([^;]+)/);
        if (cookieMatch) {
          visitorId = decodeURIComponent(cookieMatch[1]);
        }
      }

      if (!visitorId) {
        visitorId = `visitor_v2_${
          window.crypto?.randomUUID
            ? window.crypto.randomUUID().replace(/-/g, '')
            : `${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`
        }`;
      }

      localStorage.setItem('visitor_device_id_v2', visitorId);
      document.cookie = `aas_visitor_v2=${encodeURIComponent(visitorId)}; Max-Age=63072000; Path=/; SameSite=Lax${
        window.location.protocol === 'https:' ? '; Secure' : ''
      }`;

      return visitorId;
    };

    const registerVisitor = async () => {
      const visitorId = getOrCreateVisitorId();

      try {
        const res = await fetch(`${GOOGLE_SCRIPT_URL}?action=getAll&t=${Date.now()}`);
        const data = await res.json();
        const existing = Array.isArray(data?.comments?.['site-visitors-ips'])
          ? data.comments['site-visitors-ips']
          : [];
        const alreadyCounted = existing.some((entry: any) => {
          const id = typeof entry === 'string' ? entry : entry?.id || entry?.text;
          return id === visitorId;
        });

        if (!alreadyCounted) {
          await syncToBackend({
            action: 'comment',
            postId: 'site-visitors-ips',
            commentId: visitorId,
            // The deployed backend returns comment text only, so the visitor
            // ID is written as the text as well as the comment id.
            comment: visitorId,
          });
        }
      } catch {
        // If the check fails, do not add a possibly duplicate count.
        return;
      }

      // Refresh after the write has had time to land.
      window.setTimeout(fetchGlobalStats, 1500);
      window.setTimeout(fetchGlobalStats, 5000);
    };

    registerVisitor();
  }, []);

  // Track permanent view per visitor (one view per person is always one, even if they view many times)
  useEffect(() => {
    mediaItems.forEach((item) => {
      const permanentKey = `viewed_post_permanent_${item.id}`;
      if (!localStorage.getItem(permanentKey)) {
        localStorage.setItem(permanentKey, 'true');
        setPostViews((prev) => {
          const current = prev[item.id] || 0;
          const updated = { ...prev, [item.id]: current + 1 };
          localStorage.setItem('user_post_views', JSON.stringify(updated));
          return updated;
        });
        syncToBackend({ action: 'view', postId: item.id });
      }
    });
  }, []);

  const handleToggleLike = (id: string) => {
    setLikedPosts((prevLiked) => {
      const wasLiked = !!prevLiked[id];
      const nextLiked = !wasLiked;
      const updatedLiked = { ...prevLiked, [id]: nextLiked };
      localStorage.setItem('user_liked_posts', JSON.stringify(updatedLiked));

      setPostLikes((prevCounts) => {
        const currentCount = prevCounts[id] || 0;
        const nextCount = nextLiked ? currentCount + 1 : Math.max(0, currentCount - 1);
        const updatedCounts = { ...prevCounts, [id]: nextCount };
        localStorage.setItem('user_post_likes', JSON.stringify(updatedCounts));
        return updatedCounts;
      });

      if (nextLiked) {
        setHeartAnimPostId(id);
        setTimeout(() => setHeartAnimPostId(null), 900);
        syncToBackend({ action: 'like', postId: id });
      } else {
        syncToBackend({ action: 'unlike', postId: id });
      }

      return updatedLiked;
    });
  };

  const handleDoubleTap = (id: string) => {
    if (!likedPosts[id]) {
      handleToggleLike(id);
    } else {
      setHeartAnimPostId(id);
      setTimeout(() => setHeartAnimPostId(null), 900);
    }
  };

  const handleAddComment = (id: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = (commentInputs[id] || '').trim();
    if (!text) return;

    const newCommentId = `comment_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const newCommentItem: CommentItem = { id: newCommentId, text };

    setPostComments((prev) => {
      const currentList = prev[id] || [];
      const updatedList = [...currentList, newCommentItem];
      const updated = { ...prev, [id]: updatedList };
      localStorage.setItem('user_post_comments', JSON.stringify(updated));
      return updated;
    });

    setMyCommentIds((prev) => {
      const updated = [...prev, newCommentId];
      localStorage.setItem('user_my_comment_ids', JSON.stringify(updated));
      return updated;
    });

    syncToBackend({ action: 'comment', postId: id, commentId: newCommentId, comment: text });
    setCommentInputs((prev) => ({ ...prev, [id]: '' }));
  };

  const handleStartEditComment = (commentId: string, currentText: string) => {
    setEditingCommentId(commentId);
    setEditingCommentText(currentText);
  };

  const handleSaveEditComment = (postId: string, commentId: string) => {
    const trimmed = editingCommentText.trim();
    if (!trimmed) return;

    setPostComments((prev) => {
      const currentList = prev[postId] || [];
      const updatedList = currentList.map((c) =>
        c.id === commentId ? { ...c, text: trimmed } : c
      );
      const updated = { ...prev, [postId]: updatedList };
      localStorage.setItem('user_post_comments', JSON.stringify(updated));
      return updated;
    });

    syncToBackend({ action: 'editComment', postId, commentId, newText: trimmed });
    setEditingCommentId(null);
    setEditingCommentText('');
  };

  const handleDeleteComment = (postId: string, commentId: string) => {
    setPostComments((prev) => {
      const currentList = prev[postId] || [];
      const updatedList = currentList.filter((c) => c.id !== commentId);
      const updated = { ...prev, [postId]: updatedList };
      localStorage.setItem('user_post_comments', JSON.stringify(updated));
      return updated;
    });

    setMyCommentIds((prev) => {
      const updated = prev.filter((id) => id !== commentId);
      localStorage.setItem('user_my_comment_ids', JSON.stringify(updated));
      return updated;
    });

    syncToBackend({ action: 'deleteComment', postId, commentId });
    if (editingCommentId === commentId) {
      setEditingCommentId(null);
      setEditingCommentText('');
    }
  };

  const handleToggleSave = (id: string) => {
    setSavedPosts((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem('user_saved_posts', JSON.stringify(next));
      return next;
    });
  };

  const handleShare = async (id: string) => {
    const permanentShareKey = `shared_post_permanent_${id}`;
    const alreadyShared = !!localStorage.getItem(permanentShareKey);

    if (!alreadyShared) {
      localStorage.setItem(permanentShareKey, 'true');
      setPostShares((prev) => {
        const current = prev[id] || 0;
        const updated = { ...prev, [id]: current + 1 };
        localStorage.setItem('user_post_shares', JSON.stringify(updated));
        return updated;
      });
      syncToBackend({ action: 'share', postId: id });
    }

    const shareData = {
      title: 'Abdulazeem Shaikh',
      text: 'Explore visuals by Abdulazeem Shaikh',
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // cancelled or unsupported
      }
    }
    navigator.clipboard.writeText(window.location.href).then(() => {
      setShareFeedback('Link copied to clipboard!');
      setTimeout(() => setShareFeedback(null), 2500);
    });
  };

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
      title: 'Zivai',
      tagline: '',
      description: (
        <>
          <strong className="font-bold text-black/80">Your Life’s Problems, Solved.</strong>
          <br />
          The company behind your freedom.
          <br /><br />
          Home of AKRA and the products that protect your time, health &amp; money.
        </>
      ),
      color: 'from-green-500/20 to-teal-500/20'
    }
  ];

  const activeProjects = projects.filter(p => p.id === 'zalt');
  const totalVisitors = uniqueVisitors;

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
    <div className="min-h-screen w-full bg-[#FDFDFD] text-zinc-900 font-sans overflow-y-auto overflow-x-hidden flex flex-col">
      {/* Full Screen Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
      </div>

      {/* Central Content Area */}
      <main className="flex-1 min-w-0 relative flex flex-col items-center justify-start py-12 md:py-24 px-4 md:px-12 z-10">
        <motion.div
          key="default"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full min-w-0 flex items-center justify-center"
        >
          <div className="flex flex-col gap-4 w-full min-w-0 max-w-7xl mx-auto items-center">
            <ResponsiveHeroBanner 
              greetingNode={
                  <div className="flex flex-col w-full min-w-0 items-center justify-center gap-1">
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
                      className="mt-4 flex flex-wrap justify-center gap-1 sm:gap-4 w-full min-w-0 pb-8"
                    >
                      {activeProjects.filter(p => p.id === 'zalt').map((project) => (
                        <div key={project.id} className="flex flex-col gap-4 order-1 w-full md:w-[calc(50%-0.5rem)] max-w-[480px]">
                          <motion.div 
                            variants={cardVariants}
                            onMouseEnter={() => setHoveredCategory('zyfleron')}
                            onMouseLeave={() => setHoveredCategory(null)}
                            className={`bg-white p-6 rounded-none text-left relative group min-h-[320px] h-auto w-full transition-all duration-500 ease-in-out overflow-hidden border border-black/5`}
                          >
                            {/* Soft Gradient Background */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-40 blur-3xl -z-10`} />
                            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-white to-transparent -z-10" />
                            
                            {/* Arrow to https://zivai-hq.ai.studio/ */}
                            <a 
                               href="https://zivai-hq.ai.studio/"
                               target="_blank"
                               rel="noopener noreferrer"
                               className="absolute bottom-6 right-6 text-black/30 hover:text-black transition-all duration-300 z-20 hover:scale-110 active:scale-95"
                               title="Visit Zivai"
                             >
                               <ArrowUpRight size={22} strokeWidth={1.5} />
                            </a>

                            <div className="flex flex-col gap-6 min-h-[272px] relative z-10">
                              {/* Zalt Info */}
                              <div className="w-full flex flex-col justify-between shrink-0">
                                <div className="space-y-4">
                                  <div className="flex flex-row items-center justify-between gap-3 w-full">
                                    <a
                                      href="https://zivai-hq.ai.studio/"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm font-bold tracking-tight text-black hover:underline cursor-pointer shrink-0"
                                    >
                                      {project.title}
                                    </a>
                                    <LiquidMetalButton 
                                      label="GET EARLY ACCESS"
                                      width={150}
                                      onClick={() => {
                                        window.open('https://zivai-hq.ai.studio/', '_blank');
                                      }}
                                    />
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

                                  {/* Sub-cards inside Zivai card: Evie and celeste (compact, translucent, blurry background) */}
                                  <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
                                    {/* Evie Card */}
                                    <div className="bg-white/40 backdrop-blur-md border border-black/10 p-3 rounded-none relative overflow-hidden text-left flex flex-col justify-between gap-2 shadow-xs">
                                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-transparent opacity-50 blur-xl -z-10" />
                                      <div className="flex items-center justify-between gap-2">
                                        <span className="text-xs font-bold text-black tracking-tight">
                                          Evie
                                        </span>
                                        <button
                                          onClick={() => setShowForm(true)}
                                          className="text-[9px] font-semibold text-black/80 hover:text-black bg-black/5 hover:bg-black/10 px-2 py-0.5 rounded-full transition-colors"
                                        >
                                          EARLY ACCESS
                                        </button>
                                      </div>
                                      <p className="text-[10px] text-black/55 leading-tight">
                                        Adaptive intelligence woven quietly into your daily flow.
                                      </p>
                                    </div>

                                    {/* Celeste Card */}
                                    <div className="bg-white/40 backdrop-blur-md border border-black/10 p-3 rounded-none relative overflow-hidden text-left flex flex-col justify-between gap-2 shadow-xs">
                                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-transparent opacity-50 blur-xl -z-10" />
                                      <div className="flex items-center justify-between gap-2">
                                        <span className="text-xs font-bold text-black tracking-tight">
                                          celeste
                                        </span>
                                        <button
                                          onClick={() => setShowForm(true)}
                                          className="text-[9px] font-semibold text-black/80 hover:text-black bg-black/5 hover:bg-black/10 px-2 py-0.5 rounded-full transition-colors"
                                        >
                                          EARLY ACCESS
                                        </button>
                                      </div>
                                      <p className="text-[10px] text-black/55 leading-tight">
                                        Spatial computation and intuitive synthesis across your ecosystem.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      ))}

                      {/* Advertising space — beside the Zivai card, opens Instagram DM */}
                      <div
                        className="relative flex flex-col justify-between gap-6 order-4 sm:order-2 w-full md:w-[calc(50%-0.5rem)] max-w-[480px] self-stretch min-h-[320px] p-6 bg-white border border-black/5 overflow-hidden text-left transition-all duration-500"
                      >
                        <div className="flex flex-col gap-2.5 relative z-10">
                          <div className="flex flex-row items-center justify-between gap-3 w-full">
                            <span className="text-sm font-bold tracking-tight text-black">Advertising</span>
                            <span className="text-[9px] font-semibold text-black/70 bg-black/5 px-2 py-0.5 rounded-full uppercase tracking-[0.12em]">
                              Open spot
                            </span>
                          </div>

                          <h3 className="text-[15px] font-semibold text-black leading-snug">
                            Stop Buying Banners, start Building Experiences.
                          </h3>

                          <p className="text-[11px] text-black/50 leading-relaxed">
                            Traditional ads are broken. Users scroll past static images, mute videos, and install ad-blockers. They don't want to look at billboards anymore.
                          </p>

                          <p className="text-[11px] text-black/50 leading-relaxed">
                            Welcome to The Living Pixel, a premium, interactive digital playground built directly into the fabric of our website. This is a lease high-engagement real estate where your brand can create living, breathing digital installations.
                          </p>
                        </div>

                        <div className="self-start relative z-10">
                          <LiquidMetalButton
                            label="Feature your brand here"
                            width={190}
                            onClick={() => {
                              window.open('https://ig.me/m/abdulazeemshaikhh', '_blank');
                            }}
                          />
                        </div>
                      </div>

                      {/* Certificates carousel — below the Zivai card */}
                      <CertificatesCarousel />

                      {/* Clean Visual Media Feed — below the certificates */}
                      <div className="flex flex-row flex-wrap sm:flex-nowrap items-start justify-start gap-8 w-full max-w-[480px] mt-2 order-3 sm:order-4">
                        {mediaItems.map((item) => {
                          const isLiked = !!likedPosts[item.id];
                          const likes = postLikes[item.id] || 0;
                          const shares = postShares[item.id] || 0;
                          const views = postViews[item.id] || 0;
                          const comments = postComments[item.id] || [];
                          const isHeartAnim = heartAnimPostId === item.id;
                          const isCommenting = activeCommentPostId === item.id;
                          const currentInput = commentInputs[item.id] || '';

                          return (
                            <motion.div
                              key={item.id}
                              variants={cardVariants}
                              className="flex flex-col max-w-[210px] w-auto text-left shrink-0"
                            >
                              {/* Media Image with Double-Tap to Like (Adaptive natural aspect ratio, no container constraints) */}
                              <div 
                                className="relative inline-block overflow-hidden cursor-pointer select-none"
                                onClick={() => {
                                  if (mediaClickTimeout.current !== null) return;
                                  mediaClickTimeout.current = window.setTimeout(() => {
                                    mediaClickTimeout.current = null;
                                    setLightboxImage({ src: item.src, alt: item.alt, id: item.id });
                                  }, 220);
                                }}
                                onDoubleClick={() => {
                                  if (mediaClickTimeout.current !== null) {
                                    window.clearTimeout(mediaClickTimeout.current);
                                    mediaClickTimeout.current = null;
                                  }
                                  handleDoubleTap(item.id);
                                }}
                              >
                                <img 
                                  src={item.src} 
                                  alt={item.alt} 
                                  className="w-auto h-auto max-w-[210px] max-h-[260px] object-contain block pointer-events-none" 
                                />

                                {/* Heart burst on double-tap */}
                                <AnimatePresence>
                                  {isHeartAnim && (
                                    <motion.div 
                                      initial={{ scale: 0, opacity: 0 }}
                                      animate={{ scale: [0, 1.25, 1], opacity: [0, 1, 0] }}
                                      exit={{ scale: 0.8, opacity: 0 }}
                                      transition={{ duration: 0.8, ease: "easeOut" }}
                                      className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
                                    >
                                      <Heart size={52} className="fill-white text-white drop-shadow-md" />
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>

                              {/* Buttons starting directly flush with the image left edge */}
                              <div className="pt-2 flex flex-col gap-2 w-full">
                                <div className="flex items-center gap-2.5">
                                  {/* Heart Button with like count beside it */}
                                  <button 
                                    onClick={() => handleToggleLike(item.id)}
                                    aria-label="Like post"
                                    className="flex items-center gap-1 text-black hover:text-red-500 transition-colors cursor-pointer active:scale-90 duration-150 p-0 border-none bg-transparent"
                                  >
                                    <Heart 
                                      size={17} 
                                      strokeWidth={1.8}
                                      className={`transition-all duration-200 ${isLiked ? 'fill-red-500 text-red-500 scale-110' : ''}`} 
                                    />
                                    {likes > 0 && (
                                      <span className="text-[11px] font-medium text-black/70 leading-none">
                                        {likes}
                                      </span>
                                    )}
                                  </button>

                                  {/* Comment Button (toggles typing bar) */}
                                  <button 
                                    onClick={() => setActiveCommentPostId((prev) => prev === item.id ? null : item.id)}
                                    aria-label="Comment on post"
                                    className="flex items-center gap-1 text-black hover:text-black/60 transition-colors cursor-pointer active:scale-90 duration-150 p-0 border-none bg-transparent"
                                  >
                                    <MessageCircle 
                                      size={17} 
                                      strokeWidth={1.8}
                                    />
                                    {comments.length > 0 && (
                                      <span className="text-[11px] font-medium text-black/70 leading-none">
                                        {comments.length}
                                      </span>
                                    )}
                                  </button>

                                  {/* Share Button with share count beside it */}
                                  <button 
                                    onClick={() => handleShare(item.id)}
                                    aria-label="Share post"
                                    className="flex items-center gap-1 text-black hover:text-black/60 transition-colors cursor-pointer active:scale-90 duration-150 p-0 border-none bg-transparent"
                                  >
                                    <Send 
                                      size={16} 
                                      strokeWidth={1.8}
                                      className="-rotate-12" 
                                    />
                                    {shares > 0 && (
                                      <span className="text-[11px] font-medium text-black/70 leading-none">
                                        {shares}
                                      </span>
                                    )}
                                  </button>

                                  {/* Views Icon with count beside it, positioned beside Share */}
                                  <div className="flex items-center gap-1 text-black/45 ml-0.5" title={`${views} views`}>
                                    <Eye size={16} strokeWidth={1.8} className="text-black/55" />
                                    <span className="text-[11px] font-medium text-black/60 leading-none">
                                      {views}
                                    </span>
                                  </div>
                                </div>

                                {/* Share confirmation toast */}
                                <AnimatePresence>
                                  {shareFeedback && (
                                    <motion.div 
                                      initial={{ opacity: 0, y: -4 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -4 }}
                                      className="text-[10px] font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200 self-start"
                                    >
                                      ✓ {shareFeedback}
                                    </motion.div>
                                  )}
                                </AnimatePresence>

                                {/* Comments List (adaptive dynamic width and corner-radius based on text length + edit/delete for author) */}
                                {comments.length > 0 && (
                                  <div className="flex flex-col items-start gap-1.5 pt-1 w-full">
                                    {comments.map((comm) => {
                                      const isLong = comm.text.length > 35;
                                      const isMyComment = myCommentIds.includes(comm.id);
                                      const isEditing = editingCommentId === comm.id;

                                      if (isEditing) {
                                        return (
                                          <div key={comm.id} className="w-full flex flex-col gap-1.5 bg-black/[0.03] border border-black/10 rounded-2xl p-2.5">
                                            <input
                                              type="text"
                                              value={editingCommentText}
                                              onChange={(e) => setEditingCommentText(e.target.value)}
                                              className="text-[11px] bg-white border border-black/10 rounded-full px-2.5 py-1 text-black outline-none w-full"
                                              autoFocus
                                            />
                                            <div className="flex items-center justify-end gap-1.5">
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  setEditingCommentId(null);
                                                  setEditingCommentText('');
                                                }}
                                                className="text-[10px] text-black/50 hover:text-black px-2 py-0.5 rounded-full"
                                              >
                                                Cancel
                                              </button>
                                              <button
                                                type="button"
                                                onClick={() => handleSaveEditComment(item.id, comm.id)}
                                                disabled={!editingCommentText.trim()}
                                                className="text-[10px] font-medium bg-black text-white px-2.5 py-0.5 rounded-full disabled:opacity-30"
                                              >
                                                Save
                                              </button>
                                            </div>
                                          </div>
                                        );
                                      }

                                      return (
                                        <div 
                                          key={comm.id} 
                                          className={`group relative text-[11px] text-black/85 bg-black/[0.04] border border-black/5 px-3 py-1.5 w-fit max-w-full break-words leading-tight flex items-center gap-1.5 ${
                                            isLong ? 'rounded-[14px]' : 'rounded-full'
                                          }`}
                                        >
                                          <span>{comm.text}</span>
                                          {isMyComment && (
                                            <span className="inline-flex items-center gap-1 ml-1 opacity-70 group-hover:opacity-100 transition-opacity">
                                              <button
                                                type="button"
                                                onClick={() => handleStartEditComment(comm.id, comm.text)}
                                                className="text-black/40 hover:text-black transition-colors p-0.5"
                                                title="Edit comment"
                                              >
                                                <Pencil size={10} />
                                              </button>
                                              <button
                                                type="button"
                                                onClick={() => handleDeleteComment(item.id, comm.id)}
                                                className="text-black/40 hover:text-red-500 transition-colors p-0.5"
                                                title="Delete comment"
                                              >
                                                <Trash2 size={10} />
                                              </button>
                                            </span>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}

                                {/* Fully Rounded Typing Bar (Opens on clicking comment icon) */}
                                {isCommenting && (
                                  <form 
                                    onSubmit={(e) => handleAddComment(item.id, e)} 
                                    className="w-full min-w-[170px] flex items-center bg-black/[0.03] border border-black/10 rounded-full px-3 py-1.5 mt-1 focus-within:border-black/25 transition-colors"
                                  >
                                    <input 
                                      type="text" 
                                      value={currentInput}
                                      onChange={(e) => setCommentInputs((prev) => ({ ...prev, [item.id]: e.target.value }))}
                                      placeholder="Write a comment..."
                                      className="flex-1 min-w-0 text-[11px] bg-transparent border-none outline-none text-black placeholder:text-black/35"
                                      autoFocus
                                    />
                                    <button 
                                      type="submit"
                                      disabled={!currentInput.trim()}
                                      className="text-[11px] font-semibold text-black disabled:text-black/20 hover:opacity-70 cursor-pointer disabled:cursor-not-allowed transition-opacity ml-1.5 shrink-0"
                                    >
                                      Post
                                    </button>
                                  </form>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                        </div>
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

            {/* Big Image Lightbox Pop-up */}
            {lightboxImage && (() => {
              const lbId = lightboxImage.id;
              const lbLikes = postLikes[lbId] || 0;
              const lbIsLiked = !!likedPosts[lbId];
              const lbComments = postComments[lbId] || [];
              const lbShares = postShares[lbId] || 0;
              const lbViews = postViews[lbId] || 0;
              return (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setLightboxImage(null)}
                  className="fixed inset-0 bg-black/85 backdrop-blur-md z-[120] flex items-center justify-center p-4 sm:p-8 cursor-zoom-out"
                >
                  <button
                    onClick={() => setLightboxImage(null)}
                    className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all duration-200"
                    aria-label="Close full view"
                  >
                    <X size={22} />
                  </button>
                  <motion.div
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.85, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative flex flex-row items-center gap-6 max-h-[88vh]"
                  >
                    {/* Image */}
                    <img
                      src={lightboxImage.src}
                      alt={lightboxImage.alt}
                      className="max-w-[80vw] max-h-[85vh] w-auto h-auto object-contain rounded-lg shadow-2xl select-none"
                    />

                    {/* Vertical action sidebar */}
                    <div className="flex flex-col items-center gap-6">
                      {/* Like */}
                      <button
                        onClick={() => handleToggleLike(lbId)}
                        className="flex flex-col items-center gap-1.5 cursor-pointer active:scale-90 transition-transform duration-150 bg-transparent border-none p-0"
                        aria-label="Like"
                      >
                        <Heart
                          size={26}
                          strokeWidth={1.8}
                          className={lbIsLiked ? 'fill-red-500 text-red-500' : 'text-white/80'}
                        />
                        {lbLikes > 0 && (
                          <span className="text-[12px] font-medium text-white/70 leading-none">{lbLikes}</span>
                        )}
                      </button>

                      {/* Comment */}
                      <button
                        onClick={() => { setLightboxImage(null); setActiveCommentPostId(lbId); }}
                        className="flex flex-col items-center gap-1.5 cursor-pointer active:scale-90 transition-transform duration-150 bg-transparent border-none p-0 text-white/80 hover:text-white"
                        aria-label="Comment"
                      >
                        <MessageCircle size={26} strokeWidth={1.8} />
                        {lbComments.length > 0 && (
                          <span className="text-[12px] font-medium text-white/70 leading-none">{lbComments.length}</span>
                        )}
                      </button>

                      {/* Share */}
                      <button
                        onClick={() => handleShare(lbId)}
                        className="flex flex-col items-center gap-1.5 cursor-pointer active:scale-90 transition-transform duration-150 bg-transparent border-none p-0 text-white/80 hover:text-white"
                        aria-label="Share"
                      >
                        <Send size={24} strokeWidth={1.8} className="-rotate-12" />
                        {lbShares > 0 && (
                          <span className="text-[12px] font-medium text-white/70 leading-none">{lbShares}</span>
                        )}
                      </button>

                      {/* Views (read-only) */}
                      <div className="flex flex-col items-center gap-1.5 text-white/50" title={`${lbViews} views`}>
                        <Eye size={24} strokeWidth={1.8} />
                        <span className="text-[12px] font-medium leading-none">{lbViews}</span>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })()}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* Total visitors — bottom edge of the website */}
      <footer className="w-full flex justify-end pr-2 pb-2 z-10 shrink-0">
        <div
          className="flex items-center gap-1.5 text-black/45 select-none"
          title="Total visitors to this website"
        >
          <Eye size={12} strokeWidth={1.8} className="text-black/35" />
          <span className="text-[10px] font-semibold text-black/70 tabular-nums">
            {typeof totalVisitors === 'number' ? totalVisitors.toLocaleString('en-US') : '—'}
          </span>
          <span className="text-[10px] text-black/40">visitors</span>
        </div>
      </footer>

      {/* Background Ambient Glow removed */}
    </div>
  );
}

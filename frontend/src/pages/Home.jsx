import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Footer from '../components/Footer';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  GraduationCap, Home as HomeIcon, Wrench, Search,
  BarChart3, MessageCircle, CheckCircle2, ArrowRight,
  Building2, Users, Clock
} from 'lucide-react';

// ── Animation Variants ──────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: 'easeOut' } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

const slideLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

// ── Animated Section Wrapper ─────────────────────────────────────────────────
const AnimatedSection = ({ children, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ── Animated Counter ─────────────────────────────────────────────────────────
const AnimatedCounter = ({ value, label, icon: Icon }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      variants={scaleIn}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      whileHover={{ scale: 1.07, y: -4 }}
      className="p-6 rounded-3xl bg-white/80 backdrop-blur-sm border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      <div className="flex items-center justify-center mb-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-sky-50 border border-indigo-100 flex items-center justify-center">
          <Icon className="w-6 h-6 text-indigo-500" />
        </div>
      </div>
      <div className="text-4xl font-extrabold gradient-text mb-1">{value}</div>
      <div className="text-slate-600 font-semibold text-sm">{label}</div>
    </motion.div>
  );
};

// ── Feature Card ─────────────────────────────────────────────────────────────
const FeatureCard = ({ icon: Icon, title, description, items, iconBg, iconColor, checkColor, index }) => {
  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      whileHover={{ y: -8, transition: { duration: 0.25 } }}
      className="glass-card p-8 rounded-3xl group cursor-default"
    >
      <motion.div
        whileHover={{ scale: 1.15, rotate: 6 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        className={`${iconBg} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm`}
      >
        <Icon className={`w-8 h-8 ${iconColor}`} />
      </motion.div>
      <h3 className="text-2xl font-bold mb-4 text-slate-800">{title}</h3>
      <p className="text-slate-500 mb-6 leading-relaxed text-sm">{description}</p>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <motion.li
            key={i}
            custom={i}
            variants={slideLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex items-start text-sm text-slate-700 font-medium"
          >
            <CheckCircle2 className={`w-4 h-4 ${checkColor} mr-2 mt-0.5 flex-shrink-0`} />
            {item}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

// ── Step Card ───────────────────────────────────────────────────────────────
const StepCard = ({ step, title, desc, icon: Icon, color, bg, index }) => (
  <motion.div
    custom={index}
    variants={fadeUp}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: '-40px' }}
    className="text-center group relative"
  >
    {index < 3 && (
      <div className="hidden md:block absolute top-10 left-[60%] w-full h-px border-t-2 border-dashed border-slate-200 z-0" />
    )}
    <motion.div
      whileHover={{ scale: 1.15, rotate: -5 }}
      transition={{ type: 'spring', stiffness: 250, damping: 15 }}
      className={`relative z-10 ${bg} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md border-4 border-white`}
    >
      <Icon className={`w-8 h-8 ${color}`} />
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 + index * 0.1, type: 'spring' }}
        className="absolute -top-2 -right-2 bg-slate-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-sm"
      >
        {step}
      </motion.div>
    </motion.div>
    <h3 className="font-bold text-xl text-slate-800 mb-2">{title}</h3>
    <p className="text-slate-500 font-medium text-sm">{desc}</p>
  </motion.div>
);

// ── Main Component ───────────────────────────────────────────────────────────
const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/admin');
    }
  }, [user, navigate]);

  const features = [
    {
      icon: GraduationCap, title: 'For Students', iconBg: 'bg-indigo-50', iconColor: 'text-indigo-600', checkColor: 'text-indigo-500',
      description: 'Find boarding places with smart filters for university, price range, and essential facilities.',
      items: ['Filter by university and location', 'Search by price range', 'Filter by room type & facilities', 'Save favorite listings'],
    },
    {
      icon: HomeIcon, title: 'For Owners', iconBg: 'bg-sky-50', iconColor: 'text-sky-600', checkColor: 'text-sky-500',
      description: 'List your boarding places and reach thousands of students looking for accommodation.',
      items: ['Easy listing management', 'Multiple image uploads', 'Dashboard for your listings', 'Direct contact with students'],
    },
    {
      icon: Wrench, title: 'Service Providers', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', checkColor: 'text-emerald-500',
      description: 'Offer your services to boarding owners and students in need of maintenance and support.',
      items: ['List various services', 'Reach targeted audience', 'Plumbing, electrical, cleaning', 'Build your reputation'],
    },
  ];

  const steps = [
    { step: '1', title: 'Search', desc: 'Find boardings near your university', icon: Search, color: 'text-sky-500', bg: 'bg-sky-50' },
    { step: '2', title: 'Compare', desc: 'View prices, facilities & locations', icon: BarChart3, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { step: '3', title: 'Contact', desc: 'Get in touch with boarding owners', icon: MessageCircle, color: 'text-violet-500', bg: 'bg-violet-50' },
    { step: '4', title: 'Move In', desc: 'Find your perfect student home', icon: HomeIcon, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  ];

  const stats = [
    { number: '500+', label: 'Boardings Listed', icon: Building2 },
    { number: '50+', label: 'Universities Covered', icon: GraduationCap },
    { number: '1000+', label: 'Happy Students', icon: Users },
    { number: '24/7', label: 'Customer Support', icon: Clock },
  ];

  return (
    <div
      className="min-h-screen bg-slate-50 bg-cover bg-center bg-no-repeat bg-fixed relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.45), rgba(248,250,252,0.55)), url('/landing-bg.png')`
      }}
    >
      {/* ── Animated Blobs ── */}
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-0 -left-52 w-[500px] h-[500px] bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-25 pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, -25, 0], y: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute top-10 -right-52 w-[500px] h-[500px] bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-25 pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, 20, 0], y: [0, 15, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        className="absolute bottom-0 left-20 w-[400px] h-[400px] bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"
      />

      {/* ── Hero ── */}
      <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.7, type: 'spring', stiffness: 200, damping: 18 }}
          className="flex justify-center mb-10"
        >
          <div className="relative">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 4 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="glass-panel p-5 rounded-3xl shadow-xl border border-white/70"
            >
              <img src="/logo.png" alt="Uni House Logo" className="h-20 w-20 object-contain drop-shadow-md" />
            </motion.div>
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full shadow-lg border-2 border-white"
            />
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute -bottom-2 -left-2 w-5 h-5 bg-gradient-to-br from-indigo-400 to-sky-400 rounded-full shadow-md border-2 border-white"
            />
          </div>
        </motion.div>

        {/* Headline */}
        <div className="text-center mb-20">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl font-extrabold text-slate-800 tracking-tight leading-tight mb-6"
          >
            <span className="gradient-text drop-shadow-sm">Find Your Perfect</span>
            <br />
            <span className="text-slate-800">Student Home</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium mb-10"
          >
            Discover comfortable and affordable boarding places
            <span className="relative inline-block mx-2 text-indigo-600 font-bold">
              near your university
              <motion.svg
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="absolute w-full h-3 -bottom-1 left-0 text-sky-300"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
              </motion.svg>
            </span>
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/search"
                className="group flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-sky-500 text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-xl shadow-indigo-200/60 hover:shadow-2xl hover:shadow-sky-200/70 transition-shadow duration-300 border border-transparent"
              >
                <Search className="w-5 h-5" />
                Browse Boardings
                <motion.span animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}>
                  <ArrowRight className="w-5 h-5" />
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* ── Feature Cards ── */}
        <div className="grid md:grid-cols-3 gap-8 mb-28">
          {features.map((f, i) => (
            <FeatureCard key={i} {...f} index={i} />
          ))}
        </div>

        {/* ── CTA Banner (guest only) ── */}
        {!user && (
          <AnimatedSection className="mb-28">
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
              className="relative overflow-hidden text-center glass-card bg-gradient-to-br from-indigo-50/80 to-sky-50/80 p-14 rounded-[2.5rem] shadow-xl border border-white"
            >
              {/* subtle decorative orbs */}
              <div className="absolute -top-16 -right-16 w-56 h-56 bg-indigo-200 rounded-full opacity-20 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-sky-200 rounded-full opacity-20 blur-3xl pointer-events-none" />

              <motion.h2
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4"
              >
                Join Our Platform Today
              </motion.h2>
              <motion.p
                variants={fadeUp}
                custom={1}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-slate-500 mb-10 text-lg font-medium max-w-2xl mx-auto"
              >
                Register now as a student, boarding owner, or service provider and unlock the full potential of Uni House.
              </motion.p>
              <motion.div
                variants={fadeUp}
                custom={2}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex flex-col sm:flex-row justify-center gap-4"
              >
                <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}>
                  <Link to="/register" className="inline-block bg-gradient-to-r from-indigo-600 to-sky-500 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:shadow-xl transition-shadow duration-300">
                    Get Started Free
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}>
                  <Link to="/login" className="inline-block bg-white text-slate-800 border-2 border-slate-200 px-8 py-4 rounded-2xl font-bold hover:border-indigo-200 transition-colors duration-300">
                    Login to Account
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimatedSection>
        )}

        {/* ── How It Works ── */}
        <div className="mb-16">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4">How It Works</h2>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="h-1 bg-gradient-to-r from-indigo-500 to-sky-400 mx-auto rounded-full"
            />
          </motion.div>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((s, i) => <StepCard key={i} {...s} index={i} />)}
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="bg-white/70 backdrop-blur-md border-t border-slate-100 py-20 relative z-10">
        <div className="container mx-auto px-4">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center text-2xl font-bold text-slate-700 mb-12"
          >
            Trusted by students across Sri Lanka
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s, i) => (
              <AnimatedCounter key={i} value={s.number} label={s.label} icon={s.icon} />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
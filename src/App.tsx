/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';
import { Instagram, MessageCircle, ArrowRight, Menu, X, Award, ExternalLink, MapPin, Ruler, PenTool, Phone, Star, GraduationCap, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from './lib/utils';

// --- Types ---
type GalleryTab = 'realismo' | 'fineline' | 'studio';

interface GalleryItem {
  id: number;
  type: GalleryTab;
  url: string;
  title: string;
}

// --- Mock Data ---
const GALLERY_ITEMS: GalleryItem[] = [
  // Realismo
  { id: 1, type: 'realismo', url: 'https://i.postimg.cc/h4ZTB27b/IMG_8192.jpg', title: 'Realismo I' },
  { id: 2, type: 'realismo', url: 'https://i.postimg.cc/bNGbN1QK/IMG_8200.png', title: 'Realismo II' },
  { id: 7, type: 'realismo', url: 'https://i.postimg.cc/HWvXg679/IMG_8193.jpg', title: 'Realismo III' },
  { id: 9, type: 'realismo', url: 'https://i.postimg.cc/fT6d3kCS/IMG_8194.jpg', title: 'Realismo IV' },
  { id: 10, type: 'realismo', url: 'https://i.postimg.cc/CLZDLbjt/IMG_8195.jpg', title: 'Realismo V' },
  { id: 13, type: 'realismo', url: 'https://i.postimg.cc/2j9hD0Bd/IMG_8197.jpg', title: 'Realismo VI' },
  { id: 14, type: 'realismo', url: 'https://i.postimg.cc/rFv4dzjw/IMG_8216.png', title: 'Realismo VII' },
  { id: 15, type: 'realismo', url: 'https://i.postimg.cc/Yq4gqQ1T/IMG_8198.jpg', title: 'Realismo VIII' },
  { id: 16, type: 'realismo', url: 'https://i.postimg.cc/dtzC7D6q/IMG_8218.jpg', title: 'Realismo IX' },
  { id: 17, type: 'realismo', url: 'https://i.postimg.cc/4NrcKnPN/IMG_8219.jpg', title: 'Realismo X' },
  { id: 18, type: 'realismo', url: 'https://i.postimg.cc/ZK1N90Hb/IMG_8222.jpg', title: 'Realismo XI' },
  { id: 19, type: 'realismo', url: 'https://i.postimg.cc/15LFg4Bh/IMG_8230.jpg', title: 'Realismo XII' },
  { id: 20, type: 'realismo', url: 'https://i.postimg.cc/m209chjs/IMG_8231.jpg', title: 'Realismo XIII' },
  { id: 21, type: 'realismo', url: 'https://i.postimg.cc/WbQZDt8d/IMG_8232.jpg', title: 'Realismo XIV' },
  { id: 22, type: 'realismo', url: 'https://i.postimg.cc/SNw9XjdJ/IMG_8233.jpg', title: 'Realismo XV' },
  { id: 23, type: 'realismo', url: 'https://i.postimg.cc/PrBDLNyJ/IMG_8244.jpg', title: 'Realismo XVI' },
  { id: 24, type: 'realismo', url: 'https://i.postimg.cc/BQdF8tgk/IMG_8245.jpg', title: 'Realismo XVII' },
  
  // Fine Line
  { id: 3, type: 'fineline', url: 'https://i.postimg.cc/pTSqSRfF/IMG_8250.jpg', title: 'Fine Line I' },
  { id: 4, type: 'fineline', url: 'https://i.postimg.cc/gJ7N7mVy/IMG_8249.jpg', title: 'Fine Line II' },
  { id: 8, type: 'fineline', url: 'https://i.postimg.cc/tTc2cpdQ/IMG_8253.jpg', title: 'Fine Line III' },
  { id: 11, type: 'fineline', url: 'https://i.postimg.cc/zBvxpVgK/IMG_8221.jpg', title: 'Fine Line IV' },
  { id: 12, type: 'fineline', url: 'https://i.postimg.cc/bJ535pxg/IMG_8247.jpg', title: 'Fine Line V' },
  { id: 25, type: 'fineline', url: 'https://i.postimg.cc/zBvxpVgk/IMG_8246.jpg', title: 'Fine Line VI' },
  { id: 26, type: 'fineline', url: 'https://i.postimg.cc/Y9PbPM66/IMG_8245.jpg', title: 'Fine Line VII' },
  { id: 27, type: 'fineline', url: 'https://i.postimg.cc/ydGvGsmt/IMG_8217.jpg', title: 'Fine Line VIII' },
  { id: 28, type: 'fineline', url: 'https://i.postimg.cc/vBK3Kbr0/IMG_8215.jpg', title: 'Fine Line IX' },
  { id: 29, type: 'fineline', url: 'https://i.postimg.cc/4NrcKnPN/IMG_8219.jpg', title: 'Fine Line X' },
  { id: 30, type: 'fineline', url: 'https://i.postimg.cc/sXLwLsYN/IMG_8214.jpg', title: 'Fine Line XI' },

  // Studio
  { id: 5, type: 'studio', url: 'https://i.postimg.cc/zD6RyVDS/IMG_8310.jpg', title: 'Studio I' },
  { id: 6, type: 'studio', url: 'https://i.postimg.cc/BZk1jXZm/IMG_8293.jpg', title: 'Studio II' },
  { id: 31, type: 'studio', url: 'https://i.postimg.cc/WpCJdhp8/IMG_8294.jpg', title: 'Studio III' },
  { id: 32, type: 'studio', url: 'https://i.postimg.cc/VspbJds4/IMG_8295.jpg', title: 'Studio IV' },
  { id: 33, type: 'studio', url: 'https://i.postimg.cc/jdfnPtLT/IMG_8296.jpg', title: 'Studio V' },
  { id: 34, type: 'studio', url: 'https://i.postimg.cc/Qx7K1hVP/IMG_8297.jpg', title: 'Studio VI' },
  { id: 35, type: 'studio', url: 'https://i.postimg.cc/pV4nmpVS/IMG_8298.jpg', title: 'Studio VII' },
  { id: 36, type: 'studio', url: 'https://i.postimg.cc/28WLhrV5/IMG_8299.jpg', title: 'Studio VIII' },
  { id: 37, type: 'studio', url: 'https://i.postimg.cc/DyG4Ln80/IMG_8300.jpg', title: 'Studio IX' },
  { id: 38, type: 'studio', url: 'https://i.postimg.cc/PrDvYTPL/IMG_8301.jpg', title: 'Studio X' },
  { id: 39, type: 'studio', url: 'https://i.postimg.cc/5NzQLb6Q/IMG_8203.jpg', title: 'Studio XI' },
  { id: 40, type: 'studio', url: 'https://i.postimg.cc/Sxp2G3MS/IMG_8202.jpg', title: 'Studio XII' },
  { id: 41, type: 'studio', url: 'https://i.postimg.cc/YCwGxZWj/Full_Size_Render.jpg', title: 'Studio XIII' },
  { id: 42, type: 'studio', url: 'https://i.postimg.cc/zG1bk6gF/IMG_8208.jpg', title: 'Studio XIV' },
  { id: 43, type: 'studio', url: 'https://i.postimg.cc/y8zgTtZc/IMG_8209.jpg', title: 'Studio XV' },
  { id: 44, type: 'studio', url: 'https://i.postimg.cc/Gm18jVyq/IMG_8306.jpg', title: 'Studio XVI' },
  { id: 45, type: 'studio', url: 'https://i.postimg.cc/qvXtDwsx/IMG_8307.jpg', title: 'Studio XVII' },
];

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'O Artista', href: isHomePage ? '#sobre' : '/#sobre' },
    { name: 'Galeria', href: isHomePage ? '#galeria' : '/#galeria' },
    { name: 'Cursos', href: '/cursos', isExternal: true },
    { name: 'Premiações', href: isHomePage ? '#premiacoes' : '/#premiacoes' },
    { name: 'Experiência', href: isHomePage ? '#experiencia' : '/#experiencia' },
    { name: 'Contato', href: isHomePage ? '#contato' : '/#contato' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 w-full z-50 transition-all duration-700 px-6 py-6 md:px-16",
      isScrolled || !isHomePage ? "bg-ink/95 backdrop-blur-md py-4 border-b border-white/5" : "bg-transparent"
    )}>
      <div className="max-w-[1600px] mx-auto flex justify-between items-center">
        <Link to="/" className="flex flex-col">
          <span className="font-serif text-2xl tracking-[0.15em] uppercase text-paper leading-none">
            Wylamis Lima
          </span>
          <span className="text-[8px] font-sans font-light tracking-[0.6em] uppercase opacity-40 mt-1">
            Ateliê de Tatuagem
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-12">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.href} 
              className={cn(
                "text-[9px] uppercase tracking-[0.3em] font-light transition-all duration-300",
                (location.pathname === link.href || (isHomePage && location.hash === link.href)) 
                  ? "text-gold" 
                  : "text-paper/50 hover:text-gold"
              )}
            >
              {link.name}
            </Link>
          ))}
          <div className="flex items-center space-x-6 pl-6 border-l border-white/10">
            <a href="https://instagram.com/will.limatattoo" target="_blank" rel="noreferrer" title="Realismo" className="text-paper/40 hover:text-gold transition-colors">
              <Instagram size={16} strokeWidth={1.5} />
            </a>
            <a href="https://instagram.com/will.limafineline" target="_blank" rel="noreferrer" title="Fine Line" className="text-paper/40 hover:text-gold transition-colors">
              <Instagram size={16} strokeWidth={1.5} />
            </a>
            <a href="https://wa.me/5511966443885?text=Olá!%20Encontrei%20seu%20trabalho%20pelo%20Google%20e%20gostaria%20de%20solicitar%20um%20orçamento." target="_blank" rel="noreferrer" className="text-paper/40 hover:text-gold transition-colors">
              <Phone size={16} strokeWidth={1.5} />
            </a>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-paper" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} strokeWidth={1} /> : <Menu size={24} strokeWidth={1} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-ink z-40 flex flex-col items-center justify-center space-y-10 md:hidden"
          >
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.href} 
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "text-2xl font-serif tracking-widest transition-colors",
                  (location.pathname === link.href || (isHomePage && location.hash === link.href))
                    ? "text-gold"
                    : "text-paper hover:text-gold"
                )}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex space-x-8 pt-8">
              <a href="https://instagram.com/will.limatattoo" target="_blank" rel="noreferrer" className="text-paper/60 hover:text-gold transition-colors"><Instagram size={24} /></a>
              <a href="https://instagram.com/will.limafineline" target="_blank" rel="noreferrer" className="text-paper/60 hover:text-gold transition-colors"><Instagram size={24} /></a>
              <a href="https://wa.me/5511966443885?text=Olá!%20Encontrei%20seu%20trabalho%20pelo%20Google%20e%20gostaria%20de%20solicitar%20um%20orçamento." target="_blank" rel="noreferrer" className="text-paper/60 hover:text-gold transition-colors"><Phone size={24} /></a>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-8 right-8 text-paper/40">
              <X size={32} strokeWidth={1} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  const heroImages = [
    'https://i.postimg.cc/MHf0nLc1/0e3140e8_7d36_4e87_a24b_408b8bc35fa7.jpg',
    'https://i.postimg.cc/9z3dZBTy/IMG_8257.jpg'
  ];

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-ink">
      <motion.div style={{ y: y1, opacity }} className="absolute inset-0 z-0">
        <AnimatePresence>
          <motion.div
            key={currentImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <img 
              src={heroImages[currentImage]} 
              alt="Wylamis Lima Ateliê" 
              className="w-full h-full object-cover scale-110 brightness-[1.1] contrast-[0.95] saturate-[0.05]"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-transparent to-ink"></div>
      </motion.div>

      <div className="relative z-10 text-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-4"
        >
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="inline-block text-[9px] md:text-[11px] uppercase tracking-[1.2em] text-gold/70 font-light"
          >
            Realismo • Fine Line
          </motion.span>
          
          <div className="space-y-1">
            <h1 className="text-6xl md:text-8xl font-serif font-extralight tracking-tight text-paper leading-tight">
              Wylamis Lima
            </h1>
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 1.5 }}
              className="font-script text-gold text-3xl md:text-5xl tracking-wide block"
            >
              Ateliê
            </motion.span>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 pt-12">
            <a 
              href="https://wa.me/5511966443885?text=Olá!%20Encontrei%20seu%20trabalho%20pelo%20Google%20e%20gostaria%20de%20solicitar%20um%20orçamento." 
              target="_blank"
              rel="noreferrer"
              className="group relative px-10 py-4 bg-paper text-ink rounded-full overflow-hidden transition-all duration-700"
            >
              <span className="relative z-10 text-[10px] uppercase tracking-[0.5em] font-medium">
                Agendar Consultoria
              </span>
              <div className="absolute inset-0 bg-gold -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out"></div>
            </a>
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-4">
                <a href="https://instagram.com/will.limatattoo" target="_blank" rel="noreferrer" className="flex items-center space-x-3 text-[10px] uppercase tracking-[0.3em] text-paper/40 hover:text-paper transition-colors">
                  <Instagram size={14} />
                  <span className="whitespace-nowrap">Realismo</span>
                </a>
                <a href="https://instagram.com/will.limafineline" target="_blank" rel="noreferrer" className="flex items-center space-x-3 text-[10px] uppercase tracking-[0.3em] text-paper/40 hover:text-paper transition-colors">
                  <Instagram size={14} />
                  <span className="whitespace-nowrap">Fine Line</span>
                </a>
              </div>
              <a href="https://wa.me/5511966443885?text=Olá!%20Encontrei%20seu%20trabalho%20pelo%20Google%20e%20gostaria%20de%20solicitar%20um%20orçamento." target="_blank" rel="noreferrer" className="flex items-center space-x-3 text-[10px] uppercase tracking-[0.3em] text-paper/40 hover:text-paper transition-colors">
                <MessageCircle size={14} />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-16 left-16 hidden lg:block">
        <div className="flex flex-col space-y-4">
          <span className="text-[8px] uppercase tracking-[0.5em] text-paper/20 rotate-90 origin-left translate-x-1">Explorar</span>
          <div className="w-px h-24 bg-gradient-to-b from-white/20 to-transparent"></div>
        </div>
      </div>
    </section>
  );
};

const BioSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section id="sobre" className="py-24 md:py-48 px-6 bg-ink">
      <div className="max-w-[1400px] mx-auto grid md:grid-cols-12 gap-24 items-center">
        <div className="md:col-span-6 relative">
          <div className="aspect-[4/5] overflow-hidden rounded-sm">
            <img 
              src="https://i.postimg.cc/J4WH30vB/IMG_8420.jpg" 
              alt="Wylamis Lima em ação" 
              className="w-full h-full object-cover opacity-90 saturate-[0.8]"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
        
        <div className="md:col-span-6 space-y-12">
          <div className="space-y-6">
            <span className="text-gold text-[11px] uppercase tracking-[0.5em]">Sobre o Artista</span>
            <h2 className="text-4xl md:text-7xl font-serif leading-none text-paper">
              Legado <br /> e Arte
            </h2>
          </div>
          <div className="space-y-8 text-paper/50 font-light leading-relaxed max-w-xl">
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="text-xl font-serif italic text-paper/80"
            >
              "Sou Wylamis Lima, tatuador há mais de 13 anos e especialista em Realismo e Fine Line. Transformo ideias em obras permanentes, unindo técnica, precisão e olhar artístico apurado."
            </motion.p>
            
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden space-y-6"
                >
                  <p>
                    Minha trajetória começou de forma simples, mas com muita dedicação e visão. Ao longo dos anos, fui premiado em convenções e construí um nome sólido através de resultados consistentes e qualidade em cada detalhe.
                  </p>
                  <p>
                    Hoje, sou proprietário do Studio Mit Tattoo, um espaço sofisticado com múltiplos ambientes pensados para oferecer conforto, exclusividade e uma experiência diferenciada do início ao fim.
                  </p>
                  <p>
                    Se você busca uma tatuagem com alto nível técnico, profundidade artística e acabamento impecável, estou pronto para transformar sua ideia em arte.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[10px] uppercase tracking-[0.4em] text-gold hover:text-paper transition-colors flex items-center space-x-2"
            >
              <span>{isExpanded ? 'Ver Menos' : 'Ver Mais'}</span>
              <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                <ArrowRight size={12} className={cn("transition-transform", isExpanded ? "rotate-90" : "")} />
              </motion.div>
            </button>
          </div>
          <div className="pt-8">
            <a href="#contato" className="inline-flex items-center space-x-4 text-[10px] uppercase tracking-[0.4em] text-paper/40 hover:text-paper transition-colors">
              <span>Conhecer o Processo</span>
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const AwardsSection = () => {
  return (
    <section id="premiacoes" className="py-24 md:py-48 px-6 bg-paper text-ink overflow-hidden border-b border-ink/5">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid md:grid-cols-12 gap-16 items-center">
          <div className="md:col-span-5 space-y-10">
            <div className="flex items-center space-x-8">
              <div className="w-12 h-12 border border-ink/10 rounded-full flex items-center justify-center text-gold">
                <Award size={24} strokeWidth={1} />
              </div>
              <div className="space-y-1">
                <span className="text-ink/40 text-[9px] uppercase tracking-[0.6em]">Reconhecimento</span>
                <h2 className="text-3xl md:text-5xl font-serif">Excelência Premiada</h2>
              </div>
            </div>
            
            <div className="space-y-6">
              <p className="text-ink/60 text-lg font-serif italic leading-relaxed">
                "Uma trajetória marcada por conquistas consistentes que validam a qualidade técnica e artística do meu trabalho."
              </p>
              <p className="text-ink/50 text-sm font-light max-w-md leading-relaxed">
                Estes são alguns dos demais prêmios e troféus conquistados ao longo de mais de uma década de dedicação à arte da tatuagem, incluindo primeiros lugares em grandes festivais e convenções nacionais.
              </p>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="md:col-span-7 shadow-2xl rounded-sm overflow-hidden bg-ink/5"
          >
            <img 
              src="https://i.postimg.cc/jqD8BZTF/IMG_8822.jpg" 
              alt="Troféus Wylamis Lima" 
              className="w-full h-auto block"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const GallerySection = () => {
  const [activeTab, setActiveTab] = useState<GalleryTab>('realismo');
  const [visibleCount, setVisibleCount] = useState(3);
  const [isFullGalleryOpen, setIsFullGalleryOpen] = useState(false);

  // Set initial visible count based on screen size
  useEffect(() => {
    const updateInitialCount = () => {
      const isMobile = window.innerWidth < 768;
      setVisibleCount(isMobile ? 4 : 3);
    };
    
    updateInitialCount();
  }, [activeTab]);

  const filteredItems = GALLERY_ITEMS.filter(item => item.type === activeTab);
  const displayItems = filteredItems.slice(0, visibleCount);

  const handleLoadMore = () => {
    const isMobile = window.innerWidth < 768;
    setVisibleCount(prev => prev + (isMobile ? 4 : 3));
  };

  return (
    <section id="galeria" className="py-32 md:py-64 px-6 bg-ink">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
          <div className="space-y-6">
            <span className="text-gold text-[11px] uppercase tracking-[0.5em]">Portfólio</span>
            <h2 className="text-5xl md:text-8xl font-serif text-paper">Galeria</h2>
          </div>
          
          <div className="flex space-x-12 border-b border-white/5 pb-4">
            {(['realismo', 'fineline', 'studio'] as GalleryTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "text-[10px] uppercase tracking-[0.4em] pb-4 transition-all relative font-light",
                  activeTab === tab ? "text-paper" : "text-paper/30 hover:text-paper/60"
                )}
              >
                {tab === 'fineline' ? 'Fine Line' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <motion.div 
                    layoutId="gallery-tab"
                    className="absolute bottom-0 left-0 w-full h-px bg-gold"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
          {displayItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="aspect-[3/4] overflow-hidden bg-white/5 rounded-sm group relative cursor-none"
            >
              <motion.img 
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                src={item.url} 
                alt={item.title} 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-1000"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-[0.4em] text-gold">Obra</p>
                  <p className="text-sm font-serif text-paper">{item.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredItems.length > visibleCount && (
          <div className="mt-16 text-center flex flex-col items-center space-y-8">
            <button 
              onClick={handleLoadMore}
              className="group inline-flex items-center space-x-6 text-[10px] uppercase tracking-[0.5em] text-paper/40 hover:text-gold transition-all"
            >
              <div className="w-12 h-px bg-white/10 group-hover:bg-gold transition-colors"></div>
              <span>ver mais</span>
              <div className="w-12 h-px bg-white/10 group-hover:bg-gold transition-colors"></div>
            </button>

            <button 
              onClick={() => setIsFullGalleryOpen(true)}
              className="text-[9px] uppercase tracking-[0.3em] text-paper/20 hover:text-paper/60 transition-all underline underline-offset-8"
            >
              Ver Galeria Completa
            </button>
          </div>
        )}
      </div>

      {/* Full Gallery Modal */}
      <AnimatePresence>
        {isFullGalleryOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-ink overflow-y-auto pt-32 pb-24 px-6"
          >
            <div className="max-w-[1600px] mx-auto space-y-24">
              <div className="flex justify-between items-end border-b border-white/10 pb-12">
                <div className="space-y-4">
                  <span className="text-gold text-[11px] uppercase tracking-[0.6em]">Sessão Completa</span>
                  <h3 className="text-5xl md:text-7xl font-serif text-paper">
                    {activeTab === 'fineline' ? 'Fine Line' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                  </h3>
                </div>
                <button 
                  onClick={() => setIsFullGalleryOpen(false)}
                  className="text-paper/40 hover:text-gold transition-colors mb-2"
                >
                  <X size={40} strokeWidth={1} />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8">
                {filteredItems.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="aspect-[3/4] overflow-hidden rounded-sm group relative"
                  >
                    <img 
                      src={item.url} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-all duration-1000"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 md:p-8">
                      <p className="text-xs md:text-sm font-serif text-paper">{item.title}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const ExperienceSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const studioImages = [
    'https://i.postimg.cc/zD6RyVDS/IMG_8310.jpg',
    'https://i.postimg.cc/BZk1jXZm/IMG_8293.jpg',
    'https://i.postimg.cc/WpCJdhp8/IMG_8294.jpg',
    'https://i.postimg.cc/VspbJds4/IMG_8295.jpg',
    'https://i.postimg.cc/jdfnPtLT/IMG_8296.jpg',
    'https://i.postimg.cc/Qx7K1hVP/IMG_8297.jpg',
    'https://i.postimg.cc/pV4nmpVS/IMG_8298.jpg',
    'https://i.postimg.cc/28WLhrV5/IMG_8299.jpg',
    'https://i.postimg.cc/DyG4Ln80/IMG_8300.jpg',
    'https://i.postimg.cc/PrDvYTPL/IMG_8301.jpg',
    'https://i.postimg.cc/5NzQLb6Q/IMG_8203.jpg',
    'https://i.postimg.cc/Sxp2G3MS/IMG_8202.jpg',
    'https://i.postimg.cc/YCwGxZWj/Full_Size_Render.jpg',
    'https://i.postimg.cc/zG1bk6gF/IMG_8208.jpg',
    'https://i.postimg.cc/y8zgTtZc/IMG_8209.jpg',
    'https://i.postimg.cc/Gm18jVyq/IMG_8306.jpg',
    'https://i.postimg.cc/qvXtDwsx/IMG_8307.jpg',
  ];

  return (
    <section id="experiencia" className="pt-32 md:pt-64 pb-12 md:pb-20 px-6 bg-paper text-ink overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid md:grid-cols-2 gap-24 items-start mb-16">
          <div className="space-y-12">
            <div className="space-y-4">
              <span className="text-ink/30 text-[9px] uppercase tracking-[0.6em]">O Ateliê</span>
              <h2 className="text-4xl md:text-6xl font-serif leading-tight text-balance">Experiência <br /> Privada</h2>
              <p className="text-sm font-light opacity-50 leading-relaxed max-w-sm">
                Um refúgio de sofisticação projetado para oferecer o máximo conforto durante sua sessão.
              </p>
            </div>
            
            <div className="space-y-8">
              {[
                { title: 'Criação Autoral', desc: 'Desenhos desenvolvidos do zero para cada história.' },
                { title: 'Localização Discreta', desc: 'Espaço seguro focado no atendimento individual.' },
                { title: 'Precisão Técnica', desc: 'Materiais de alta performance e higiene rigorosa.' }
              ].map((item, i) => (
                <div key={i} className="group">
                  <div className="flex items-baseline space-x-4">
                    <span className="text-[8px] font-sans text-gold opacity-50">0{i+1}</span>
                    <div className="space-y-1">
                      <h4 className="text-lg font-serif tracking-wide group-hover:text-gold transition-colors">{item.title}</h4>
                      <p className="text-[11px] font-light opacity-40 max-w-xs">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-10">
            <div className="grid grid-cols-2 gap-3">
              {studioImages.slice(0, 3).map((img, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={cn(
                    "overflow-hidden rounded-sm transition-all duration-1000",
                    i === 0 ? "col-span-2 aspect-[16/8]" : "aspect-square"
                  )}
                >
                  <img src={img} className="w-full h-full object-cover" alt="Studio" />
                </motion.div>
              ))}
            </div>
            
            <button 
              onClick={() => setIsExpanded(true)}
              className="group flex items-center space-x-4 text-[9px] uppercase tracking-[0.4em] text-ink/40 hover:text-gold transition-all"
            >
              <div className="w-8 h-px bg-ink/10 group-hover:bg-gold transition-colors"></div>
              <span>Explorar Espaço</span>
            </button>
          </div>
        </div>
      </div>

      {/* Full Studio Gallery Modal */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-ink overflow-y-auto p-12 md:p-24"
          >
            <div className="max-w-6xl mx-auto space-y-24">
              <div className="flex justify-between items-end border-b border-white/10 pb-12">
                <div className="space-y-4">
                  <span className="text-gold text-[11px] uppercase tracking-[0.6em]">Tour Virtual</span>
                  <h3 className="text-5xl md:text-7xl font-serif text-paper italic">O Espaço</h3>
                </div>
                <button 
                  onClick={() => setIsExpanded(false)} 
                  className="text-paper/40 hover:text-gold transition-colors mb-2"
                >
                  <X size={40} strokeWidth={1} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {studioImages.map((img, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="aspect-video overflow-hidden rounded-sm"
                  >
                    <img src={img} className="w-full h-full object-cover transition-all duration-1000" alt={`Studio ${idx}`} />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const testimonials = [
    { name: "Celso Capocciama", text: "Lugar foda! O Will é um artista esperacular, traço fininho, sabe distinguir o que o cliente realmente quer! Olha essas tattoos" },
    { name: "Matheus lira", text: "Fiz uma tatuagem com o Will e curti muito o trabalho dele! Resultado ficou incrível e o Will é um cara super legal, profissional e simpático! O ambiente do estúdio é amplo e bem organizado!" },
    { name: "AUDREY FIORI", text: "Espaço incrivel, atendimento impecável, mas o melhor mesmo é o profissional Wil, super atencioso, mãos perfeitas para tatuar, traço perfeito! Ameiii e que venham muitas outras tattoos com o Wil!" },
    { name: "crismelhem", text: "Will Excelente profissional! Traços perfeitos, finos, super detalhista!!!! Ambiente acolhedor, música ambiente na medida, tudo maravilhoso! Não só recomendo como vou voltar com certeza!" }
  ];

  const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="pt-12 md:pt-20 pb-32 md:pb-64 px-6 bg-paper text-ink overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center space-y-6 mb-24">
          <span className="text-ink/40 text-[11px] uppercase tracking-[0.6em]">Depoimentos</span>
          <h2 className="text-5xl md:text-8xl font-serif">Feedback</h2>
        </div>
        
        <div className="relative max-w-4xl mx-auto">
          <div className="relative h-[400px] md:h-[300px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 flex flex-col items-center justify-center space-y-8 text-center"
              >
                <div className="flex justify-center space-x-1">
                  {[...Array(5)].map((_, starIndex) => (
                    <Star key={starIndex} size={16} className="fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-xl md:text-3xl font-serif italic opacity-80 leading-relaxed px-4">
                  "{testimonials[currentIndex].text}"
                </p>
                <div className="pt-6 border-t border-ink/10 inline-block">
                  <span className="text-[10px] uppercase tracking-[0.5em] font-medium">
                    {testimonials[currentIndex].name}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex justify-center items-center space-x-8 md:space-x-12 mt-12">
            <button 
              onClick={prev}
              className="w-12 h-12 rounded-full border border-ink/10 flex items-center justify-center hover:border-gold hover:text-gold transition-all duration-500 group"
              aria-label="Depoimento anterior"
            >
              <ChevronLeft size={20} strokeWidth={1} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            
            <div className="flex space-x-3">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full transition-all duration-500",
                    currentIndex === i ? "bg-gold w-8" : "bg-ink/10"
                  )}
                  aria-label={`Ir para depoimento ${i + 1}`}
                />
              ))}
            </div>

            <button 
              onClick={next}
              className="w-12 h-12 rounded-full border border-ink/10 flex items-center justify-center hover:border-gold hover:text-gold transition-all duration-500 group"
              aria-label="Próximo depoimento"
            >
              <ChevronRight size={20} strokeWidth={1} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const ContactSection = () => {
  return (
    <section id="contato" className="py-32 md:py-48 px-6 bg-ink relative">
      <div className="max-w-[1200px] mx-auto">
        <div className="space-y-24">
          <div className="space-y-8 text-center md:text-left">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-gold text-[11px] uppercase tracking-[0.8em] block"
            >
              Agendamento & Consultoria
            </motion.span>
            <h2 className="text-5xl md:text-8xl font-serif text-paper leading-tight tracking-tight">
              Inicie seu <span className="font-script text-gold text-6xl md:text-9xl ml-4">Projeto</span>
            </h2>
            <p className="text-paper/40 font-light text-lg max-w-2xl mx-auto md:mx-0 leading-relaxed">
              Cada tatuagem é uma obra de arte única. Clique no número abaixo para iniciar sua consultoria via WhatsApp.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 pt-16 border-t border-white/5">
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-[0.4em] text-paper/20">WhatsApp</span>
              <a 
                href="https://wa.me/5511966443885?text=Olá!%20Encontrei%20seu%20trabalho%20pelo%20Google%20e%20gostaria%20de%20solicitar%20um%20orçamento." 
                target="_blank" 
                rel="noreferrer"
                className="group flex items-center space-x-6"
              >
                <div className="flex flex-col">
                  <span className="text-base md:text-lg font-sans font-extralight tracking-[0.15em] text-paper group-hover:text-gold transition-colors duration-500 leading-none">
                    (11) 96644-3885
                  </span>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[9px] uppercase tracking-[0.3em] text-emerald-500/80 font-medium">Clique para conversar</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-gold/50 group-hover:bg-gold/5 transition-all duration-500 shrink-0">
                  <MessageCircle size={18} className="text-paper group-hover:text-gold transition-colors" />
                </div>
              </a>
            </div>

            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-[0.4em] text-paper/20">Localização</span>
              <div className="space-y-1">
                <p className="text-xl font-serif text-paper">Vila Mariana, São Paulo</p>
                <p className="text-xs font-light text-paper/40 tracking-wider">Rua Áurea, 168</p>
              </div>
            </div>

            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-[0.4em] text-paper/20">Social</span>
              <div className="flex flex-col space-y-4">
                <a href="https://instagram.com/will.limatattoo" target="_blank" rel="noreferrer" className="flex items-center space-x-3 text-xl font-serif text-paper hover:text-gold transition-colors">
                  <Instagram size={20} className="text-gold" />
                  <span className="whitespace-nowrap">Realismo</span>
                </a>
                <a href="https://instagram.com/will.limafineline" target="_blank" rel="noreferrer" className="flex items-center space-x-3 text-xl font-serif text-paper hover:text-gold transition-colors">
                  <Instagram size={20} className="text-gold" />
                  <span className="whitespace-nowrap">Fine Line</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const CourseSection = () => {
  const courses = [
    {
      id: 'beginner',
      tag: 'Iniciante',
      title: 'Curso de Tatuagem para Iniciantes',
      desc: 'O ponto de partida ideal para quem deseja ingressar no mundo da tatuagem. Do zero ao primeiro traço com segurança e técnica.',
      features: ['Fundamentos do Desenho', 'Biossegurança Completa', 'Configuração de Máquinas', 'Prática em Pele Artificial'],
      image: 'https://i.postimg.cc/PrBDLNyJ/IMG_8244.jpg'
    },
    {
      id: 'mentoring',
      tag: 'Personalizado',
      title: 'Mentoria Individual VIP',
      desc: 'Acompanhamento exclusivo e personalizado para acelerar sua evolução técnica e posicionamento de mercado.',
      features: ['Análise de Portfólio', 'Correção de Vícios', 'Gestão de Estúdio', 'Fotografia e Edição'],
      image: 'https://i.postimg.cc/ZK1N90Hb/IMG_8222.jpg'
    }
  ];

  return (
    <section id="cursos" className="py-32 md:py-48 px-6 bg-ink relative overflow-hidden min-h-screen flex items-center">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gold/5 blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gold/5 blur-[100px] -z-10" />

      <div className="max-w-[1400px] mx-auto w-full">
        <div className="text-center space-y-6 mb-24">
          <div className="flex items-center justify-center space-x-4">
            <GraduationCap className="text-gold" size={24} strokeWidth={1.5} />
            <span className="text-gold text-[11px] uppercase tracking-[0.6em] block">Educação & Evolução</span>
          </div>
          <h2 className="text-5xl md:text-8xl font-serif text-paper">Formação Profissional</h2>
          <p className="text-paper/40 text-sm md:text-base font-light max-w-2xl mx-auto leading-relaxed">
            Compartilhando a técnica e a visão artística que me levaram aos maiores palcos da tatuagem mundial. Escolha o seu nível de evolução.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {courses.map((course, idx) => (
            <motion.div 
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              viewport={{ once: true }}
              className="group flex flex-col h-full bg-white/[0.02] border border-white/5 rounded-sm overflow-hidden hover:border-gold/30 transition-all duration-500"
            >
              <div className="aspect-[16/10] overflow-hidden relative">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-6 left-6 bg-gold/90 text-ink text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full">
                  {course.tag}
                </div>
              </div>
              
              <div className="p-10 flex flex-col flex-grow space-y-8">
                <div className="space-y-4">
                  <h3 className="text-2xl font-serif text-paper group-hover:text-gold transition-colors duration-500 leading-tight">
                    {course.title}
                  </h3>
                  <p className="text-paper/40 text-sm font-light leading-relaxed">
                    {course.desc}
                  </p>
                </div>

                <div className="space-y-3 flex-grow">
                  {course.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-center space-x-3 text-[10px] text-paper/60 uppercase tracking-widest">
                      <div className="w-1 h-1 bg-gold rounded-full" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-white/5">
                  <a 
                    href={`https://wa.me/5511966443885?text=Olá!%20Encontrei%20seu%20perfil%20pelo%20Google%20e%20gostaria%20de%20mais%20informações%20sobre%20o%20curso:%20${course.title}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between group/btn"
                  >
                    <span className="text-[10px] uppercase tracking-[0.4em] text-paper/40 group-hover/btn:text-gold transition-colors">Saber mais</span>
                    <ArrowRight size={16} className="text-gold group-hover/btn:translate-x-2 transition-transform" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-16 px-6 bg-ink border-t border-white/5">
      <div className="max-w-[1200px] mx-auto flex flex-col items-center justify-center gap-4">
        <span className="font-serif text-3xl tracking-tighter text-paper">W.L</span>
        <p className="text-[8px] uppercase tracking-[0.4em] text-paper/20">© {new Date().getFullYear()} Ateliê de Tatuagem. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

const WhatsAppCTA = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;
      
      const isNearBottom = fullHeight - (scrollPosition + windowHeight) < 800;
      setIsVisible(scrollPosition > 500 && !isNearBottom);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.a 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          whileHover={{ scale: 1.05 }}
          href="https://wa.me/5511966443885?text=Olá!%20Encontrei%20seu%20trabalho%20pelo%20Google%20e%20gostaria%20de%20solicitar%20um%20orçamento." 
          target="_blank" 
          rel="noopener noreferrer"
          className="fixed bottom-8 right-8 z-50 flex items-center space-x-4 bg-ink/90 backdrop-blur-xl border border-white/10 text-paper px-6 py-3 rounded-full shadow-2xl group transition-all duration-500"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gold/20 rounded-full blur-md animate-pulse" />
            <MessageCircle size={18} className="relative text-gold" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.4em] font-light">Solicitar Orçamento</span>
        </motion.a>
      )}
    </AnimatePresence>
  );
};

// --- Custom Cursor Component ---
const CustomCursor = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      setIsHovering(
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') !== null || 
        target.closest('button') !== null
      );
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const springConfig = { damping: 25, stiffness: 150 };
  const cursorX = useSpring(mousePos.x - 4, springConfig);
  const cursorY = useSpring(mousePos.y - 4, springConfig);
  const followerX = useSpring(mousePos.x - 20, springConfig);
  const followerY = useSpring(mousePos.y - 20, springConfig);

  return (
    <>
      <motion.div 
        className="custom-cursor hidden md:block"
        style={{ x: cursorX, y: cursorY, scale: isHovering ? 2.5 : 1 }}
      />
      <motion.div 
        className="custom-cursor-follower hidden md:block"
        style={{ x: followerX, y: followerY, scale: isHovering ? 1.5 : 1, opacity: isHovering ? 0.5 : 1 }}
      />
    </>
  );
};

// --- Main App ---

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    } else {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [pathname, hash]);
  
  return null;
};

const HomePage = () => (
  <main>
    <Hero />
    <BioSection />
    <GallerySection />
    <AwardsSection />
    <ExperienceSection />
    <TestimonialsSection />
    <ContactSection />
  </main>
);

const CoursesPage = () => (
  <main>
    <CourseSection />
    <ContactSection />
  </main>
);

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="relative">
        <div className="grain" />
        <CustomCursor />
        <Navbar />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cursos" element={<CoursesPage />} />
        </Routes>

        <Footer />
        <WhatsAppCTA />
      </div>
    </Router>
  );
}

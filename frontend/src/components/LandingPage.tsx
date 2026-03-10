import { useRef, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, Clock, ChefHat, Flame, Sparkles } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// ─── Constants ──────────────────────────────────────────────────────────────

const ACCENT = {
  green: "#00A388",
  purple: "#9A85A3",
  teal: "#6B9EAF",
  clay: "#D48C84",
  ochre: "#D0A97D",
};

const INGREDIENTS_DATA = [
  { name: "Aubergine", color: ACCENT.purple, shape: "rounded-[20px_20px_8px_8px]", w: 42, h: 62, shelf: 0, left: "12%" },
  { name: "Miso Paste", color: ACCENT.ochre, shape: "rounded-full", w: 48, h: 38, shelf: 0, left: "45%" },
  { name: "Sesame Oil", color: ACCENT.clay, shape: "rounded-lg", w: 28, h: 78, shelf: 1, left: "72%" },
  { name: "Tofu", color: "#FFFFFF", shape: "rounded-lg", w: 56, h: 32, shelf: 1, left: "18%" },
  { name: "Spring Onions", color: ACCENT.green, shape: "rounded-xl", w: 38, h: 42, shelf: 2, left: "58%" },
  { name: "Rice", color: ACCENT.ochre, shape: "rounded-full", w: 42, h: 42, shelf: 2, left: "18%" },
];

const TOOLTIP_DATA = [
  { label: "Aubergine", confidence: "98%", x: -140, y: 80 },
  { label: "Miso Paste", confidence: "95%", x: 160, y: 100 },
  { label: "Sesame Oil", confidence: "91%", x: 160, y: 220 },
  { label: "Tofu", confidence: "89%", x: -140, y: 240 },
];

const RECIPE_INGREDIENTS = [
  { label: "2 Medium Aubergines", found: true },
  { label: "White Miso Paste", found: true },
  { label: "Sesame Oil", found: true },
  { label: "Firm Tofu (200g)", found: true },
  { label: "Spring Onions", found: false },
];

// ─── SVG Donut Chart ────────────────────────────────────────────────────────

function NutritionChart() {
  const size = 120;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Segments: protein 30%, carbs 45%, fat 25%
  const segments = [
    { pct: 0.30, color: ACCENT.teal, label: "Protein" },
    { pct: 0.45, color: ACCENT.ochre, label: "Carbs" },
    { pct: 0.25, color: ACCENT.clay, label: "Fat" },
  ];

  let offset = 0;

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <svg width={size} height={size} className="-rotate-90">
          {segments.map((seg) => {
            const dashLen = circumference * seg.pct;
            const dashGap = circumference - dashLen;
            const el = (
              <circle
                key={seg.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dashLen} ${dashGap}`}
                strokeDashoffset={-offset}
                strokeLinecap="round"
              />
            );
            offset += dashLen;
            return el;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-semibold text-text-main">540</span>
          <span className="text-[10px] font-medium text-text-muted">kcal</span>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2 text-xs">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: seg.color }} />
            <span className="text-text-muted">{seg.label}</span>
            <span className="font-medium text-text-main">{Math.round(seg.pct * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Landing Page Component ─────────────────────────────────────────────────

export default function LandingPage() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  // Element refs for GSAP
  const heroTextRef = useRef<HTMLDivElement>(null);
  const fridgeRef = useRef<HTMLDivElement>(null);
  const leftDoorRef = useRef<HTMLDivElement>(null);
  const rightDoorRef = useRef<HTMLDivElement>(null);
  const scanLineRef = useRef<HTMLDivElement>(null);
  const scanGlowRef = useRef<HTMLDivElement>(null);
  const tooltipsRef = useRef<HTMLDivElement>(null);
  const recipeCardRef = useRef<HTMLDivElement>(null);
  const recipeDashRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          pin: stickyRef.current,
          anticipatePin: 1,
        },
      });

      // ─── Phase 1 (0–15%): Hero text visible, fridge centered ─────
      // Hero text fades out
      tl.to(
        heroTextRef.current,
        { opacity: 0, y: -30, duration: 15 },
        0,
      );

      // ─── Phase 2 (15–40%): Doors open, scan line sweeps, tooltips ─
      // Left door opens
      tl.to(
        leftDoorRef.current,
        { rotateY: -115, duration: 15, ease: "power2.out" },
        10,
      );
      // Right door opens
      tl.to(
        rightDoorRef.current,
        { rotateY: 115, duration: 15, ease: "power2.out" },
        10,
      );

      // Scan line sweeps down
      tl.fromTo(
        scanLineRef.current,
        { top: "0%", opacity: 0 },
        { top: "100%", opacity: 1, duration: 20, ease: "none" },
        20,
      );
      tl.fromTo(
        scanGlowRef.current,
        { top: "0%", opacity: 0 },
        { top: "100%", opacity: 1, duration: 20, ease: "none" },
        20,
      );
      // Fade out scan line at end
      tl.to(scanLineRef.current, { opacity: 0, duration: 3 }, 38);
      tl.to(scanGlowRef.current, { opacity: 0, duration: 3 }, 38);

      // Tooltips pop in staggered
      const tooltipEls = tooltipsRef.current?.children;
      if (tooltipEls) {
        tl.fromTo(
          tooltipEls,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 5, stagger: 3, ease: "back.out(1.7)" },
          25,
        );
        // Fade tooltips out before transition
        tl.to(
          tooltipEls,
          { opacity: 0, scale: 0.8, duration: 5, stagger: 1 },
          38,
        );
      }

      // ─── Phase 3 (40–70%): Fridge shrinks left, recipe card enters ─
      // Fridge moves left + scales down + fades
      tl.to(
        fridgeRef.current,
        { x: -250, scale: 0.65, opacity: 0.3, duration: 20, ease: "power2.inOut" },
        40,
      );
      // Recipe card enters from right
      tl.fromTo(
        recipeCardRef.current,
        { x: 300, scale: 0.85, opacity: 0 },
        { x: 80, scale: 1, opacity: 1, duration: 20, ease: "power2.out" },
        42,
      );

      // ─── Phase 4 (70–100%): Recipe card centers, dashboard reveals ─
      // Fridge fully fades
      tl.to(
        fridgeRef.current,
        { opacity: 0, duration: 8 },
        65,
      );
      // Recipe card centers
      tl.to(
        recipeCardRef.current,
        { x: 0, duration: 15, ease: "power2.inOut" },
        68,
      );
      // Dashboard content fades in
      tl.fromTo(
        recipeDashRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 12, ease: "power2.out" },
        75,
      );
      // CTA button fades in
      tl.fromTo(
        ctaRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 10, ease: "power2.out" },
        85,
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative bg-[#F5F5F7]" style={{ height: "400vh" }}>
      {/* ── Fixed Navigation ─────────────────────────────────────────────── */}
      <nav className="fixed left-0 top-0 z-50 flex w-full items-center justify-between px-8 py-6 md:px-12">
        <span className="text-xl font-semibold tracking-tight text-text-main">
          WhatToCook
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/login")}
            className="rounded-full px-4 py-2 text-sm font-medium text-text-muted transition-colors hover:text-text-main"
            style={{ transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/register")}
            className="rounded-full bg-primary-500 px-5 py-2 text-sm font-medium text-white transition-all hover:bg-primary-600"
            style={{
              boxShadow: "0 4px 14px rgba(0,163,136,0.3)",
              transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            }}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* ── Sticky Scene ─────────────────────────────────────────────────── */}
      <div
        ref={stickyRef}
        className="flex h-screen w-full items-center justify-center overflow-hidden"
        style={{ perspective: 1200 }}
      >
        {/* ── Hero Text ──────────────────────────────────────────────────── */}
        <div
          ref={heroTextRef}
          className="absolute left-1/2 top-[14%] z-40 -translate-x-1/2 text-center"
        >
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-text-main md:text-5xl lg:text-6xl">
            WhatToCook.
          </h1>
          <p className="mt-3 text-lg font-medium text-text-muted md:text-xl">
            Your Fridge. Your Recipes. Simply AI.
          </p>
        </div>

        {/* ── 3D CSS Fridge ───────────────────────────────────────────────── */}
        <div
          ref={fridgeRef}
          className="relative"
          style={{
            width: 320,
            height: 520,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Fridge body */}
          <div
            className="absolute inset-0 rounded-3xl"
            style={{
              background: "#F0F0F2",
              boxShadow:
                "inset 0 0 0 1px rgba(0,0,0,0.04), 0 40px 80px -20px rgba(0,0,0,0.08)",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Interior */}
            <div
              className="absolute overflow-hidden rounded-2xl bg-white"
              style={{
                inset: 12,
                boxShadow: "inset 0 10px 30px rgba(0,0,0,0.03)",
              }}
            >
              {/* Shelves + Ingredients */}
              {[0, 1, 2].map((shelfIndex) => (
                <div
                  key={shelfIndex}
                  className="relative mx-4 border-b border-[#EBECEE]"
                  style={{
                    height: shelfIndex === 0 ? 120 : 130,
                    marginTop: shelfIndex === 0 ? 24 : 0,
                  }}
                >
                  {INGREDIENTS_DATA
                    .filter((ing) => ing.shelf === shelfIndex)
                    .map((ing) => (
                      <div
                        key={ing.name}
                        className={`absolute bottom-2 ${ing.shape}`}
                        style={{
                          left: ing.left,
                          width: ing.w,
                          height: ing.h,
                          backgroundColor: ing.color,
                          border: "1px solid rgba(0,0,0,0.06)",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                        }}
                      />
                    ))}
                </div>
              ))}

              {/* Scan line */}
              <div
                ref={scanLineRef}
                className="absolute left-0 z-10 w-full"
                style={{
                  top: "0%",
                  height: 2,
                  backgroundColor: ACCENT.green,
                  boxShadow: `0 0 20px 4px rgba(0,163,136,0.5)`,
                  opacity: 0,
                }}
              />
              {/* Scan glow overlay */}
              <div
                ref={scanGlowRef}
                className="absolute left-0 z-[9] w-full"
                style={{
                  top: "0%",
                  height: 60,
                  background: `linear-gradient(to bottom, rgba(0,163,136,0.12) 0%, transparent 100%)`,
                  opacity: 0,
                }}
              />
            </div>
          </div>

          {/* Left door */}
          <div
            className="absolute left-0 top-0 h-full w-1/2"
            style={{
              perspective: 1000,
              transformStyle: "preserve-3d",
            }}
          >
            <div
              ref={leftDoorRef}
              className="absolute h-full w-full rounded-l-3xl"
              style={{
                background: "#F0F0F2",
                border: "1px solid rgba(0,0,0,0.04)",
                borderRight: "0.5px solid rgba(0,0,0,0.06)",
                transformStyle: "preserve-3d",
                transformOrigin: "left center",
              }}
            >
              <div
                className="absolute right-3 top-1/2 w-1.5 rounded-full"
                style={{
                  height: 56,
                  transform: "translateY(-50%)",
                  backgroundColor: "#D1D1D6",
                }}
              />
            </div>
          </div>

          {/* Right door */}
          <div
            className="absolute right-0 top-0 h-full w-1/2"
            style={{
              perspective: 1000,
              transformStyle: "preserve-3d",
            }}
          >
            <div
              ref={rightDoorRef}
              className="absolute h-full w-full rounded-r-3xl"
              style={{
                background: "#F0F0F2",
                border: "1px solid rgba(0,0,0,0.04)",
                borderLeft: "0.5px solid rgba(0,0,0,0.06)",
                transformStyle: "preserve-3d",
                transformOrigin: "right center",
              }}
            >
              <div
                className="absolute left-3 top-1/2 w-1.5 rounded-full"
                style={{
                  height: 56,
                  transform: "translateY(-50%)",
                  backgroundColor: "#D1D1D6",
                }}
              />
            </div>
          </div>

          {/* ── Glassmorphic Tooltips ─────────────────────────────────────── */}
          <div ref={tooltipsRef} className="pointer-events-none absolute inset-0 z-30">
            {TOOLTIP_DATA.map((tip) => (
              <div
                key={tip.label}
                className="absolute flex items-center gap-2 rounded-full px-3 py-1.5"
                style={{
                  left: `calc(50% + ${tip.x}px)`,
                  top: tip.y,
                  background: "rgba(255,255,255,0.8)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.5)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                  opacity: 0,
                  transform: "scale(0)",
                }}
              >
                <div
                  className="flex h-5 w-5 items-center justify-center rounded-full"
                  style={{ backgroundColor: ACCENT.green }}
                >
                  <Check className="h-3 w-3 text-white" strokeWidth={3} />
                </div>
                <span className="text-xs font-medium text-text-main">{tip.label}</span>
                <span className="text-[10px] font-medium text-text-muted">{tip.confidence}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Recipe Card ────────────────────────────────────────────────── */}
        <div
          ref={recipeCardRef}
          className="absolute z-20 flex w-[420px] max-w-[90vw] flex-col overflow-hidden rounded-3xl bg-white"
          style={{
            boxShadow:
              "0 0 0 1px rgba(0,0,0,0.03), 0 30px 60px -15px rgba(0,0,0,0.08), 0 10px 20px -5px rgba(0,0,0,0.04)",
            opacity: 0,
            transform: "translateX(300px) scale(0.85)",
          }}
        >
          {/* Card Header */}
          <div className="px-8 pt-8 pb-0">
            {/* Badge */}
            <div className="mb-4 flex items-center gap-2">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider"
                style={{
                  backgroundColor: "rgba(0,163,136,0.08)",
                  color: ACCENT.green,
                }}
              >
                <Sparkles className="h-3 w-3" />
                AI Generated
              </span>
              <span className="text-[11px] font-medium text-text-muted">4/5 ingredients matched</span>
            </div>

            {/* Title */}
            <h2 className="mb-1 text-2xl font-semibold leading-tight tracking-tight text-text-main">
              Roasted Aubergine
              <br />
              <span style={{ color: ACCENT.teal }}>with Miso Glaze</span>
            </h2>
          </div>

          {/* Dashboard Content (fades in during Phase 4) */}
          <div ref={recipeDashRef} className="px-8 pb-8 pt-4" style={{ opacity: 0 }}>
            {/* Toggle tabs */}
            <div className="mb-5 flex gap-1 rounded-full bg-[#F5F5F7] p-1">
              <button className="flex-1 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-text-main shadow-sm">
                Overview
              </button>
              <button className="flex-1 rounded-full px-3 py-1.5 text-xs font-medium text-text-muted">
                Steps
              </button>
            </div>

            {/* Nutrition Chart */}
            <div className="mb-5">
              <NutritionChart />
            </div>

            {/* Data Grid */}
            <div className="mb-5 grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center rounded-2xl bg-[#F5F5F7] px-3 py-3">
                <Clock className="mb-1 h-4 w-4 text-text-muted" />
                <span className="text-sm font-semibold text-text-main">15 min</span>
                <span className="text-[10px] text-text-muted">Prep</span>
              </div>
              <div className="flex flex-col items-center rounded-2xl bg-[#F5F5F7] px-3 py-3">
                <Flame className="mb-1 h-4 w-4 text-text-muted" />
                <span className="text-sm font-semibold text-text-main">25 min</span>
                <span className="text-[10px] text-text-muted">Cook</span>
              </div>
              <div className="flex flex-col items-center rounded-2xl bg-[#F5F5F7] px-3 py-3">
                <ChefHat className="mb-1 h-4 w-4 text-text-muted" />
                <span className="text-sm font-semibold text-text-main">Easy</span>
                <span className="text-[10px] text-text-muted">Complexity</span>
              </div>
            </div>

            {/* Ingredients Match List */}
            <h3 className="mb-3 text-sm font-semibold tracking-tight text-text-main">
              Ingredients
            </h3>
            <ul className="mb-6 flex flex-col gap-2">
              {RECIPE_INGREDIENTS.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center gap-2.5 text-sm"
                >
                  <div
                    className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: item.found ? ACCENT.green : "#EBECEE",
                    }}
                  >
                    {item.found && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
                  </div>
                  <span className={item.found ? "text-text-main" : "text-text-muted"}>
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <div ref={ctaRef} style={{ opacity: 0 }}>
              <button
                onClick={() => navigate("/register")}
                className="w-full rounded-2xl bg-primary-500 py-3.5 text-sm font-semibold text-white transition-all hover:bg-primary-600"
                style={{
                  boxShadow: "0 8px 24px rgba(0,163,136,0.3)",
                  transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                }}
              >
                Generate Your First Meal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

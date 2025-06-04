// memoryStore.ts

export type MemoryEntry = {
  type: 'log' | 'plan' | 'focus' | 'task';
  content: string;
  timestamp: string;
};

export type GoalStructure = {
  mainGoals: string[];
  weeklyGoals: string[];
  todayTasks: string[];
  logs: MemoryEntry[];
  focusItems: string[];
};

export const memoryData: GoalStructure = {
  mainGoals: [
    "PLACEMENT PREPARATION - Finish complete DIGITAL + ANALOG prep before December 2025 (cover all important PDFs, lectures, and problem banks)",
    "PROJECT - Reverse engineer Mesa GPU pipeline and design a programmable OpenGL 2.0 compliant GPU core by June 2026",
    "TERMINAL OS - Build a fully local-first AI terminal HUD that can log, plan, reflect, and simulate personal intelligence (with LoRA + RAG integration)",
    "STRATEGIST AI - Fine-tune a Phi-2 LoRA model on 2.5k high-quality personal Q&A pairs to reflect your reasoning style and use it for lifelong learning (starting with Game Theory)",
    "FP16 GPU PIPELINE - Build a working FPADD, FPDIV, FPMUL, FPLOG, FPEXP unit using Verilog with pipelining, PLA, and LUT-based optimization, then synthesize on FPGA and later for TSMC 65nm",
    "DOCUMENTATION - Maintain structured LaTeX documentation for analog, digital, and GPU pipeline; include all concepts, formulas, and test logs",
    "FOCUS & RESISTANCE - Build a mental system that tracks focus, mood, and resilience to distraction through terminal logs and reflections"
  ],

  weeklyGoals: [
    "DIGITAL: Complete Chapters 1–3 of the DIGITAL questions PDF this week with 20+ problems solved each",
    "ANALOG: Study and log Chembiyan Lectures 1–10; focus on power sign convention, Thevenin, and superposition",
    "PROJECT: Summarize Mesa's draw pipeline from draw_context to rasterizer",
    "TERMINAL OS: Add RAG + log-to-memory linkage; simulate live recall in `buildPrompt()`",
    "FPDIV: Finish pipelined multiplier testbench, verify corner cases, then insert PLA rounding stage",
    "STRATEGIST AI: Write or refine 300 Q&A pairs from Thinking Strategically (focus on dominance, backward induction, rationality)",
    "MINDSET: Log 3 focus entries, 1 reflection on distraction triggers, and reinforce calm-before-talking mental frame"
  ],

  todayTasks: [
    "DIGITAL: Solve 20 problems from DIGITAL PDF - Chapter 1 (number systems, gates)",
    "ANALOG: Study Chembiyan Lecture 4 (Thevenin + Superposition), log main idea",
    "GPU: Summarize `draw_vs.c` vertex shading logic",
    "FPDIV: Test Verilog division on denormals and divide-by-zero",
    "TERMINAL: Add tonePrompt and RAG chunk injection to contextBuilder",
    "STRATEGIST: Curate 10 new instruction-response pairs in your tone",
    "REFLECT: Write 1 mood/focus log on mental clarity + distraction today"
  ],

  logs: [
    {
      type: "log",
      content: "Understood Thevenin's trick using source-kill + load-scan idea. Applied to DIGITAL Q6.",
      timestamp: "2025-05-22T10:40:00Z"
    },
    {
      type: "log",
      content: "Mesa draw_context pipeline is modular — each primitive stage is clearly separated, making reverse engineering easier.",
      timestamp: "2025-05-22T12:20:00Z"
    },
    {
      type: "log",
      content: "FPDIV Verilog unit needs PLA rounding for subnormal numbers. Rounding happens post-alignment.",
      timestamp: "2025-05-22T14:00:00Z"
    },
    {
      type: "log",
      content: "Teaching style matters — added 'brutally honest', 'first principles', and 'layer-by-layer explanation' to tone rules.",
      timestamp: "2025-05-23T08:20:00Z"
    },
    {
      type: "log",
      content: "Tested terminal log + plan + task memory injection — prompt feels more alive when fed with real context.",
      timestamp: "2025-05-23T10:15:00Z"
    },
    {
      type: "log",
      content: "Decided to first test Phi-2 to its max before moving to Mistral. Goal: see intelligence feel before upgrading.",
      timestamp: "2025-05-23T11:50:00Z"
    },
    {
      type: "log",
      content: "Finalized mindset: focus comes before ambition. Let clarity, resistance to distraction, and deep execution guide the system.",
      timestamp: "2025-05-23T12:30:00Z"
    }
  ],
  
  focusItems: [
    "Do not break the streak — one digital chapter + one analog lecture per day",
    "No GPU updates unless daily prep goals are done first",
    "Terminal memory must evolve — daily logs and thoughts should shape prompt-building",
    "Reinforce calm, collected expression — talk less, log more",
    "Start every session with 'What am I trying to do?' before touching code or problems"
  ]
  
};

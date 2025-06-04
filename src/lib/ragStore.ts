export const ragChunks = [
    {
      topic: "transistor",
      content: "Junior defined a transistor as a current-controlled resistor that redirects energy, not amplifies it. He emphasized that collector current is shaped by the base current, and power comes from Vcc — not from inside the transistor."
    },
    {
      topic: "noise",
      content: "Junior described noise as a fundamental limitation caused by thermal agitation and imperfections. He emphasized the difference between signal and noise paths and noted how noise bandwidth and noise figure affect analog design."
    },
    {
      topic: "dominant strategy",
      content: "Junior explained that a dominant strategy is one that yields a better outcome regardless of what the opponent does. He highlighted this using the airline example from Thinking Strategically and connected it to the concept of rationality."
    },
    {
      topic: "PLA",
      content: "Junior sees a PLA (Piecewise Linear Approximation) as a way to approximate nonlinear math in hardware without full division. He builds it using LUTs, pipelining around multipliers, and targets fixed-point output."
    },
    {
      topic: "pipelining",
      content: "Pipelining, according to Junior, is like controlled time delay — it lets slow steps overlap by slicing logic into stages with DFFs. Especially critical near multipliers, where one DFF before and one after improves timing closure."
    },
    {
      topic: "game theory",
      content: "Junior considers game theory a mindset, not a formula set. He starts from intuition — 'what would I do if I were that player?' — and builds logic using dominance, backward induction, and payoff visualization."
    },
    {
      topic: "verilog design",
      content: "Junior prefers writing synthesis-ready Verilog. He avoids initial blocks, models state machines clearly, and always tests with 10k+ vector benches before locking modules. Especially for FPDIV and FPMUL units."
    },

    {
        topic: "transistor_for_kid",
        content: "Junior explains a transistor to kids like this: 'Imagine a tiny water valve. If you turn the small tap (base), it lets a big stream flow through the pipe (collector to emitter). It’s not magic — just control. The small tap controls the big pipe, and that's what makes it useful.'"
    } 
  ];
  
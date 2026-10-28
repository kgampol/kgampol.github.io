// Everything the site says about Kenneth lives here, so copy edits never
// touch layout code. Sourced from the current resumes.

export const profile = {
  name: "Kenneth Gampol",
  role: "AI/ML Software Engineer",
  org: "The Boeing Company",
  location: "St. Louis, MO",
  summary: [
    "I'm an AI/ML software engineer at Boeing in St. Louis, working where machine learning meets flight software: agentic code generation for flight test, real-time edge inference, and autonomous aerial refueling.",
    "I started as a mechanical engineer, so I think in loads, margins, and failure modes. I bring that habit to software. Everything I ship has to be fast, deterministic, and safe enough to put on an aircraft.",
  ],
  badges: ["US Citizen", "Active Secret Clearance", "Willing to Relocate"],
  email: "kgampol@alumni.upenn.edu",
  links: {
    linkedin: "https://www.linkedin.com/in/kennethgampol",
    github: "https://github.com/kgampol",
    resume: "/docs/Kenneth_Gampol_Resume.pdf",
  },
  photo: "/img/kenneth.jpg",
} as const;

export const stats = [
  { value: "Months → hours", label: "Mission-plan review time after automated validation" },
  { value: "$400K", label: "Projected labor savings from a computer vision line" },
  { value: "~40%", label: "Token cost and latency cut in a RAG assistant" },
  { value: "Top 100", label: "Intern in the nation, WayUp & Yello" },
] as const;

export type Role = {
  title: string;
  org: string;
  logo?: string;
  place: string;
  dates: string;
  points: string[];
  tags: string[];
};

export const experience: Role[] = [
  {
    title: "AI/ML Software Engineer",
    org: "The Boeing Company",
    logo: "/img/boeing.png",
    place: "St. Louis, MO",
    dates: "Aug 2025 — Present",
    points: [
      "Designed an agentic AI pipeline that automates C code generation for flight test, then pitched it to executive leadership and secured funding for full deployment.",
      "Built a C# pre-mission validation pipeline that runs pilots' planned trajectories through a simulation harness and flags anomalies automatically, cutting mission-plan review from months to hours.",
      "Engineered a BERT-based semantic verifier (PyTorch, HuggingFace) that scores LLM output against specs as an evaluation and guardrail layer.",
      "Architected a zero-allocation C++ UDP multicast streaming library feeding an NVIDIA Thor platform running CUDA-accelerated computer vision at the edge.",
      "Developed a static-memory C++ formation flight controller for autonomous aerial refueling under DO-178C deterministic constraints.",
      "Built a TCP/UDP simulation backend for multi-ship Monte Carlo analysis in manned-unmanned teaming (MUM-T), and represent Boeing in working groups with the U.S. Navy on autonomy requirements.",
    ],
    tags: ["C++", "C#", "Python", "PyTorch", "CUDA", "Agentic AI", "DO-178C"],
  },
  {
    title: "Flight Engineer Intern",
    org: "The Boeing Company",
    logo: "/img/boeing.png",
    place: "St. Louis, MO",
    dates: "May 2025 — Aug 2025",
    points: [
      "Ran trade studies on advanced probe systems, balancing weight and manufacturability for next-generation aerial refueling platforms.",
      "Built AI-augmented stress-analysis tools that plug into Boeing's standard methods to speed up design iterations.",
    ],
    tags: ["Trade Studies", "Aerial Refueling", "Python"],
  },
  {
    title: "Structural Stress Intern",
    org: "The Boeing Company",
    logo: "/img/boeing.png",
    place: "Long Beach, CA",
    dates: "May 2024 — May 2025",
    points: [
      "Built an automated Python optimizer that ingests FEA load cases from HyperMesh, structures them in Pandas, and streams results over UDP to resize parts to the optimal margin of safety at minimum weight.",
      "Retained to keep developing the tool for the 777-8F, and recognized as a Top 100 Intern in the Nation.",
    ],
    tags: ["Python", "HyperMesh", "FEA", "Pandas", "UDP"],
  },
  {
    title: "Automation & Systems Engineer",
    org: "Sun-Maid Growers of California",
    place: "Kingsburg, CA",
    dates: "Dec 2023 — Dec 2024",
    points: [
      "Led a team that deployed a computer vision quality-control system with GPIO-driven air rejection, removing defective goods at full conveyor speed.",
      "Projected $400K in labor savings over six years, started scaling to every packaging line, and earned Top Capstone Project.",
    ],
    tags: ["Computer Vision", "OpenCV", "Embedded", "Team Lead"],
  },
];

export const research = [
  {
    title: "Safe Trajectory Planning",
    org: "USC Safety Intelligence & Autonomy Lab",
    place: "Los Angeles, CA",
    dates: "Apr 2024 — Aug 2024",
    body: "Implemented real-time safe trajectory planning on an autonomous RC car using Hamilton-Jacobi reachability on an NVIDIA Jetson, with a full LiDAR-to-actuation pipeline in ROS 2. I got the position by cold-contacting the lab with a self-built SLAM car.",
    tags: ["ROS 2", "Hamilton-Jacobi", "LiDAR", "Jetson"],
  },
  {
    title: "MasterMind AI",
    org: "Wharton AI Hackathon — Top 10 Finalist",
    place: "Philadelphia, PA",
    dates: "Mar 2025",
    body: "Led a team that shipped a full-stack RAG study assistant in 24 hours. It turns lecture PDFs, videos, and notes into adaptive quizzes that target weak concepts, with a caching layer that cut token cost and latency by about 40%.",
    tags: ["RAG", "VectorDBs", "GPT-4", "Team Lead"],
  },
];

export const education = [
  {
    school: "University of Pennsylvania",
    logo: "/img/penn.png",
    degree: "M.S. Computer & Information Technology",
    detail: "Computer Science · GPA 3.8 / 4.0",
    dates: "Jan 2025 — Dec 2025",
    place: "Philadelphia, PA",
  },
  {
    school: "University of California, Merced",
    logo: "/img/ucmerced.png",
    degree: "B.S. Mechanical Engineering",
    detail: "Magna Cum Laude · GPA 3.8 / 4.0",
    dates: "Aug 2021 — Dec 2024",
    place: "Merced, CA",
  },
];

export const skills: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["Python", "C++ 14/17/20", "C#", "Rust", "TypeScript", "Java", "SQL", "Bash"] },
  { group: "AI / ML", items: ["PyTorch", "TensorFlow", "HuggingFace", "LLM Inference", "RAG", "Agentic AI", "BERT"] },
  { group: "Infrastructure", items: ["CUDA", "ROS 2", "TCP/UDP", "Docker", "Kubernetes", "VectorDBs", "Observability"] },
  { group: "Frameworks & Cloud", items: ["AWS", "React", "FastAPI", "Flask", "Node.js", "PySpark", "CI/CD"] },
];

export const leadership = [
  { name: "FIRST Robotics Volunteer", note: "Mentor youth teams as a Boeing representative" },
  { name: "SHPE Boeing Chapter", note: "Mentorship and outreach for Hispanic/Latino engineers" },
  { name: "Boeing STL Leadership Association", note: "Leadership development across Boeing St. Louis" },
  { name: "Lead Teaching Assistant, UC Merced", note: "Two years lecturing math, physics, and engineering" },
  { name: "AIAA, UC Merced", note: "Helped peers earn L1 high-power rocketry certifications" },
];

export const honors = [
  "Top 100 Intern in the Nation",
  "Top Capstone Project",
  "Pride@Boeing Community Leadership Recognition",
  "Jack Kent Cooke Foundation Scholar",
  "Frances M. Benton Scholarship",
];

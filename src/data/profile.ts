// Everything the site says about Kenneth lives here, so copy edits never
// touch layout code. Sourced from the current resumes.

export const profile = {
  name: "Kenneth Gampol",
  role: "AI/ML Software Engineer",
  org: "The Boeing Company",
  location: "St. Louis, MO",
  summary:
    "AI/ML software engineer at Boeing in St. Louis, working on agentic AI, flight software, and autonomy. M.S. in Computer & Information Technology from Penn, B.S. in Mechanical Engineering from UC Merced.",
  badges: ["US Citizen", "Active Secret Clearance", "Willing to Relocate"],
  email: "kgampol@alumni.upenn.edu",
  links: {
    linkedin: "https://www.linkedin.com/in/kennethgampol",
    github: "https://github.com/kgampol",
    resume: "/docs/Kenneth_Gampol_Resume.pdf",
  },
  photo: "/img/kenneth.jpg",
} as const;

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
      "Built an agentic AI pipeline that automates C code generation for flight test; pitched it to executive leadership and secured funding.",
      "Built a pre-mission validation pipeline that cut mission-plan review from months to hours.",
      "Develop real-time C++ systems for edge inference and autonomous aerial refueling under DO-178C constraints.",
    ],
    tags: ["C++", "Python", "PyTorch", "CUDA"],
  },
  {
    title: "Flight Engineer Intern",
    org: "The Boeing Company",
    logo: "/img/boeing.png",
    place: "St. Louis, MO",
    dates: "May 2025 — Aug 2025",
    points: ["Ran trade studies on advanced probe systems for next-generation aerial refueling platforms."],
    tags: ["Trade Studies", "Python"],
  },
  {
    title: "Structural Stress Intern",
    org: "The Boeing Company",
    logo: "/img/boeing.png",
    place: "Long Beach, CA",
    dates: "May 2024 — May 2025",
    points: [
      "Built a Python FEA optimizer that resizes parts to minimum weight; retained for the 777-8F and named a Top 100 Intern in the Nation.",
    ],
    tags: ["Python", "HyperMesh", "FEA"],
  },
  {
    title: "Automation & Systems Engineer",
    org: "Sun-Maid Growers of California",
    place: "Kingsburg, CA",
    dates: "Dec 2023 — Dec 2024",
    points: [
      "Led deployment of a computer vision quality-control system at full line speed, projecting $400K in labor savings.",
    ],
    tags: ["Computer Vision", "Embedded"],
  },
];

export const research = [
  {
    title: "Safe Trajectory Planning",
    org: "USC Safety Intelligence & Autonomy Lab",
    place: "Los Angeles, CA",
    dates: "Apr 2024 — Aug 2024",
    body: "Real-time safe trajectory planning on an autonomous RC car using Hamilton-Jacobi reachability, with a LiDAR-to-actuation pipeline in ROS 2 on an NVIDIA Jetson.",
    tags: ["ROS 2", "Hamilton-Jacobi", "LiDAR", "Jetson"],
  },
  {
    title: "MasterMind AI",
    org: "Wharton AI Hackathon — Top 10 Finalist",
    place: "Philadelphia, PA",
    dates: "Mar 2025",
    body: "Led a team that built a RAG study assistant in 24 hours, turning lecture material into adaptive quizzes.",
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

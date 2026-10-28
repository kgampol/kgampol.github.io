// Everything the site says about Kenneth lives here, so copy edits never
// touch layout code. Sourced from the current resumes.

export const profile = {
  name: "Kenneth Gampol",
  role: "AI/ML Software Engineer",
  org: "The Boeing Company",
  location: "St. Louis, MO",
  summary:
    "AI/ML software engineer at Boeing in St. Louis, working on agentic AI, flight software, and autonomy. M.S. in Computer & Information Technology from UPenn, B.S. in Mechanical Engineering from UC Merced.",
  badges: ["US Citizen", "Active Secret Clearance", "Willing to Relocate"],
  email: "kgampol@alumni.upenn.edu",
  links: {
    linkedin: "https://www.linkedin.com/in/kennethgampol",
    github: "https://github.com/kgampol",
    resume: "/docs/Kenneth_Gampol_Resume.pdf",
  },
} as const;

export type Project = {
  title: string;
  context: string;
  dates: string;
  summary: string;
  points: string[];
  tags: string[];
  links?: { label: string; href: string }[];
  /** a looping demo clip with a poster frame, plus an optional still */
  media?: { video: string; poster: string; still?: string; alt: string };
  /** for projects without footage, a headline result stands in for media */
  stat?: { value: string; label: string };
};

export const projects: Project[] = [
  {
    title: "Autonomous RC Car",
    context: "Personal project",
    dates: "2024",
    summary:
      "An end-to-end self-driving car on a Raspberry Pi with LiDAR: it localizes itself, reads stop signs, and plans its own path around the track.",
    points: [
      "ROS 2 for communication and navigation, LiDAR SLAM for localization, a CNN for stop-sign detection, and on-device path planning.",
      "Designed and 3D-printed custom mounts in SolidWorks; trained on simulation data from the Donkey Car platform.",
      "Led directly to a research position at USC's Safety Intelligence & Autonomy Lab.",
    ],
    tags: ["Python", "ROS 2", "LiDAR", "SLAM", "TensorFlow", "SolidWorks"],
    media: {
      video: "/media/rc-car-demo.mp4",
      poster: "/media/rc-car-demo-poster.jpg",
      still: "/media/rc-car.jpg",
      alt: "The autonomous RC car driving itself around a taped track",
    },
  },
  {
    title: "MasterMind AI",
    context: "Wharton AI Hackathon · Top 10 Finalist",
    dates: "Mar 2025",
    summary:
      "A study assistant that turns lecture PDFs, videos, and notes into summaries and adaptive quizzes, built by a team I led in 24 hours.",
    points: [
      "Retrieval-augmented generation with embedding-based similarity search, so answers stay grounded in the course material.",
      "An adaptive quiz engine that classifies concepts and targets the ones you're weakest on.",
      "A prompt orchestration and caching layer that cut token cost and latency by about 40%.",
    ],
    tags: ["Python", "RAG", "Vector DBs", "GPT-4"],
    stat: { value: "24 hrs", label: "From idea to a working, pitched product" },
  },
  {
    title: "Vision-Based Quality Control",
    context: "Sun-Maid × UC Merced Capstone · Top Capstone Project",
    dates: "2024",
    summary:
      "A computer vision system that spots defective packaged goods on a live production line and rejects them with air jets, at full conveyor speed.",
    points: [
      "Led the team from prototype to deployment on a running packaging line.",
      "Camera-based detection driving GPIO-controlled air rejection, without slowing line throughput.",
      "Projected $400K in labor savings over six years; scaling to every packaging line began.",
    ],
    tags: ["Computer Vision", "Embedded", "GPIO", "Team Lead"],
    links: [{ label: "Innovate to Grow", href: "https://i2g.ucmerced.edu/" }],
    stat: { value: "$400K", label: "Projected labor savings over six years" },
  },
];

export type Role = {
  title: string;
  org: string;
  logo?: string;
  /** initials for the tile when there is no logo file */
  mark?: string;
  /** a short line under the company name, e.g. where a lab has moved */
  orgNote?: string;
  place: string;
  dates: string;
};

export const experience: Role[] = [
  {
    title: "AI/ML Software Engineer",
    org: "The Boeing Company",
    logo: "/img/boeing.png",
    place: "St. Louis, MO",
    dates: "Aug 2025 — Present",
  },
  {
    title: "Flight Engineer Intern",
    org: "The Boeing Company",
    logo: "/img/boeing.png",
    place: "St. Louis, MO",
    dates: "May 2025 — Aug 2025",
  },
  {
    title: "Structural Stress Intern",
    org: "The Boeing Company",
    logo: "/img/boeing.png",
    place: "Long Beach, CA",
    dates: "May 2024 — May 2025",
  },
  {
    title: "Automation & Systems Engineer",
    org: "Sun-Maid Growers of California",
    logo: "/img/sunmaid.png",
    place: "Kingsburg, CA",
    dates: "Dec 2023 — Dec 2024",
  },
  {
    title: "Research Assistant, Safe Trajectory Planning",
    org: "Safety Intelligence & Autonomy Lab",
    orgNote: "USC at the time · now at Stanford",
    logo: "/img/usc.png",
    place: "Los Angeles, CA",
    dates: "Apr 2024 — Aug 2024",
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
  { name: "Boeing STL Leadership Association", note: "Leadership development across Boeing St. Louis" },
  { name: "Lead Teaching Assistant, UC Merced", note: "Two years lecturing math, physics, and engineering" },
  { name: "AIAA, UC Merced", note: "Helped peers earn L1 high-power rocketry certifications" },
];

export const honors: { name: string; href?: string }[] = [
  { name: "Top 100 Intern in the Nation", href: "https://www.nationalinternday.com/2024-top-100-interns" },
  { name: "Top Capstone Project", href: "https://i2g.ucmerced.edu/" },
  { name: "Pride@Boeing Community Leadership Recognition" },
  { name: "Jack Kent Cooke Foundation Scholar" },
  { name: "Frances M. Benton Scholarship" },
];

export const personalInfo = {
  name: "Aakash Reddy Nuthalapati",
  initials: "AN",
  title: "Full Stack Developer",
  subtitle: "Machine Learning Engineer",
  tagline: "Crafting intelligent solutions at the intersection of code and creativity",
  email: "aakashreddy3702@gmail.com",
  linkedin: "https://linkedin.com/in/aakash-reddy-nuthalapati",
  github: "https://github.com/aakash-73",
  location: "Edmond, OK"
};

export const about = {
  summary: `Innovative Full Stack Developer and Machine Learning Engineer with a strong foundation in building scalable, intelligent applications. Graduated with a Master's in Computer Science at the University of Central Oklahoma (GPA: 3.72), I specialize in developing modern web applications, machine learning pipelines, and cloud-native solutions.`,

  highlights: [
    "Expert in full-stack development with React.js, Python, and modern cloud technologies",
    "Proven track record of improving application performance by up to 30%",
    "Specialized in ML/AI integration, RAG systems, and computer vision applications",
    "Strong advocate for clean architecture, scalable design patterns, and Agile methodologies",
    "Passionate about creating intuitive user experiences backed by robust backend systems"
  ]
};

export const technicalSkills = [
  {
    category: "Languages",
    skills: ["Python", "JavaScript", "Kotlin", "Java", "SQL", "C++"]
  },
  {
    category: "Frontend",
    skills: ["React.js", "Tailwind CSS", "Jetpack Compose"]
  },
  {
    category: "Backend & Cloud",
    skills: ["Flask", "AWS", "Docker", "REST APIs"]
  },
  {
    category: "AI/ML",
    skills: ["PyTorch", "HuggingFace", "RAG Systems", "Generative AI"]
  },
  {
    category: "Databases",
    skills: ["MongoDB", "MySQL", "Firebase"]
  }
];

export const softSkills = [
  { name: "Problem Solving", icon: "⚡", description: "Analytical approach to complex technical challenges" },
  { name: "Team Collaboration", icon: "🤝", description: "Effective cross-functional Agile team member" },
  { name: "System Design", icon: "🔧", description: "Architecting scalable, maintainable solutions" },
  { name: "Communication", icon: "💬", description: "Clear documentation and stakeholder engagement" },
  { name: "Innovation", icon: "🚀", description: "Staying current with emerging technologies" }
];

export const experience = [
  {
    id: 1,
    company: "Saayam For All",
    role: "Full Stack Developer",
    period: "Aug 2025 – Present",
    location: "USA",
    achievements: [
      "Improved carousel runtime performance by 25% through rendering optimizations and state updates, and revamped the Request Filter UI to reduce time-to-filter by ~30%",
      "Built key product surfaces including Profile screen and Header UI, plus file upload and audio recording/playback workflows end-to-end",
      "Implemented consistent country sync across web/mobile by integrating AWS Cognito user attributes and standardizing the data flow across clients",
      "Shipped multilingual support (i18n) for authentication and onboarding flows, including UI copy consistency and edge-case handling",
      "Worked in a cross-functional Agile team of 5, collaborating closely with design and QA to deliver iterative releases"
    ],
    technologies: ["React.js", "AWS Cognito", "REST APIs", "i18n", "Agile"]
  },
  {
    id: 2,
    company: "Techionary",
    role: "Machine Learning Engineer Intern",
    period: "May 2020 – Jul 2020",
    location: "India",
    achievements: [
      "Developed supervised and unsupervised ML models to support business workflows, from data preparation to evaluation",
      "Optimized preprocessing and training pipelines (feature cleaning, transformations, and batching), improving end-to-end run efficiency by ~20%",
      "Improved feature engineering practices and documentation to support reproducibility and smoother handoff for deployment"
    ],
    technologies: ["Python", "Machine Learning", "Data Processing", "Feature Engineering"]
  }
];


export const projects = [
  {
    id: 1,
    title: "WorldSketch: Vision-Language Diffusion Playground",
    description:
      "Built a modular diffusion playground for SDXL-style image generation, focused on fast iteration across pipelines, configs, and inference backends (JAX/PyTorch).",
    technologies: ["Python", "PyTorch", "JAX", "Gradio", "SDXL", "Diffusion Models"],
    highlights: [
      "Designed a plug-in style architecture to swap models, schedulers, and guidance settings without rewriting core logic",
      "Implemented an inference pipeline with reproducible configs (seeds, prompts, steps) to compare quality and latency across runs",
      "Created an interactive Gradio UI with benchmarking hooks to track generation time and output consistency"
    ],
    category: "AI/ML"
  },
  {
    id: 2,
    title: "Serverless Participation Verification System",
    description:
      "End-to-end serverless workflow that verifies participation by extracting names (Textract) and matching faces (Rekognition), storing results in DynamoDB for auditability.",
    technologies: ["AWS Lambda", "AWS Rekognition", "AWS Textract", "CDK", "DynamoDB", "React", "Amplify"],
    highlights: [
      "Provisioned infrastructure with AWS CDK (Lambda, S3, DynamoDB, API Gateway/Amplify) for repeatable deployments",
      "Built a verification pipeline combining OCR + face similarity matching, with structured results persisted for review and reporting",
      "Hardened the system with least-privilege IAM roles, input validation, and optimized cold-start paths for faster responses"
    ],
    category: "Cloud/Full Stack"
  },
  {
    id: 3,
    title: "Attendance Management System",
    description:
      "Offline-first Android app to manage subjects, student rosters, and attendance history with local-first persistence and optional MongoDB sync.",
    technologies: ["Kotlin", "Jetpack Compose", "Room", "MongoDB", "Dagger Hilt", "MVVM"],
    highlights: [
      "Offline-first architecture using local storage as the source of truth to keep the app reliable without connectivity",
      "Structured MVVM + Repository layers with Hilt dependency injection for maintainable and testable feature growth",
    ],
    category: "Mobile"
  },
  {
    id: 4,
    title: "Syllabus Chatbot (RAG)",
    description:
      "RAG-based chatbot that answers syllabus questions using semantic retrieval over course documents and grounded responses.",
    technologies: ["Python", "RAG", "React.js", "MongoDB", "Semantic Search"],
    highlights: [
      "Built a retrieval pipeline with chunking + embeddings to fetch relevant syllabus sections before generation",
      "Improved answer grounding by returning citations/snippets from the source context used for the response",
      "Developed a responsive React UI with conversation history and feedback-friendly interaction"
    ],
    category: "AI/ML"
  },
  {
    id: 5,
    title: "Schedule Management System",
    description:
      "Task scheduling web app with prioritization, status tracking, and automated reminder notifications to support consistent follow-through.",
    technologies: ["HTML", "CSS", "JavaScript", "Firebase"],
    highlights: [
      "Implemented prioritized task workflows with real-time status updates and filtering for faster planning",
      "Integrated automated reminders/notifications (Firebase-based) to reduce missed deadlines",
      "Designed a clean UI for quick task entry, editing, and completion tracking"
    ],
    category: "Web Application"
  }
];


export const education = [
  {
    degree: "Master of Science in Computer Science",
    institution: "University of Central Oklahoma",
    location: "Edmond, OK",
    period: "Aug 2023 – May 2025",
    gpa: "3.72",
    highlights: [
      "Focus on Machine Learning and Software Engineering",
      "Advanced coursework in AI, Cloud Computing, and System Design"
    ]
  }
];

export const achievements = [
  {
    metric: "25%",
    label: "Performance Boost",
    description: "Carousel optimization"
  },
  {
    metric: "70%",
    label: "Workload Cut",
    description: "Automated verification"
  },
  {
    metric: "50%",
    label: "Access Improved",
    description: "RAG chatbot"
  },
  {
    metric: "5+",
    label: "Major Projects",
    description: "AI to Cloud Native"
  }
];

export const personalInfo = {
  name: "Aakash Reddy Nuthalapati",
  initials: "AN",
  title: "Full Stack Developer",
  subtitle: "Machine Learning Engineer",
  tagline: "Crafting intelligent solutions at the intersection of code and creativity",
  email: "aakashreddy3702@gmail.com",
  linkedin: "https://linkedin.com/in/aakash-reddy-nuthalapati",
  github: "https://github.com/aakash-73",
  location: "Irving, TX"
};

export const about = {
  summary: `I'm a Full Stack Developer and ML Engineer focused on building reliable, user-friendly products end-to-end. I hold an M.S. in Computer Science from the University of Central Oklahoma (GPA: 3.72) and currently work as a Full Stack Developer at Digitronix AI Inc. My work spans modern web development, serverless cloud systems on AWS, and applied AI — especially retrieval-augmented generation (RAG) and computer vision — where I care as much about clean architecture and performance as I do about shipping features.`,

  highlights: [
    "Full-stack development with React.js and Python, building production-ready UIs and scalable APIs",
    "Cloud-native experience with AWS serverless workflows: Lambda, API Gateway, DynamoDB, Cognito, Rekognition, and Textract",
    "Applied AI: RAG-based assistants, semantic search, and computer vision pipelines",
    "Engineering-first mindset: clean architecture, maintainable code, and measurable performance improvements",
    "Team leadership experience — led a cross-functional squad of 5 engineers across design, QA, and delivery in an Agile environment"
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
    skills: ["Flask", "FastAPI", "AWS", "Docker", "REST APIs"]
  },
  {
    category: "AI/ML",
    skills: ["PyTorch", "HuggingFace", "RAG Systems", "Generative AI"]
  },
  {
    category: "Databases",
    skills: ["MongoDB", "MySQL", "Firebase", "DynamoDB"]
  },
  {
    category: "Tools & Platforms",
    skills: ["AWS CDK", "Amplify", "GitHub", "Agile/Scrum"]
  }
];

export const softSkills = [
  { name: "Problem Solving", icon: "⚡", description: "Analytical approach to complex technical challenges" },
  { name: "Team Leadership", icon: "🤝", description: "Led cross-functional Agile squads from design to delivery" },
  { name: "System Design", icon: "🔧", description: "Architecting scalable, maintainable solutions" },
  { name: "Communication", icon: "💬", description: "Clear documentation and stakeholder engagement" },
  { name: "Innovation", icon: "🚀", description: "Staying current with emerging technologies" }
];

export const experience = [
  {
    id: 1,
    company: "Digitronix AI Inc.",
    role: "Full Stack Developer",
    period: "May 2026 – Present",
    location: "Remote, USA",
    achievements: [
      "Building full-stack features across the product, contributing to both frontend React interfaces and backend API services",
      "Collaborating with the team to design and ship reliable, user-facing functionality in a fast-paced remote environment",
      "Applying AWS cloud services and modern frontend patterns to deliver scalable, production-quality solutions"
    ],
    technologies: ["React.js", "AWS", "REST APIs", "Full Stack", "Remote"]
  },
  {
    id: 2,
    company: "Saayam For All",
    role: "Team Lead & Full Stack Developer",
    period: "Aug 2024 – Apr 2026",
    location: "Remote, USA",
    achievements: [
      "Led a cross-functional squad of 5 engineers, coordinating feature delivery across frontend, backend, and QA in Agile sprints",
      "Improved carousel runtime performance by 25% through rendering optimizations and revamped the Request Filter UI to reduce time-to-filter by ~30%",
      "Built key product surfaces including Profile screen, Header UI, and file upload and audio recording/playback workflows end-to-end",
      "Implemented consistent country sync across web and mobile by integrating AWS Cognito user attributes and standardizing the data flow across clients",
      "Shipped multilingual support (i18n) for authentication and onboarding flows, including UI copy consistency and edge-case handling"
    ],
    technologies: ["React.js", "AWS Cognito", "REST APIs", "i18n", "Agile", "Team Lead"]
  },
  {
    id: 3,
    company: "Techionary",
    role: "Machine Learning Engineer Intern",
    period: "May 2020 – Jul 2020",
    location: "India",
    achievements: [
      "Developed supervised and unsupervised ML models to support business workflows, from data preparation through evaluation",
      "Optimized preprocessing and training pipelines — feature cleaning, transformations, and batching — improving end-to-end run efficiency by ~20%",
      "Improved feature engineering practices and documentation to support reproducibility and smoother handoff for deployment"
    ],
    technologies: ["Python", "Machine Learning", "Data Processing", "Feature Engineering"]
  }
];


export const projects = [
  {
    id: 1,
    title: "RepoScope AI",
    description:
      "A full-stack code intelligence platform that lets developers explore, visualize, and chat with any GitHub repository using a self-hosted LLM backend and semantic code search.",
    technologies: ["React", "React Flow", "FastAPI", "MongoDB", "Ollama", "Qwen2.5-Coder", "Python", "Pygments"],
    highlights: [
      "Migrated the AI layer from Groq to a self-hosted Ollama instance (qwen2.5-coder:7b-instruct) for private, cost-free inference with no rate limits",
      "Built a GitHub sync engine using SHA/MD5-based change detection to incrementally update only modified files, keeping the index fresh without full re-ingestion",
      "Designed an interactive React Flow dependency graph for visualizing file and module relationships across a repository",
      "Added Pygments as a language detection fallback, ensuring accurate syntax highlighting and file classification across polyglot codebases",
      "Implemented folder collapse state preservation and chat/sidebar mutual exclusion for a polished, distraction-free exploration experience"
    ],
    category: "Live",
    liveUrl: "https://reposcope-ai.arndevs.com/",
  },
  {
    id: 2,
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
    id: 3,
    title: "Serverless Participation Verification System",
    description:
      "End-to-end serverless workflow that verifies participation by extracting names (Textract) and matching faces (Rekognition), storing results in DynamoDB for auditability.",
    technologies: ["AWS Lambda", "AWS Rekognition", "AWS Textract", "CDK", "DynamoDB", "React", "Amplify"],
    highlights: [
      "Provisioned infrastructure with AWS CDK (Lambda, S3, DynamoDB, API Gateway/Amplify) for repeatable deployments",
      "Built a verification pipeline combining OCR and face similarity matching, with structured results persisted for review and reporting",
      "Hardened the system with least-privilege IAM roles, input validation, and optimized cold-start paths for faster responses"
    ],
    category: "Cloud/Full Stack"
  },
  {
    id: 4,
    title: "Attendance Management System",
    description:
      "Offline-first Android app to manage subjects, student rosters, and attendance history with local-first persistence and optional MongoDB sync.",
    technologies: ["Kotlin", "Jetpack Compose", "Room", "MongoDB", "Dagger Hilt", "MVVM"],
    highlights: [
      "Offline-first architecture using local storage as the source of truth to keep the app reliable without connectivity",
      "Structured MVVM and Repository layers with Hilt dependency injection for maintainable and testable feature growth"
    ],
    category: "Mobile"
  },
  {
    id: 5,
    title: "Syllabus Chatbot (RAG)",
    description:
      "RAG-based chatbot that answers syllabus questions using semantic retrieval over course documents and grounded responses.",
    technologies: ["Python", "RAG", "React.js", "MongoDB", "Semantic Search"],
    highlights: [
      "Built a retrieval pipeline with chunking and embeddings to fetch relevant syllabus sections before generation",
      "Improved answer grounding by returning citations and snippets from the source context used for the response",
      "Developed a responsive React UI with conversation history and feedback-friendly interaction"
    ],
    category: "AI/ML"
  },
  {
    id: 7,
    title: "Smart Expense Tracker",
    description:
      "High-throughput distributed data pipeline system built with Java and Spring Boot, replicating a production-grade event-driven architecture across 6 microservices with real-time Kafka ingestion, distributed caching, and full CI/CD automation.",
    technologies: ["Java", "Spring Boot", "Apache Kafka", "Apache Ignite", "Kubernetes", "Docker", "MySQL", "MongoDB", "React", "GitHub Actions", "JUnit 5", "Mockito"],
    highlights: [
      "Built a real-time event-driven data pipeline with Apache Kafka routing data across 6 microservices, cutting inter-service processing latency by 40%",
      "Containerized all services with Docker and orchestrated on Kubernetes with zero-downtime rolling deployments and automated health monitoring",
      "Implemented distributed caching with Apache Ignite, reducing database query time by 50%",
      "Automated build, test, and release via GitHub Actions CI/CD pipeline with 80%+ code coverage enforced through JUnit 5 and Mockito"
    ],
    category: "In Progress",
    inProgress: true,
    year: "2024"
  },
  {
    id: 6,
    title: "Schedule Management System",
    description:
      "Task scheduling web app with prioritization, status tracking, and automated reminder notifications to support consistent follow-through.",
    technologies: ["HTML", "CSS", "JavaScript", "Firebase"],
    highlights: [
      "Implemented prioritized task workflows with real-time status updates and filtering for faster planning",
      "Integrated automated reminders and notifications (Firebase-based) to reduce missed deadlines",
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
    gpa: "3.72 / 4.00",
    highlights: [
      "Graduate coursework in Algorithms, Software Engineering, Cloud Computing, Database Systems, Mobile Application Development, and Theory of Computing",
      "Completed advanced courses including Software Engineering I & II, Cloud Web Applications Development, Applications Database Systems, and Mobile Apps Programming",
      "Awarded President's Honor Roll (Spring 2024)",
      "Completed coursework in Cyber Infrastructure & Cloud Computing and Enterprise Web Programming"
    ]
  },
  {
    degree: "Bachelor of Science in Electrical Engineering",
    institution: "JNTU Hyderabad",
    location: "Hyderabad, India",
    period: "Aug 2017 – May 2021",
    gpa: "8.23 / 10.00",
    highlights: [
      "Core coursework in Electronics, Signal Processing, and Control Systems",
      "Foundation in mathematics, programming, and engineering design principles"
    ]
  }
];
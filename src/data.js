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
    skills: [
      { name: "Python", level: 90 },
      { name: "JavaScript", level: 85 },
      { name: "Kotlin", level: 80 },
      { name: "Java", level: 80 },
      { name: "SQL", level: 85 },
      { name: "C++", level: 75 }
    ]
  },
  {
    category: "Frontend",
    skills: [
      { name: "React.js", level: 90 },
      { name: "Tailwind CSS", level: 85 },
      { name: "Jetpack Compose", level: 80 }
    ]
  },
  {
    category: "Backend & Cloud",
    skills: [
      { name: "Flask", level: 80 },
      { name: "AWS", level: 85 },
      { name: "Docker", level: 75 },
      { name: "REST APIs", level: 90 }
    ]
  },
  {
    category: "AI/ML",
    skills: [
      { name: "PyTorch", level: 85 },
      { name: "HuggingFace", level: 80 },
      { name: "RAG Systems", level: 85 },
      { name: "Generative AI", level: 80 }
    ]
  },
  {
    category: "Databases",
    skills: [
      { name: "MongoDB", level: 85 },
      { name: "MySQL", level: 80 },
      { name: "Firebase", level: 80 }
    ]
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
      "Improved Carousel performance by 25% and redesigned Request Filter UI, boosting filtering efficiency by 30%",
      "Developed Profile Screen, Header UI, file upload, and audio recording/playback features",
      "Synced user country data across platforms using AWS Cognito",
      "Delivered multilingual support for core authentication and onboarding screens",
      "Collaborated in a cross-functional Agile team of 5"
    ],
    technologies: ["React.js", "AWS Cognito", "REST APIs", "Agile"]
  },
  {
    id: 2,
    company: "Techionary",
    role: "Machine Learning Engineer Intern",
    period: "May 2020 – Jul 2020",
    location: "India",
    achievements: [
      "Built supervised and unsupervised ML models for business workflows",
      "Optimized preprocessing and model pipelines, improving efficiency by 20%",
      "Enhanced feature engineering and documentation for reproducible deployment"
    ],
    technologies: ["Python", "Machine Learning", "Data Processing"]
  }
];

export const projects = [
  {
    id: 1,
    title: "WorldSketch: Vision-Language Diffusion Playground",
    description: "Designed a modular image-generation platform using SDXL diffusion models optimized with JAX and PyTorch for fast, high-quality inference.",
    technologies: ["Python", "PyTorch", "JAX", "Gradio", "SDXL", "Diffusion Models"],
    highlights: [
      "Modular architecture for model experimentation",
      "Optimized inference pipeline for high-quality generation",
      "Interactive benchmarking interface"
    ],
    category: "AI/ML"
  },
  {
    id: 2,
    title: "Serverless Participation Verification System",
    description: "Developed a fully serverless AWS workflow for automated participation verification using Lambda, Rekognition, and Textract. Improved reliability and reduced manual verification workload by 70%.",
    technologies: ["AWS Lambda", "AWS Rekognition", "AWS Textract", "CDK", "DynamoDB", "React", "Amplify"],
    highlights: [
      "Fully serverless architecture with AWS CDK",
      "70% reduction in manual verification workload",
      "Optimized cold-start behavior and secure IAM roles"
    ],
    category: "Cloud/Full Stack"
  },
  {
    id: 3,
    title: "Attendance Management System",
    description: "Built an Android attendance app with Jetpack Compose and MongoDB using an offline-first architecture for seamless synchronization.",
    technologies: ["Kotlin", "Jetpack Compose", "MongoDB", "Dagger Hilt", "MVVM"],
    highlights: [
      "Offline-first architecture for reliable syncing",
      "MVVM pattern with Dagger Hilt",
      "40% improvement in tracking efficiency"
    ],
    category: "Mobile"
  },
  {
    id: 4,
    title: "Syllabus Chatbot (RAG)",
    description: "Developed a Retrieval-Augmented Generation chatbot for answering syllabus-related queries with contextual accuracy.",
    technologies: ["Python", "RAG", "React.js", "MongoDB", "Semantic Search"],
    highlights: [
      "RAG pipeline with semantic search",
      "50% improvement in information accessibility",
      "Interactive React frontend"
    ],
    category: "AI/ML"
  },
  {
    id: 5,
    title: "Schedule Management System",
    description: "Created a task scheduling application with automated email reminders, priority-based organization, and real-time status tracking.",
    technologies: ["HTML", "CSS", "JavaScript", "Firebase"],
    highlights: [
      "Automated email reminder system",
      "Priority-based task organization",
      "35% improvement in completion rates"
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

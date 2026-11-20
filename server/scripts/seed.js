const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../src/config/env');
const Service = require('../src/models/Service');
const Project = require('../src/models/Project');
const Testimonial = require('../src/models/Testimonial');
const SiteContent = require('../src/models/SiteContent');
const Admin = require('../src/models/Admin');

const sampleServices = [
  {
    title: 'Cloud Architecture & Infrastructure',
    slug: 'cloud-architecture-infrastructure',
    shortDescription: 'Enterprise-grade multi-cloud design, container orchestration with Kubernetes, and automated infrastructure as code.',
    description: `We design, migrate, and scale resilient cloud infrastructures across AWS, Google Cloud, and Microsoft Azure. Our engineers implement automated Infrastructure-as-Code (IaC) utilizing Terraform and Pulumi, ensuring maximum reliability, zero downtime deployments, and predictable cost governance.

Whether migrating monolithic legacy architectures to microservices or optimizing modern cloud spends, NexaTech provides end-to-end cloud sovereignty with 99.99% uptime guarantees.`,
    icon: 'Cloud',
    features: [
      'Multi-cloud & hybrid cloud strategy',
      'Kubernetes orchestration & service meshes (Istio)',
      'Infrastructure as Code (Terraform, CloudFormation)',
      'Automated disaster recovery and failover setups',
      'Cost optimization & cloud FinOps auditing',
    ],
    benefits: [
      'Zero downtime rolling deployments',
      'Up to 45% reduction in cloud infrastructure expenses',
      'Autonomous autoscaling under extreme peak loads',
      'SLA-backed 99.99% reliability',
    ],
    faqs: [
      {
        question: 'Which cloud platforms do you support?',
        answer: 'We have certified architects in Amazon Web Services (AWS), Google Cloud Platform (GCP), and Microsoft Azure, along with private cloud OpenStack environments.',
      },
      {
        question: 'How do you handle zero-downtime migration?',
        answer: 'We utilize blue-green deployments, canary releases, and dual-write replication methodologies to guarantee zero downtime during legacy system transitions.',
      },
    ],
    order: 1,
    isActive: true,
  },
  {
    title: 'AI Systems & Machine Learning',
    slug: 'ai-systems-machine-learning',
    shortDescription: 'Custom Large Language Model workflows, Retrieval-Augmented Generation (RAG), and predictive enterprise intelligence.',
    description: `Unlock generative AI and cognitive automation tailored specifically to your proprietary corporate data. From custom RAG pipelines to fine-tuned vision and natural language models, our AI systems seamlessly integrate with your existing core products.

We ensure strict data privacy, on-premise or sovereign cloud hosting, and continuous model observability to eliminate hallucinations and maximize decision accuracy.`,
    icon: 'Cpu',
    features: [
      'Custom LLM fine-tuning and domain adaptation',
      'Vector database and semantic search architecture (Pinecone, Qdrant, Milvus)',
      'Enterprise Retrieval-Augmented Generation (RAG) engines',
      'Predictive analytics and anomaly detection models',
      'Ethical AI guardrails and telemetry monitoring',
    ],
    benefits: [
      '10x acceleration in knowledge discovery and document processing',
      'Proprietary data never exposed to third-party public models',
      'Continuous drift detection and latency monitoring',
      'Measurable ROI on AI workflow automation',
    ],
    faqs: [
      {
        question: 'Can you deploy models within our private VPC?',
        answer: 'Yes, we specialize in deploying open-weight models (such as Llama 3, Mistral, and DeepSeek) entirely within your private VPC or on-premise GPU clusters.',
      },
      {
        question: 'How do you ensure data accuracy in RAG systems?',
        answer: 'We employ multi-stage reranking, hybrid keyword-semantic search, source attribution citations, and confidence scoring algorithms.',
      },
    ],
    order: 2,
    isActive: true,
  },
  {
    title: 'Custom Full-Stack Web Engineering',
    slug: 'custom-full-stack-web-engineering',
    shortDescription: 'High-performance web applications, resilient REST/GraphQL APIs, and mission-critical distributed systems.',
    description: `We build reactive, lightning-fast web applications designed to support millions of concurrent users. Combining modern frontend frameworks (React, Next.js, Vue) with resilient backend runtimes (Node.js, Go, Python), our systems prioritize accessibility, lightning speed, and developer ergonomic excellence.

From real-time trading dashboards to global SaaS platforms, every application is crafted with test-driven precision.`,
    icon: 'Code',
    features: [
      'Micro-frontend and headless architectures',
      'High-throughput REST and GraphQL APIs',
      'Real-time WebSocket and WebRTC capabilities',
      'WCAG 2.1 AA accessibility compliance',
      'Comprehensive unit, integration, and E2E test suites',
    ],
    benefits: [
      'Sub-second initial page load times worldwide',
      'Fluid 60fps user experience across mobile and desktop',
      'Maintainable, modular codebases with strict typing',
      'Rapid release cycles powered by CI/CD automation',
    ],
    faqs: [
      {
        question: 'What is your typical development methodology?',
        answer: 'We follow agile 2-week sprints with transparent Jira/Linear tracking, continuous PR previews, and daily automated build verifications.',
      },
    ],
    order: 3,
    isActive: true,
  },
  {
    title: 'Cybersecurity & DevSecOps',
    slug: 'cybersecurity-devsecops',
    shortDescription: 'Zero-trust network architectures, penetration testing, automated vulnerability scanning, and compliance audits.',
    description: `Security is not an afterthought; it is built into every layer of our software lifecycle. We provide holistic threat modeling, continuous dependency vulnerability monitoring, automated SAST/DAST scanning, and SOC2/HIPAA compliance preparation.

Protect your enterprise assets from ransomware, data leakage, and sophisticated nation-state attack vectors.`,
    icon: 'ShieldCheck',
    features: [
      'Zero-Trust Network Access (ZTNA) and IAM role hardening',
      'Static & Dynamic Application Security Testing (SAST/DAST)',
      'Automated container and software supply chain scanning',
      'SOC2 Type II, ISO 27001, and HIPAA compliance readiness',
      'Continuous penetration testing and threat modeling',
    ],
    benefits: [
      'Proactive mitigation before vulnerabilities reach production',
      'Simplified compliance audits and regulatory approvals',
      'Hardened cloud perimeters and encrypted data at rest/transit',
      'Reduced corporate cyber risk profile',
    ],
    faqs: [
      {
        question: 'Do you assist with SOC 2 or ISO certification audits?',
        answer: 'Yes, we implement the technical controls, audit logging, and automated evidence collection tools needed for swift auditor sign-offs.',
      },
    ],
    order: 4,
    isActive: true,
  },
  {
    title: 'DevOps & Continuous Delivery',
    slug: 'devops-continuous-delivery',
    shortDescription: 'Modern GitOps workflows, automated testing pipelines, and real-time observability stacks.',
    description: `Eliminate deployment bottlenecks and empower engineering teams to release with confidence multiple times per day. We engineer battle-tested CI/CD pipelines, integrate automated synthetic testing, and configure unified observability with Prometheus, Grafana, and Datadog.`,
    icon: 'Terminal',
    features: [
      'GitOps-driven delivery with ArgoCD and Flux',
      'GitHub Actions, GitLab CI, and Jenkins automation',
      'Unified observability (Metrics, Logs, Traces) with OpenTelemetry',
      'Automated canary analysis and instant rollback mechanisms',
    ],
    benefits: [
      'Release lead time reduced from days to minutes',
      '99% reduction in production deployment incidents',
      'Single-pane-of-glass operational visibility',
    ],
    faqs: [
      {
        question: 'Can you migrate our legacy Jenkins pipelines to GitHub Actions?',
        answer: 'Absolutely. We refactor complex Jenkinsfiles into modular, cache-accelerated GitHub Actions workflows with minimal downtime.',
      },
    ],
    order: 5,
    isActive: true,
  },
  {
    title: 'Enterprise Mobile Solutions',
    slug: 'enterprise-mobile-solutions',
    shortDescription: 'Cross-platform and native iOS/Android applications built for scale, performance, and offline reliability.',
    description: `Connect with your workforce and customers wherever they are. We engineer high-performance mobile applications leveraging React Native and Kotlin/Swift, complete with background sync, biometric security, and native device hardware integrations.`,
    icon: 'Smartphone',
    features: [
      'Cross-platform development with React Native and Flutter',
      'Hardware integration (BLE, NFC, Camera, Geolocation)',
      'Offline-first synchronization with SQLite and WatermelonDB',
      'Automated App Store and Google Play deployment pipelines (Fastlane)',
    ],
    benefits: [
      'Single codebase reducing development costs by 40%',
      'Native-feel 60fps animations and micro-interactions',
      'Secure local data encryption and biometric auth',
    ],
    faqs: [
      {
        question: 'Do you manage app store submission and compliance?',
        answer: 'Yes, we handle complete app store review guidelines, privacy manifests, and release staging.',
      },
    ],
    order: 6,
    isActive: true,
  },
];

const sampleProjects = [
  {
    title: 'ApexCloud Global Multi-Region Migration',
    slug: 'apexcloud-global-multi-region-migration',
    category: 'Cloud Architecture',
    client: 'Illustrative Fintech Concept',
    summary: 'Architected and executed a zero-downtime multi-region Kubernetes migration across 3 geographic zones.',
    challenge: 'A growing fintech firm faced regional outages and 4-second API latency during peak trading hours on an outdated monolithic setup.',
    solution: 'Designed an active-active multi-region Kubernetes cluster managed with Terraform and ArgoCD, backed by globally distributed CockroachDB and Cloudflare Anycast routing.',
    results: [
      '99.999% uptime achieved across 12 consecutive months',
      'P99 latency slashed from 4,200ms to 78ms globally',
      '38% reduction in total compute costs via auto-scaling spot instances',
    ],
    techStack: ['AWS', 'Kubernetes', 'Terraform', 'ArgoCD', 'CockroachDB', 'Go'],
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
    demoUrl: 'https://example.com/demo/apexcloud',
    githubUrl: 'https://github.com/example/apexcloud-infra',
    featured: true,
    isPublished: true,
    order: 1,
  },
  {
    title: 'Synapse AI Autonomous Document Intelligence',
    slug: 'synapse-ai-autonomous-document-intelligence',
    category: 'AI & Machine Learning',
    client: 'Illustrative LegalTech Concept',
    summary: 'Engineered an enterprise RAG system processing 100,000+ complex contracts per day with verifiable citations.',
    challenge: 'Legal teams spent over 18 hours per case reviewing multi-hundred page compliance documents with high human error risk.',
    solution: 'Implemented a private, hybrid vector search engine using Qdrant and fine-tuned open weights, with hallucination detection and citation verification.',
    results: [
      '85% reduction in contract audit processing duration',
      'Zero proprietary client data leaked outside private VPC',
      '99.2% extraction precision verified by independent audit',
    ],
    techStack: ['Python', 'FastAPI', 'PyTorch', 'Qdrant', 'Llama 3', 'Docker'],
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    demoUrl: 'https://example.com/demo/synapse-ai',
    githubUrl: 'https://github.com/example/synapse-rag',
    featured: true,
    isPublished: true,
    order: 2,
  },
  {
    title: 'QuantumPay High-Concurrency Payment Core',
    slug: 'quantumpay-high-concurrency-payment-core',
    category: 'Custom Software',
    client: 'Illustrative E-Commerce Concept',
    summary: 'Ultra-low latency microservices processing 12,000 transactions per second with PCI-DSS Tier 1 compliance.',
    challenge: 'Flash sale traffic spikes repeatedly crashed legacy transaction databases, resulting in abandoned shopping carts and lost revenue.',
    solution: 'Engineered event-driven microservices with Apache Kafka, Redis caching clusters, and an idempotent ledger engine.',
    results: [
      'Successfully sustained 15,000 peak TPS without dropping a single packet',
      'Mean checkout settlement latency reduced to under 120ms',
      '100% test coverage on all ledger arithmetic routines',
    ],
    techStack: ['Node.js', 'React', 'Redis', 'Kafka', 'PostgreSQL', 'Docker'],
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop',
    demoUrl: 'https://example.com/demo/quantumpay',
    githubUrl: 'https://github.com/example/quantumpay-core',
    featured: true,
    isPublished: true,
    order: 3,
  },
  {
    title: 'CyberShield Zero-Trust Perimeter',
    slug: 'cybershield-zero-trust-perimeter',
    category: 'Cybersecurity',
    client: 'Illustrative HealthTech Concept',
    summary: 'Comprehensive HIPAA-compliant zero-trust security architecture across hybrid hospital networks.',
    challenge: 'Fragmented hospital networks with insecure IoT diagnostic devices vulnerable to lateral ransomware movement.',
    solution: 'Designed micro-segmented networks with automated mTLS certificate rotation, strict IAM role binding, and continuous anomaly telemetry.',
    results: [
      'Eliminated 100% of unauthorized lateral access vectors in red team drills',
      'Achieved full HIPAA and SOC 2 Type II certification within 90 days',
      'Real-time automated threat containment under 45 seconds',
    ],
    techStack: ['Vault', 'WireGuard', 'eBPF', 'Prometheus', 'Kubernetes'],
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop',
    demoUrl: 'https://example.com/demo/cybershield',
    githubUrl: 'https://github.com/example/cybershield-security',
    featured: false,
    isPublished: true,
    order: 4,
  },
  {
    title: 'NovaCommerce Omnichannel Platform',
    slug: 'novacommerce-omnichannel-platform',
    category: 'Custom Software',
    client: 'Illustrative Retail Enterprise Concept',
    summary: 'Next-gen headless commerce engine with real-time stock allocation across 300 physical store locations.',
    challenge: 'Disjointed inventory counts between offline retail points-of-sale and online mobile storefronts causing backorders.',
    solution: 'Built a headless GraphQL commerce platform with optimistic UI updates and distributed webhooks syncing POS in real time.',
    results: [
      '62% increase in mobile checkout conversion rate',
      'Inventory sync latency reduced from 30 minutes to 350 milliseconds',
      'Integrated unified Apple Pay and Google Pay one-click checkout',
    ],
    techStack: ['React', 'Next.js', 'TailwindCSS', 'GraphQL', 'Stripe API'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
    demoUrl: 'https://example.com/demo/novacommerce',
    githubUrl: 'https://github.com/example/novacommerce',
    featured: false,
    isPublished: true,
    order: 5,
  },
  {
    title: 'TelemetryFlow IoT Fleet Command Center',
    slug: 'telemetryflow-iot-fleet-command-center',
    category: 'Cloud Architecture',
    client: 'Illustrative Logistics Concept',
    summary: 'Real-time telemetry ingestion pipeline and geospatial dashboard monitoring 50,000 connected transport vehicles.',
    challenge: 'Streaming gigabytes of vehicle sensor data overwhelmed server capacity, causing stale GPS locations.',
    solution: 'Leveraged MQTT message brokers, time-series TimescaleDB, and WebGL map rendering for high-density live tracking.',
    results: [
      'Processes 40 million telemetric events daily with 99.98% ingestion reliability',
      'Predictive engine maintenance alerts reduced vehicle roadside breakdowns by 34%',
    ],
    techStack: ['Go', 'MQTT', 'TimescaleDB', 'React', 'Mapbox GL', 'Docker'],
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop',
    demoUrl: 'https://example.com/demo/telemetryflow',
    githubUrl: 'https://github.com/example/telemetryflow',
    featured: false,
    isPublished: true,
    order: 6,
  },
];

const sampleTestimonials = [
  {
    clientName: 'Elena Rostova',
    role: 'Chief Technology Officer',
    company: 'Vanguard Dynamics',
    content: 'NexaTech refactored our distributed infrastructure with surgical precision. Their deep grasp of Kubernetes orchestration and cloud cost modeling saved us over $200k in the first two quarters alone.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    isPublished: true,
    order: 1,
  },
  {
    clientName: 'Marcus Vance',
    role: 'VP of Engineering',
    company: 'Krypton Pay',
    content: 'The level of rigor NexaTech brings to software architecture is extraordinary. The payment pipeline they architected handled our Black Friday surges without a microsecond of downtime.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    isPublished: true,
    order: 2,
  },
  {
    clientName: 'Sophia Chen',
    role: 'Head of Product',
    company: 'Aetheria Health',
    content: 'Working with NexaTech felt like having an elite SWAT engineering team integrated into our department. Their AI and security practices gave us the confidence to pass stringent HIPAA audits on our first attempt.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
    isPublished: true,
    order: 3,
  },
];

const starterContent = {
  heroBadge: 'Next-Generation Enterprise IT & Software Engineering',
  heroTitle: 'Architecting Scalable Digital Systems for Modern Enterprises',
  heroSubtitle: 'NexaTech empowers global tech leaders with resilient cloud infrastructure, intelligent AI workflows, and high-performance custom software engineering.',
  heroCtaText: 'Explore Capabilities',
  stats: [
    { label: 'Uptime Reliability', value: '99.99', suffix: '%' },
    { label: 'Cloud Architecture Deployed', value: '180', suffix: '+' },
    { label: 'Enterprise Security Audits', value: '250', suffix: '+' },
    { label: 'Average Performance Gain', value: '3.4', suffix: 'x' },
  ],
  aboutHeading: 'Engineering the Backbone of Tomorrow’s Digital Infrastructure',
  aboutDescription: 'Founded by senior systems engineers and cloud architects, NexaTech transforms complex technical challenges into competitive advantages through robust architectures, zero-downtime deployments, and bulletproof security.',
  contactEmail: 'contact@nexatech.internal',
  socialLinks: {
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com',
    discord: 'https://discord.com',
  },
};

const runSeed = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await mongoose.connect(config.MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
    console.log('[Seed] Connected successfully.');

    // 1. Seed Site Content (idempotent upsert)
    let content = await SiteContent.findOne();
    if (!content) {
      await SiteContent.create(starterContent);
      console.log('✅ Site content created.');
    } else {
      console.log('ℹ️ Site content already exists, skipped.');
    }

    // 2. Seed Services (idempotent for sample slugs)
    let serviceCount = 0;
    for (const item of sampleServices) {
      await Service.findOneAndUpdate(
        { slug: item.slug },
        { $set: item },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      serviceCount++;
    }
    console.log(`✅ Seeded/Updated ${serviceCount} services.`);

    // 3. Seed Projects (idempotent for sample slugs)
    let projectCount = 0;
    for (const item of sampleProjects) {
      await Project.findOneAndUpdate(
        { slug: item.slug },
        { $set: item },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      projectCount++;
    }
    console.log(`✅ Seeded/Updated ${projectCount} portfolio projects.`);

    // 4. Seed Testimonials (idempotent by client name)
    let testimonialCount = 0;
    for (const item of sampleTestimonials) {
      await Testimonial.findOneAndUpdate(
        { clientName: item.clientName },
        { $set: item },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      testimonialCount++;
    }
    console.log(`✅ Seeded/Updated ${testimonialCount} starter testimonials.`);

    // 5. Seed Default Admin if none exists
    const existingAdmin = await Admin.findOne({ email: 'admin@nexatech.internal' });
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash('Admin@NexaTech2026!', salt);
      await Admin.create({
        name: 'Principal Administrator',
        email: 'admin@nexatech.internal',
        passwordHash,
        role: 'superadmin',
      });
      console.log('✅ Default administrator created: admin@nexatech.internal (Password: Admin@NexaTech2026!)');
    } else {
      console.log('ℹ️ Default administrator already exists.');
    }

    console.log('\n🎉 Seed process completed successfully! All starter data is in place.');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

runSeed();

const mongoose = require("mongoose");
const User = require("../models/User");
const EmployerProfile = require("../models/EmployerProfile");
const Job = require("../models/Job");

const seedInitialJobs = async () => {
  try {
    const jobCount = await Job.countDocuments();
    if (jobCount > 0) {
      return; // Already populated
    }

    console.log("🌱 Seeding initial dynamic jobs & verified employers...");

    // 1. Ensure Employer User
    let employerUser = await User.findOne({ role: "employer" });
    if (!employerUser) {
      employerUser = await User.create({
        fullName: "Geeta University Placement Partner",
        email: "recruitment.partner@geetauniversity.edu.in",
        password: "password123",
        role: "employer",
        userType: "employer",
        isEmailVerified: true,
      });
    }

    // 2. Create standard partner company profiles
    const companies = [
      {
        companyName: "TechNova Labs",
        industry: "Software & Cloud Services",
        headquarters: { city: "Bangalore", state: "Karnataka", country: "India" },
        website: "https://technovalabs.io",
        isPublished: true,
      },
      {
        companyName: "CloudScale Systems",
        industry: "Cloud Infrastructure & DevOps",
        headquarters: { city: "Gurugram", state: "Haryana", country: "India" },
        website: "https://cloudscalesystems.com",
        isPublished: true,
      },
      {
        companyName: "RazorFlow Technologies",
        industry: "Fintech & API Infrastructure",
        headquarters: { city: "Bangalore", state: "Karnataka", country: "India" },
        website: "https://razorflow.tech",
        isPublished: true,
      },
      {
        companyName: "NexGen Solutions",
        industry: "Enterprise AI & Full Stack",
        headquarters: { city: "Hyderabad", state: "Telangana", country: "India" },
        website: "https://nexgensolutions.ai",
        isPublished: true,
      },
      {
        companyName: "InnovateX Tech",
        industry: "EdTech & Web Platforms",
        headquarters: { city: "Pune", state: "Maharashtra", country: "India" },
        website: "https://innovatex.tech",
        isPublished: true,
      },
    ];

    const companyProfiles = [];
    for (const comp of companies) {
      let prof = await EmployerProfile.findOne({ companyName: comp.companyName });
      if (!prof) {
        prof = await EmployerProfile.create({
          userId: employerUser._id,
          ...comp,
        });
      }
      companyProfiles.push(prof);
    }

    // 3. Create real opportunities
    const realJobs = [
      {
        employerId: companyProfiles[0]._id,
        createdBy: employerUser._id,
        title: "Frontend Developer Intern",
        department: "Engineering",
        employmentType: "Internship",
        workMode: "Remote",
        location: "Remote / Bangalore",
        salaryRange: { min: 25000, max: 25000, currency: "INR", isNegotiable: false },
        experience: { minYears: 0, maxYears: 1, level: "Fresher / Entry-Level" },
        education: "B.Tech / BCA / MCA",
        description: "Join TechNova Labs as a Frontend Developer Intern to build scalable user interfaces with React and modern web toolchains.",
        responsibilities: [
          "Develop dynamic React components with responsive Tailwind CSS",
          "Integrate REST APIs and optimize client-side rendering performance",
          "Collaborate with product designers and backend engineers",
        ],
        requiredSkills: ["React", "JavaScript", "Tailwind CSS"],
        preferredSkills: ["Redux", "TypeScript"],
        bonusSkills: ["Next.js", "Git"],
        openings: 3,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: "Published",
      },
      {
        employerId: companyProfiles[1]._id,
        createdBy: employerUser._id,
        title: "Full Stack Engineer Intern",
        department: "Engineering",
        employmentType: "Internship",
        workMode: "Hybrid",
        location: "Gurugram / Delhi NCR",
        salaryRange: { min: 30000, max: 30000, currency: "INR", isNegotiable: false },
        experience: { minYears: 0, maxYears: 1, level: "Fresher / Entry-Level" },
        education: "B.Tech / MCA",
        description: "Work on cloud microservices and responsive dashboards at CloudScale Systems.",
        responsibilities: [
          "Design MongoDB schemas and build Node.js / Express microservices",
          "Develop modern frontend interfaces in React",
          "Implement JWT authentication and API rate limiting",
        ],
        requiredSkills: ["Node.js", "React", "MongoDB"],
        preferredSkills: ["Express", "TypeScript"],
        bonusSkills: ["Docker", "AWS"],
        openings: 2,
        deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        status: "Published",
      },
      {
        employerId: companyProfiles[2]._id,
        createdBy: employerUser._id,
        title: "Backend Development Intern",
        department: "Engineering",
        employmentType: "Internship",
        workMode: "On-site",
        location: "Bangalore",
        salaryRange: { min: 28000, max: 28000, currency: "INR", isNegotiable: false },
        experience: { minYears: 0, maxYears: 1, level: "Fresher / Entry-Level" },
        education: "B.Tech Computer Science / IT",
        description: "Scale core payment workflows and transactional databases at RazorFlow Technologies.",
        responsibilities: [
          "Build high-throughput REST APIs in Node.js and SQL",
          "Optimize database queries and indexes",
          "Write comprehensive automated unit tests",
        ],
        requiredSkills: ["Node.js", "Express", "SQL"],
        preferredSkills: ["PostgreSQL", "Redis"],
        bonusSkills: ["Docker"],
        openings: 4,
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        status: "Published",
      },
      {
        employerId: companyProfiles[3]._id,
        createdBy: employerUser._id,
        title: "Junior Software Engineer (Campus Hire)",
        department: "Engineering",
        employmentType: "Full-time",
        workMode: "Hybrid",
        location: "Hyderabad",
        salaryRange: { min: 650000, max: 900000, currency: "INR", isNegotiable: true },
        experience: { minYears: 0, maxYears: 2, level: "Fresher / Entry-Level" },
        education: "B.Tech / BE / MCA",
        description: "Join NexGen Solutions for enterprise web development and system design.",
        responsibilities: [
          "Develop enterprise-scale web applications",
          "Implement complex data structures and algorithms",
          "Participate in code reviews and CI/CD automation",
        ],
        requiredSkills: ["JavaScript", "Data Structures", "Node.js"],
        preferredSkills: ["Java", "SQL"],
        bonusSkills: ["Kubernetes"],
        openings: 5,
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        status: "Published",
      },
      {
        employerId: companyProfiles[4]._id,
        createdBy: employerUser._id,
        title: "Associate React / Web Developer",
        department: "Engineering",
        employmentType: "Full-time",
        workMode: "Remote",
        location: "Pune / Remote",
        salaryRange: { min: 600000, max: 850000, currency: "INR", isNegotiable: true },
        experience: { minYears: 0, maxYears: 2, level: "Fresher / Entry-Level" },
        education: "Any Graduate / B.Tech",
        description: "Build user experiences for millions of students at InnovateX Tech.",
        responsibilities: [
          "Build responsive single page applications using React and Redux",
          "Ensure accessibility and cross-browser consistency",
          "Write clean, modular TypeScript code",
        ],
        requiredSkills: ["React", "Redux", "TypeScript"],
        preferredSkills: ["TailwindCSS", "Next.js"],
        bonusSkills: ["Figma"],
        openings: 2,
        deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
        status: "Published",
      },
    ];

    await Job.insertMany(realJobs);
    console.log(`✅ Seeded ${realJobs.length} dynamic jobs into database.`);
  } catch (error) {
    console.error("Seeding jobs error:", error);
  }
};

module.exports = seedInitialJobs;

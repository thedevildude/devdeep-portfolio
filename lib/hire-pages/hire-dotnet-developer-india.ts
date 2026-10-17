// TODO(owner): add real .NET, C# and ASP.NET Core projects and experience here; the proof below leans on transferable work.
import type { Service } from "../services";

const page: Service = {
  slug: "hire-dotnet-developer-india",
  seoTitle: "Hire a .NET Developer in India — Senior, Remote | Devdeep",
  h1: "Hire a .NET Developer in India",
  role: ".NET Developer",
  headline: "Hire a .NET developer in India, *at home in the Microsoft stack*",
  description:
    "Hire a senior .NET developer in India for C# and ASP.NET Core APIs, Azure services, Microsoft 365 integrations and moves off legacy .NET Framework.",
  keywords: [
    "hire .net developer india",
    "hire c# developer india",
    "asp.net core developer for hire",
    "remote dotnet developer india",
    "hire azure developer india",
  ],
  intro:
    "Teams on .NET usually live inside the wider Microsoft world: Azure, Entra ID, SQL Server, Teams and Outlook. I write C# and ASP.NET Core services that fit that world cleanly, and I keep an eye on the parts that tend to age badly, like configuration, dependency injection and data access.",
  heroCta: "Hire me for your .NET project",
  chips: ["C#", "ASP.NET Core", ".NET 8", "Azure", "Entity Framework", "SQL Server"],
  overview: {
    title: "How to hire a .NET developer in India",
    paragraphs: [
      "Plenty of .NET applications are still split between old .NET Framework code running on Windows servers and newer services on modern .NET. Hiring well means finding someone who can work productively in both, and who can move the old parts forward without breaking the people who rely on them every day.",
      "I have deployed to Azure, built Microsoft Graph integrations for email and calendar in a production multi-tenant product and designed whole project architectures at Capital Compute. When you hire me directly, the person who scopes your .NET work is the one who writes it.",
    ],
    gets: [
      "ASP.NET Core APIs with middleware, options and DI set up consistently",
      "Entity Framework Core queries you can read and reason about",
      "Azure resources chosen for the workload and documented",
      "Microsoft 365 and Entra ID integration handled with proper scopes",
      "A staged plan for anything still on .NET Framework",
    ],
  },
  roleTitle: "What I do as your *.NET developer*",
  roleIntro: "The C# and Azure work you can hand to me end to end.",
  duties: [
    {
      icon: "server",
      title: "ASP.NET Core APIs",
      body: "Build Web APIs and minimal APIs in C# with model validation, problem details and OpenAPI docs.",
    },
    {
      icon: "database",
      title: "EF Core data",
      body: "Design Entity Framework Core models and migrations against SQL Server or PostgreSQL with the generated SQL checked.",
    },
    {
      icon: "cloud",
      title: "Azure deployment",
      body: "Run services on Azure App Service, Functions and Storage, with configuration kept out of the code.",
    },
    {
      icon: "link",
      title: "Microsoft Graph",
      body: "Connect to Outlook mail, calendars and users through Microsoft Graph with least-privilege permissions.",
    },
    {
      icon: "shield",
      title: "Identity and access",
      body: "Wire up Entra ID sign-in, JWT bearer auth and policy-based authorisation for each role.",
    },
    {
      icon: "loop",
      title: "Background services",
      body: "Run hosted services and queue workers in .NET that recover cleanly after restarts or failures.",
    },
    {
      icon: "migrate",
      title: "Framework migration",
      body: "Port .NET Framework projects to modern .NET piece by piece, keeping the old system running meanwhile.",
    },
    {
      icon: "flask",
      title: "xUnit testing",
      body: "Cover domain logic and API endpoints with xUnit and integration tests that run in your pipeline.",
    },
  ],
  whyTitle: "Why hire a .NET developer in India, *and why me*",
  whyIntro:
    "A .NET hire should understand the Microsoft platform around the code as well as the code itself. That platform work is already part of what I have shipped.",
  why: [
    {
      icon: "link",
      title: "Microsoft Graph in production",
      body: "PEOS brings Outlook email and calendar data through Microsoft Graph into one Action Hub alongside Salesforce for private equity teams.",
    },
    {
      icon: "cloud",
      title: "Cloud that is planned",
      body: "I have deployed to Azure, AWS and Google Cloud, so I pick Azure services for a reason and can explain the trade-offs in writing.",
    },
    {
      icon: "users",
      title: "Senior ownership",
      body: "I have designed complete architectures, led a team of five and mentored freshers, so your .NET codebase gets a lead's judgement.",
    },
  ],
  steps: [
    {
      title: "Share the solution",
      body: "Your projects, .NET versions, hosting and the Microsoft services you depend on.",
    },
    {
      title: "Fit conversation",
      body: "A 30-minute call on the codebase and goals, followed by a written answer within 24 hours.",
    },
    {
      title: "Trial in your repo",
      body: "One real API change, bug fix or migration slice, reviewed through your normal pull request flow.",
    },
    {
      title: "Environment and access",
      body: "I set up the solution locally, get Azure access scoped correctly and agree what to tackle first.",
    },
    {
      title: "Weekly C# delivery",
      body: "Tested pull requests every week, with demos and written notes on any configuration change.",
    },
  ],
  stack: [
    { category: "Languages", items: ["C#", "SQL", "TypeScript"] },
    { category: "Frameworks", items: [".NET 8", "ASP.NET Core", "Entity Framework Core"] },
    { category: "Azure", items: ["App Service", "Azure Functions", "Azure Storage", "Azure SQL"] },
    { category: "Microsoft 365", items: ["Microsoft Graph", "Entra ID", "Outlook", "Teams"] },
    { category: "Databases", items: ["SQL Server", "PostgreSQL", "MongoDB"] },
    { category: "Testing", items: ["xUnit", "Playwright"] },
    { category: "Frontend pairing", items: ["Angular", "React"] },
    { category: "Delivery", items: ["Docker", "Git", "GitHub Actions"] },
  ],
  faqs: [
    {
      q: "Can you move our application from .NET Framework to modern .NET?",
      a: "Yes. I check which libraries and Windows-only APIs block the move, then migrate project by project so the application keeps shipping throughout.",
    },
    {
      q: "Do you work with Azure, or only AWS?",
      a: "Both, along with Google Cloud. For a .NET product I will usually recommend Azure services that fit the team, and explain why.",
    },
    {
      q: "Can you integrate with Outlook, Teams or SharePoint data?",
      a: "Yes, through Microsoft Graph. I have used Graph in production for email and calendar sync and handle permissions and token refresh carefully.",
    },
    {
      q: "Entity Framework or raw SQL?",
      a: "Entity Framework Core for most work, with hand-written SQL where a query needs it. I check the generated SQL on any path that matters for performance.",
    },
    {
      q: "Can you also build the frontend for our .NET API?",
      a: "Yes. I build Angular and React frontends, which is useful when one person needs to own a feature from API to screen.",
    },
    {
      q: "Can you join our existing .NET team and process?",
      a: "Yes. I follow your conventions, reviews and rituals, and as a former team lead I am comfortable reviewing others' code too.",
    },
    {
      q: "Who owns the code you write?",
      a: "You do. I sign an NDA before seeing anything sensitive, and all code and IP from the engagement are yours.",
    },
  ],
  ctaTitle: "Add a .NET developer who *knows the Microsoft platform*",
  ctaBody:
    "Describe your .NET solution and where it needs to go. I will reply within 24 hours with an honest answer on fit.",
};

export default page;

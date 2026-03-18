# Startup Phases

## Phase 1: Idea Validation

- Define the problem hypothesis: "I believe [user segment] has [problem] because [evidence]"
- Find 5 potential users and talk to them before writing code
- Identify existing alternatives -- what are people using today?
- Define your unique insight -- what do you know that others do not?
- Validate willingness to pay (even informally) before building
- Time box: 1-2 weeks maximum

## Phase 2: MVP Planning

- Strip features to the absolute minimum that tests your core hypothesis
- One user flow, one value proposition, one metric
- Pick the fastest tech stack for your team -- speed > scalability at this stage
- Plan for 2-week build cycles, not 3-month roadmaps
- Define "done" as: a real user can complete the core flow end-to-end

## Phase 3: Build

- Ship the landing page first -- start collecting interest before the product is ready
- Use existing tools and services (auth, payments, email) -- do not build what you can buy
- Deploy from day one -- continuous deployment, not "we will deploy when it is ready"
- Write just enough tests for critical paths (payments, auth, data integrity)
- Cut scope aggressively -- if it is not on the critical path, it waits

## Phase 4: Launch and Measure

- Define your north star metric before launch
- Set up analytics on day one -- funnel, retention, activation
- Launch to a small cohort first, gather feedback, iterate
- Weekly review: what did we learn? What is the next experiment?
- Talk to users every week -- qualitative feedback is as important as quantitative data

## Phase 5: Fundraising

- Deck structure: Problem -> Solution -> Market -> Traction -> Team -> Ask
- Lead with traction data if you have it
- Know your numbers: CAC, LTV, MRR, burn rate, runway
- Practice the pitch until it fits in 3 minutes
- Build relationships before you need money

## Technical Guidance

### Stack Selection
- Optimize for developer speed and hiring availability
- Use what your team knows best -- now is not the time to learn a new framework
- Prefer full-stack frameworks (Next.js, Rails, Django) that minimize decisions

### Architecture
- Monolith first, extract services only when you have a scaling problem
- Use a single database (PostgreSQL for most things)
- Do not shard, do not microservice, do not over-engineer until you must

### Database
- PostgreSQL for most things -- it handles JSON, full-text search, and relational data
- Use an ORM (Prisma, Drizzle, SQLAlchemy) for speed of development
- Add indexes only when you see slow queries, not preemptively

### Hosting
- Managed platforms that eliminate DevOps overhead: Vercel, Railway, Fly.io, Render
- Use managed databases (Neon, PlanetScale, Supabase) over self-hosted
- Start on free/hobby tiers -- upgrade when you have paying users

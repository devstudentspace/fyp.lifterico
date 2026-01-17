# Lifterico Delivery Platform

## Overview

Lifterico is a smart delivery tracking and management system designed for the Nigerian market, addressing challenges faced by SMEs, logistics businesses, dispatch riders, and customers. The platform provides transparent, secure, and efficient last-mile delivery solutions.

## Documentation Index

| Document | Description |
|----------|-------------|
| [PRD.md](./PRD.md) | Product Requirements Document - Complete product vision and features |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System architecture and technical design |
| [ROADMAP.md](./ROADMAP.md) | Implementation roadmap with phases and sprints |
| [MODULES.md](./MODULES.md) | Detailed module breakdown and dependencies |
| [DATABASE.md](./DATABASE.md) | Database schema and data models |
| [API.md](./API.md) | API specifications and endpoints |
| [USER-ROLES.md](./USER-ROLES.md) | User roles, permissions, and access control |
| [INTEGRATIONS.md](./INTEGRATIONS.md) | Third-party service integrations |
| [SECURITY.md](./SECURITY.md) | Security considerations and implementation |
| [TESTING.md](./TESTING.md) | Testing strategy and quality assurance |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Deployment and DevOps guidelines |

## Tech Stack

### Frontend (Web Dashboard)
- **Framework:** Next.js 15 (App Router)
- **UI Library:** React 19
- **Styling:** Tailwind CSS
- **Components:** Radix UI + shadcn/ui
- **State Management:** Zustand / React Query
- **Maps:** Leaflet + OpenStreetMap

### Backend
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Real-time:** Supabase Realtime
- **Storage:** Supabase Storage
- **Edge Functions:** Supabase Edge Functions

### External Services
- **Maps/GPS:** OpenStreetMap + Leaflet
- **SMS Gateway:** Africa's Talking
- **Payment:** Paystack
- **Push Notifications:** Firebase Cloud Messaging

## User Roles

| Role | Platform | Description |
|------|----------|-------------|
| Admin | Web | System administrator - manages all users and system settings |
| Logistics Business | Web | Companies that own and manage delivery fleets |
| SME | Web + Mobile | Business owners creating delivery orders |
| Rider | Web + Mobile | Dispatch riders executing deliveries |
| Customer | Mobile (Future) | Recipients tracking their deliveries |

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

## Project Structure

```
lifterico/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Dashboard layouts
│   │   ├── admin/         # Admin dashboard
│   │   ├── logistics/     # Logistics business dashboard
│   │   ├── sme/           # SME dashboard
│   │   └── rider/         # Rider dashboard
│   └── api/               # API routes
├── components/            # Reusable UI components
├── lib/                   # Utility functions and configurations
├── hooks/                 # Custom React hooks
├── stores/                # State management
├── types/                 # TypeScript type definitions
└── docs/                  # Project documentation
```

## License

Proprietary - All rights reserved

# Apprentice 360

Apprentice 360 is a UK apprenticeship compliance platform designed to streamline the management of apprenticeships, evidence tracking, off-the-job (OTJ) hours, and assessment processes.

## Features

- Multi-role support (Apprentice, Assessor, IQA, Employer, Admin)
- Evidence upload and management
- Off-The-Job (OTJ) tracking
- Assessment workflow with approval/rejection
- Internal Quality Assurance (IQA) sampling
- Gateway management
- EPA result tracking
- Funding alerts and monitoring
- Organizational management

## Tech Stack

- Frontend: React.js with Tailwind CSS
- Backend: Node.js on Zapt Functions
- Database: CockroachDB with Drizzle ORM
- Authentication: Supabase Auth
- Hosting: Vercel

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Deployment

The application is automatically deployed to Vercel when changes are pushed to the main branch.

- Production: [apprentice360.co.uk](https://apprentice360.co.uk)
- Staging: [staging.apprentice360.co.uk](https://staging.apprentice360.co.uk)

## Project Structure

- `/src` - Frontend React application
- `/api` - Vercel serverless functions
- `/drizzle` - Database schema and migrations
- `/public` - Static assets

## Database Migrations

Database migrations are managed through SQL files in the `/drizzle` directory. The schema is defined in `drizzle/schema.js` and used by both the frontend and backend.
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a frontend project for the Job Track Path application. The project is currently in its initial setup phase.

## Project Structure

The project is currently empty except for this documentation. As the project develops, this section will be updated with the main directory structure and architectural patterns.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Architecture Notes

- **Framework**: Next.js 15.5.5 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Structure**: `/src` directory with App Router pattern
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **AI Integration**: n8n workflows for chat functionality

## Project Structure

```
/src
├── app/              # Next.js App Router pages
├── components/       # React components
├── lib/             # Utilities and configurations
└── types/           # TypeScript type definitions
```

## Important Notes

- Uses Next.js App Router (not Pages Router)
- Turbopack enabled for faster builds
- Project follows the structure outlined in README.md for JobTrackPath SaaS application
#!/bin/sh
# Run migrations
npm run migrate

# Seed the database
npx ts-node prisma/seed.ts

# Start the development server
npm run dev

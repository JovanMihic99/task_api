#!/bin/sh

# Run migrations (make sure the database schema is up-to-date)
echo "Running migrations..."
npm run migrate

# Seed the database (only run after migrations are applied)
echo "Seeding the database..."
npx ts-node prisma/seed.ts

# Start the development server
echo "Starting the server..."
npm start

#!/usr/bin/env node
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error('Usage: addContactRaw.mjs <userId> <email> [name] [phone]');
    process.exit(1);
  }
  const [userId, email, name = 'Emergency Contact', phone = ''] = args;
  try {
    const contact = await prisma.emergencyContact.create({
      data: { userId, email, name, phone, relation: 'FRIEND' },
    });
    console.log('Created contact:', contact);
    await prisma.$disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error creating contact:', err);
    await prisma.$disconnect();
    process.exit(2);
  }
}

await main();

#!/usr/bin/env node
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

import { prisma } from "../src/prisma";

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error("Usage: addContact.ts <userId> <email> [name] [phone]");
    process.exit(1);
  }
  const [userId, email, name = "Emergency Contact", phone = ""] = args;

  try {
    const contact = await prisma.emergencyContact.create({
      data: {
        userId,
        name,
        phone,
        email,
        relation: "FRIEND",
      },
    });
    console.log("Created emergency contact:", contact);
    process.exit(0);
  } catch (err) {
    console.error("Failed to create emergency contact:", err);
    process.exit(2);
  }
}

main();

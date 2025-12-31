/**
 * Seed script - Contract Management Tool
 * 
 * Rôle: Initialiser la base de données avec des données de référence
 * 
 * Usage: npm run db:seed ou npx prisma db seed
 * 
 * Ce script:
 * 1. Crée un utilisateur admin par défaut
 * 2. Hash le mot de passe avec bcrypt (salt rounds 10)
 * 3. Permet de démarrer l'application avec un compte admin fonctionnel
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Hash du mot de passe admin (bcrypt, salt rounds 10)
  // Password: "admin123" (à changer en production !)
  const passwordHash = await bcrypt.hash('admin123', 10);

  // Créer ou mettre à jour l'utilisateur admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      // Si l'admin existe déjà, on met à jour le mot de passe (au cas où)
      passwordHash,
      role: 'ADMIN',
      isActive: true,
    },
    create: {
      email: 'admin@example.com',
      passwordHash,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isActive: true,
    },
  });

  console.log('✅ Admin user created/updated:', {
    id: admin.id,
    email: admin.email,
    role: admin.role,
  });

  console.log('✅ Seed completed successfully!');
  console.log('📝 Default admin credentials:');
  console.log('   Email: admin@example.com');
  console.log('   Password: admin123');
  console.log('   ⚠️  Change these credentials in production!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


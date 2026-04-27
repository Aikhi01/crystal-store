const { execSync } = require('child_process');
process.env.DATABASE_URL = 'postgresql://neondb_owner:npg_T1vmFBluE7QL@ep-rapid-shape-aml8yk67.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require';
try {
  execSync('npx prisma db push', { stdio: 'inherit', env: process.env });
} catch (e) {
  process.exit(1);
}

npx nodemon index.js - start the server
npx prisma migrate dev --name 'name_here' - sync database with schema
or
npx prisma migrate deploy - ensures your db schema matches your Prisma schema

* packages:
- multer - handling file uploads

# 1. Make sure your DB is in sync
npx prisma migrate dev

# 2. (Optional) Manually regenerate Prisma client in case it's missing
npx prisma generate

# 3. Restart your backend server (important)
npm run dev   # or however you start it
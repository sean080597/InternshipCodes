# Nextjs Fullstack App Template

## MongoDB

MongoDB is a NoSQL database that provides a flexible, scalable, and high-performance solution for storing and retrieving data. It's commonly used in web applications to manage various types of data.

- Website: [MongoDB](https://www.mongodb.com/)
- Configurations:
  - Database Access --> Database Users
  - Network Access --> 0.0.0.0/0  (includes your current IP address)
  - MONGODB_URI: Database Deployments --> Connect --> Drivers

## NextAuth.js

NextAuth.js is a popular authentication library for Next.js applications. It simplifies the process of implementing various authentication providers, such as OAuth, JWT, and more.

- Website: [NextAuth.js](https://next-auth.js.org/)
- Configurations:
  - NEXTAUTH_URL=http://localhost:3000
  - NEXTAUTH_URL_INTERNAL=http://localhost:3000
  - NEXTAUTH_SECRET (generated by `openssl rand -base64 32`)

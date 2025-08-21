This is a Next.js + Sanity project for SAVET Burkina (veterinary products distributor).

## Getting Started

Setup:

```bash
# 1) Install deps
npm i

# 2) Configure env (create .env.local)
SANITY_PROJECT_ID=yourProjectId
SANITY_DATASET=production
NEXT_PUBLIC_SANITY_PROJECT_ID=yourProjectId
NEXT_PUBLIC_SANITY_DATASET=production

# 3) Run app and studio
npm run dev
```

Open `http://localhost:3000` for the site and `http://localhost:3000/studio` for the admin.

Content types: `settings`, `product`, `branch`, `post`, `team`.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

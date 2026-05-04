# CampGrounds-India

A full-stack campground app built with Node.js, Express, MongoDB, EJS, and Tailwind CSS.

## Render Deployment

This repository is configured so Render can deploy it directly from the repository root.

Build command:

```bash
npm run build
```

Start command:

```bash
npm start
```

Required environment variables:

```bash
NODE_ENV=production
DB_URL=your-mongodb-connection-string
SECRET=your-session-secret
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_KEY=your-cloudinary-api-key
CLOUDINARY_SECRET=your-cloudinary-api-secret
MAPTILER_API_KEY=your-maptiler-api-key
```

You can also use the root `render.yaml` file for a Render Blueprint deploy.

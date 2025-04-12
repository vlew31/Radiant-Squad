# Radiant Squad - Urban Gardener

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

## Running the Application

To run both the frontend and backend servers simultaneously:

```bash
npm run dev:all
```

To run the frontend only:

```bash
npm run dev
```

To run the backend only:

```bash
npm run server
```

## API Endpoints

- `POST /api/upload` - Upload an image to S3 and store metadata in MongoDB
- `GET /api/images` - Get all images with pre-signed URLs
- `GET /api/images/:id` - Get a single image with a pre-signed URL
- `DELETE /api/images/:id` - Delete an image from S3 and MongoDB

## Tech Stack

- Frontend: React, TypeScript, Vite,
- Backend: Express.js, Node.js
- Storage: AWS S3, MongoDB
- Image Processing: Sharp

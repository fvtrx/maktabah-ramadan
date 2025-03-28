# Maktabah Ramadan

![Capture-2025-03-28-122728](https://github.com/user-attachments/assets/d921a83e-aea7-4ee9-b194-0fdb28bce851)


A comprehensive collection of authentic hadiths related to Ramadan, providing reliable references for Muslim communities.

## Overview

Maktabah Ramadan serves as a destination for authentic Ramadan-related hadiths. The application provides verified hadiths with proper references from Jabatan Kemajuan Islam Malaysia (JAKIM) to help users enhance their knowledge and spiritual growth during the holy month of Ramadan.

## Features

- Collection of authentic hadiths related to Ramadan
- Proper sourcing and verification from reliable Islamic references
- User-friendly interface for easy navigation
- Search functionality to find specific hadiths
- Mobile-responsive design

## Backend API

The Maktabah Ramadan backend API provides all the necessary endpoints to serve hadith content and related functionality.

### API Documentation

Complete API documentation is available at:
[https://maktabah-ramadan-backend-production.up.railway.app/docs#/](https://maktabah-ramadan-backend-production.up.railway.app/docs#/)

The API documentation provides detailed information about all available endpoints, request parameters, and response formats.

### Key Endpoints

- `/all-hadith` - Get all hadiths
- `/get-hadith-book` - Get all list of Hadith books
- `/search` - Search for hadiths by keyword

## Running the Front End Project Locally

Follow these steps to set up and run the Maktabah Ramadan front end application on your local machine.

### Prerequisites

- Node.js (v16 or later)
- npm (v7 or later) or yarn
- Git

### Installation Steps

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/maktabah-ramadan.git
cd maktabah-ramadan
```

2. **Install dependencies**

Using npm:
```bash
npm install
```

Or using yarn:
```bash
yarn install
```

3. **Configure environment variables**

Create a `.env.local` file in the root directory and add the following variables:

p/s: API Key will be provided as per request to the owner - **@fvtrx**

```
NEXT_PUBLIC_API_URL=https://maktabah-ramadan-backend-production.up.railway.app
SECRET_API_KEY=
```

4. **Start the development server**

Using npm:
```bash
npm run dev
```

Or using yarn:
```bash
yarn dev
```

5. **Access the application**

Open your browser and navigate to:
```
http://localhost:3000
```

## Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

To start the production server:

```bash
npm start
# or
yarn start
```

## Contributing

We welcome contributions to the Maktabah Ramadan project. Please feel free to submit issues, feature requests, or pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

© 2025 Maktabah Ramadan. All Rights Reserved. Built by **@fvtrx** and **@havoc45**

## Contact

If you have any questions or suggestions, please open an issue in this repository or contact the codebase owner.

---

*"Whoever fasts during Ramadan with faith and seeking his reward from Allah will have his past sins forgiven."* - Prophet Muhammad ﷺ (Bukhari)

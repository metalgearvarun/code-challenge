# 🛠️ Full-Stack Engineering Take-Home Challenge

## 📚 Overview

This challenge is intended to simulate a real-world engineering task that involves working with both frontend and backend systems. You are provided with a `data.json` file and a TypeScript + React frontend starter. Your objective is to build a complete solution that:

- Serves the data via backend endpoints
- Fetches and loads the data on the frontend (no need for styling -- use a front-end component library)
- Demonstrates production-readiness principles

Your implementation should be functional, thoughtful, and well-structured—but doesn't need to be exhaustive. Include stubs or comments for areas outside your focus (e.g., full authentication).

---

## ⚙️ Instructions

1. Fork the CodeSandbox and implement your solution.
2. Set up a backend (e.g., using Node.js/Express, Next.js API routes, or a lightweight framework of your choice).
3. Create an API layer to serve `data.json`:
   - Structure endpoints according to best practices (`/folders`, `/files`, etc.)
   - Add basic filtering or lookup support (e.g., get folders with file details)
4. On the frontend:
   - Consume the API and replace direct `fetch("/data.json")` loading
   - Render a very simple UI based on the folder structure (can be minimal; focus is on integration)
5. Add inline comments or stubs for:
   - Authentication/authorization
   - Logging
   - Error handling
   - Data validation
   - Testing approach
   - Secrets and environment management
   - Security or performance considerations
6. Create a new README with:
   - Assumptions or limitations
   - Implementation notes
   - What you'd do with more time


Client fetching functions should include a delay and a random error; here's an example:

```ts
function shouldRandomlyError() {
  // Generate a random number between 0 and 1
  const randomNumber = Math.random();
  return randomNumber < 0.2;
}

export async function getData() {
  // Simulate loading delay
  await new Promise((resolve) => setTimeout(resolve, 1_500));
  // Simulate errors sometime happening
  if (shouldRandomlyError()) {
    throw new Error("A random error happened");
  }
  // see `public/data.json`
  const response = await fetch("/data.json");
  const data = await response.json();
  return data;
}
```

---

## 📃 Provided Files

- `public/data.json`: Contains all folders and files metadata
- `src/types.ts`: TypeScript interfaces for structured access
- `App.tsx`: Initial implementation fetching local JSON

---

## 🎯 Your Objectives

You should focus on delivering a complete data flow from backend to frontend:

### Backend
- Load and serve `data.json`
- Implement clean, versionable API structure
- Prepare for (but do not implement) auth, rate-limiting, etc.
- Use Express, Fastify, Next.js, or similar

### Frontend
- Replace `fetch("/data.json")` with calls to your API
- Build UI components to display folders (minimally - use a front-end component library)
- Demonstrate type safety with API responses

---

## ✅ What We’re Looking For

### Architecture
- Clear folder structure for frontend + backend
- Logical API routing and service separation
- Strong typing (both sides)

### Production Readiness
- Environment config (`.env`)
- Stubbed middleware/hooks for logging, auth, etc.
- Error boundaries, loading states

### Documentation
- Code comments or placeholder stubs for non-core areas
- Implementation summary in a new README

---

## 🧪 Bonus Points

- Filtering or sorting endpoints
- Fully typed API client (e.g., using Axios + TS interfaces)

---

## 📌 Submission Notes

- Be prepared to walk through your decisions in a follow-up conversation

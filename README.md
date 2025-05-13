# Bytehost Caller

A Google Cloud Function that uses Firefox (via Playwright) to make requests to websites and parse JSON responses. Includes caching mechanism with TTL support.

## Features

- Uses Firefox browser for making requests
- Automatic JSON parsing from page content
- Response caching with 5-minute TTL
- Docker support for local development
- GitHub Actions for GCP Cloud Functions deployment

## Prerequisites

- Node.js 18+
- Docker and Docker Compose (for containerized development)
- Google Cloud Platform account (for deployment)

## Local Development

### Running Locally (without Docker)

1. Install dependencies:
```bash
npm install
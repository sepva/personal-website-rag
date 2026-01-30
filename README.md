# Personal Website RAG

A Cloudflare Workers-based RAG (Retrieval Augmented Generation) system that powers a chatbot portfolio website. This service manages content indexing, vector embeddings, and serves as the backend for answering questions about projects, academic work, and professional experience. When new content is pushed to the Github repo the workflow is automatically run.

## Overview

This project provides a serverless RAG implementation using Cloudflare's edge infrastructure:
- **Cloudflare Workers** for serverless compute
- **D1 Database** for structured content storage
- **Vectorize** for semantic search with vector embeddings
- **Workers AI** for generating embeddings using BGE-base-en-v1.5
- **Cloudflare Workflows** for orchestrating content indexing

## Features

- 🚀 Serverless architecture running on Cloudflare's edge network
- 📝 Markdown content with automatic image URL transformation to GitHub CDN
- 🔍 Vector-based semantic search for content retrieval
- 🔄 Automated content reindexing workflow
- 🔒 Secure deployment trigger with bearer token authentication
- 🎯 Organized content structure for projects, blogs, academic work, and professional experience

## Architecture

The system consists of two main components:

### 1. Fetch Handler (`/trigger-rag-rebuild`)
A POST endpoint that triggers the RAGWorkflow to rebuild the content database and vector index. Protected by bearer token authentication.

### 2. RAGWorkflow
A Cloudflare Workflow that:
1. Creates/updates D1 database tables for each content type
2. Processes markdown content and transforms local image paths to GitHub raw URLs
3. Generates vector embeddings using Cloudflare's AI models
4. Stores embeddings in Vectorize for semantic search

## Content Structure

Content is organized in the following categories:

```
src/data/content/
├── academic/       # Academic papers and research
├── blogs/          # Blog posts
├── projects/       # Personal projects
└── work/          # Professional experience
```

Each category contains:
- Markdown files with content
- `images/` folder for associated images

Content is defined in [src/data/allContent.ts](src/data/allContent.ts) with metadata including:
- `id`: Unique identifier
- `title`: Content title
- `description`: Brief description
- `tags`: Technology/topic tags
- `type`: Content category
- `date`: Publication/project date
- `fullContent`: Full markdown content

## Setup

### Prerequisites

- Node.js 18+
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- Cloudflare account with access to Workers, D1, Vectorize, and Workers AI

### Installation

```bash
npm install
```

### Configuration

1. Create D1 database:
```bash
wrangler d1 create personal-website-db
```

2. Create Vectorize index:
```bash
wrangler vectorize create personal-website-index --dimensions=768 --metric=cosine
```

3. Update [wrangler.jsonc](wrangler.jsonc) with your database and index IDs

4. Set up deployment secret:
```bash
wrangler secret put DEPLOYMENT_SECRET
```

## Development

Run the development server:
```bash
npm run dev
```

This starts a local server with hot reloading.

## Deployment

Deploy to Cloudflare Workers:
```bash
npm run deploy
```

This command:
1. Deploys the Worker to Cloudflare
2. Automatically triggers the RAGWorkflow to rebuild the content database (via [trigger-after-deploy.sh](trigger-after-deploy.sh))

## API Endpoints

### POST `/trigger-rag-rebuild`

Triggers the RAGWorkflow to rebuild the content database and vector index.

**Authentication**: Bearer token (requires `DEPLOYMENT_SECRET` environment variable)

**Request**:
```bash
curl -X POST https://your-worker.workers.dev/trigger-rag-rebuild \
  -H "Authorization: Bearer YOUR_DEPLOYMENT_SECRET"
```

**Response**:
```json
{
  "success": true,
  "message": "RAGWorkflow triggered successfully",
  "workflowId": "workflow-id"
}
```

## Image Handling

Images referenced in markdown files are automatically transformed from local paths to GitHub raw URLs during the indexing process:

```markdown
<!-- Original in markdown file -->
![Screenshot](./images/screenshot.png)

<!-- Transformed to -->
![Screenshot](https://raw.githubusercontent.com/sepva/personal-website-rag/main/src/data/content/projects/images/screenshot.png)
```

Configure GitHub repository details in [src/index.js](src/index.js):
```javascript
const GITHUB_CONFIG = {
  owner: 'sepva',
  repo: 'personal-website-rag',
  branch: 'main',
  basePath: 'src/data/content',
};
```

## Testing

Run tests with Vitest:
```bash
npm test
```

## Scripts

- `npm run dev` - Start development server
- `npm run deploy` - Deploy to Cloudflare and trigger content rebuild
- `npm test` - Run tests
- `./create_databases.sh` - Initialize D1 and Vectorize resources
- `./setup-deployment-trigger.sh` - Configure deployment trigger
- `./trigger-after-deploy.sh` - Trigger RAGWorkflow after deployment

## Technology Stack

- **Runtime**: Cloudflare Workers
- **Database**: Cloudflare D1 (SQLite)
- **Vector Store**: Cloudflare Vectorize
- **AI**: Cloudflare Workers AI (@cf/baai/bge-base-en-v1.5)
- **Markdown Processing**: remark, remark-parse
- **Framework**: Hono (for routing, if extended)
- **Testing**: Vitest with Cloudflare Workers pool

## Project Structure

```
.
├── src/
│   ├── index.js              # Main Worker with fetch handler and RAGWorkflow
│   └── data/
│       ├── allContent.ts     # Content definitions and metadata
│       └── content/          # Markdown files and images
├── wrangler.jsonc            # Cloudflare Workers configuration
├── package.json              # Dependencies and scripts
├── vitest.config.js          # Test configuration
└── *.sh                      # Deployment and setup scripts
```

## License

MIT

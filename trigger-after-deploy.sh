#!/bin/bash

# Post-deployment script to trigger RAGWorkflow with authentication
# Usage: 
#   Local: ./trigger-after-deploy.sh <worker-url>
#   CI/CD: DEPLOYMENT_SECRET=xxx ./trigger-after-deploy.sh <worker-url>

if [ -z "$1" ]; then
  echo "❌ Error: Please provide your Worker URL"
  echo "Usage: ./trigger-after-deploy.sh https://your-worker.your-subdomain.workers.dev"
  exit 1
fi

WORKER_URL="$1"

# Try to get secret from environment variable first (for CI/CD)
if [ -z "$DEPLOYMENT_SECRET" ]; then
  # Fall back to reading from .dev.vars (for local development)
  if [ -f .dev.vars ]; then
    DEPLOYMENT_SECRET=$(grep DEPLOYMENT_SECRET .dev.vars | cut -d '=' -f2)
  fi
fi

if [ -z "$DEPLOYMENT_SECRET" ]; then
  echo "❌ Error: DEPLOYMENT_SECRET not found"
  echo "   For local use: Make sure .dev.vars exists with DEPLOYMENT_SECRET"
  echo "   For CI/CD: Set DEPLOYMENT_SECRET environment variable"
  exit 1
fi

echo "🔄 Triggering RAGWorkflow rebuild..."
RESPONSE=$(curl -s -X POST "${WORKER_URL}/trigger-rag-rebuild" \
  -H "Authorization: Bearer ${DEPLOYMENT_SECRET}")

echo "📊 Response: $RESPONSE"

if echo "$RESPONSE" | grep -q '"success":true'; then
  echo "✅ RAGWorkflow triggered successfully!"
else
  echo "❌ Failed to trigger RAGWorkflow"
  exit 1
fi
#!/bin/bash

# Post-deployment script to trigger RAGWorkflow with authentication
# Usage: ./trigger-after-deploy.sh <worker-url>

if [ -z "\$1" ]; then
  echo "❌ Error: Please provide your Worker URL"
  echo "Usage: ./trigger-after-deploy.sh https://your-worker.your-subdomain.workers.dev"
  exit 1
fi

WORKER_URL="\$1"

# Read the secret from .dev.vars
if [ ! -f .dev.vars ]; then
  echo "❌ Error: .dev.vars file not found"
  exit 1
fi

DEPLOYMENT_SECRET=\$(grep DEPLOYMENT_SECRET .dev.vars | cut -d '=' -f2)

if [ -z "\$DEPLOYMENT_SECRET" ]; then
  echo "❌ Error: DEPLOYMENT_SECRET not found in .dev.vars"
  exit 1
fi

echo "🔄 Triggering RAGWorkflow rebuild..."
RESPONSE=\$(curl -s -X POST "\${WORKER_URL}/trigger-rag-rebuild" \\
  -H "Authorization: Bearer \${DEPLOYMENT_SECRET}")

echo "📊 Response: \$RESPONSE"

if echo "\$RESPONSE" | grep -q '"success":true'; then
  echo "✅ RAGWorkflow triggered successfully!"
else
  echo "❌ Failed to trigger RAGWorkflow"
  exit 1
fi
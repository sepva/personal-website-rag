#!/bin/bash

# Setup script for automatic RAG workflow triggering on deployment
# This script creates a post-deployment trigger script with secure authentication

echo "🚀 Setting up automatic deployment trigger for RAGWorkflow..."
echo ""

# Generate a secure random token
echo "🔑 Generating secure deployment token..."
DEPLOYMENT_TOKEN=$(openssl rand -base64 32)

if [ -z "$DEPLOYMENT_TOKEN" ]; then
  echo "❌ Failed to generate token. Make sure openssl is installed."
  exit 1
fi

echo "✅ Token generated successfully"
echo ""

# Create .dev.vars file for local development
echo "📝 Creating .dev.vars file for local development..."
cat > .dev.vars << EOF
# Secret for triggering the RAG workflow rebuild after deployment
DEPLOYMENT_SECRET=${DEPLOYMENT_TOKEN}
EOF

echo "✅ .dev.vars file created"
echo ""

# Add secret to deployed worker
echo "🔐 Adding secret to deployed worker..."
echo "${DEPLOYMENT_TOKEN}" | npx wrangler secret put DEPLOYMENT_SECRET

echo ""
echo "✅ Secret added to worker"
echo ""

chmod +x trigger-after-deploy.sh

echo "✅ Setup complete!"
echo ""
echo "🔒 Security note:"
echo "   - Your endpoint is now protected with a secret token"
echo "   - The token is stored in .dev.vars (local) and as a Worker secret (production)"
echo "   - Make sure .dev.vars is in your .gitignore"
echo ""
echo "📝 Next steps:"
echo "1. Deploy your worker: npm run deploy"
echo "2. After deployment, trigger the workflow:"
echo "   ./trigger-after-deploy.sh https://your-worker.your-subdomain.workers.dev"
echo ""
echo "💡 Tip: You can add this to your package.json scripts:"
echo '   "deploy:full": "wrangler deploy && ./trigger-after-deploy.sh https://your-worker-url"'

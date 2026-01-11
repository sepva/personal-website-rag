#!/bin/bash

# Script to create D1 database and Vector Index for the personal-website-rag project

echo "Creating D1 database 'personal-website-db'..."
npx wrangler d1 create personal-website-db --binding DB --update-config=true --use-remote=true
echo ""

echo "Creating Vector Index 'personal-website-index'..."
npx wrangler vectorize create personal-website-index --binding VECTOR_INDEX --dimensions=768 --metric=cosine --update-config=true --use-remote=true
echo ""

echo "Creating metadata index on 'data_type' property..."
npx wrangler vectorize create-metadata-index personal-website-index --property-name=data_type --type=string
echo ""
echo "Setup complete!"
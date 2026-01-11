npx wrangler d1 create personal-website-db --binding DB --update-config=true --use-remote=true
npx wrangler vectorize create personal-website-index --binding VECTOR_INDEX --dimensions=768 --metric=cosine --update-config=true --use-remote=true
npx wrangler vectorize create-metadata-index personal-website-index --property-name=data_type --type=string
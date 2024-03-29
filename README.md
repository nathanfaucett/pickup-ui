# Picjup

## Tools

- [nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- [pnpm](https://pnpm.io/installation)
- [tailwind css](https://tailwindcss.com/docs)
- [svelte kit](https://kit.svelte.dev/docs)
- [icons](https://lucide.dev/icons/)

## Docker/Helm

### Deploy

- `docker build --build-arg PUBLIC_PICKUP_API_URL=https://api.pickup.com -t ghcr.io/nathanfaucett/pickup-ui:latest .`
- `docker push ghcr.io/nathanfaucett/pickup-ui:latest`
- `helm upgrade pickup-ui helm/pickup-ui -n ui --install -f values.yaml --set image.hash="$(docker inspect --format='{{index .Id}}' ghcr.io/nathanfaucett/pickup-ui:latest)"`

### Undeploy

- `helm delete -n ui pickup-ui`

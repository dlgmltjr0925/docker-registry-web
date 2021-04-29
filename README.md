# Docker Registry Web

This is a web project that can manage private docker registries.

## How to use it?

```bash
git clone https://github.com/dlgmltjr0925/docker-registry-web
cd docker-registry-web

yarn
yarn build
yarn start
```

#### Docker

```
docker run -d -p 3000:3000 --name docker-registry-web dlgmltjr0925/docker-registry-web:latest
```

#### Kubernetes

```
kubectl apply -f https://raw.githubusercontent.com/dlgmltjr0925/docker-registry-web/master/kubernetes-deployment.yaml
```

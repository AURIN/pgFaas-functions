# pgFaas - Functions

Base Docker images to deploy functions on. 


## Requirements

* Node.js 8.11.x
* NPM 5.6
* Mocha 2.5.x (globally installed)
* Docker engine 17.12.x 
* A Docker registry 


## Integration tests

Deployment of a PostGIS Docker container
```bash
  docker pull mdillon/postgis
  docker run --detach --publish 5432:5432\
    mdillon/postgis:latest
```
Download of data from OSM, then loading into PostGIS (assuming the container IP address is 172.17.0.2)

```bash

```
Run tests (these tests assume PostgreSQL container to be on IP address 172.17.0.2; if the IP address is different, the PGHOST env variable has to be changed in package.json):
```bash
  npm run itest
```


## Build and push of base images

```bash
  source ./secrets.sh; source ./configuration.sh
  docker build --tag ${DOCKER_REGISTRY}/pgfaas-node:${PGFAAS_NODE_VERSION}\
     ./pgfaas-node
  docker login --username ${DOCKER_USERNAME} --password ${DOCKER_PASSWORD}
  docker push ${DOCKER_REGISTRY}/pgfaas-node:${PGFAAS_NODE_VERSION}
```

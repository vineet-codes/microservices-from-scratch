# Notes while building a mini microservice app from scratch

Bezo's wrote this in 2002,

<img src="./bezos-api-manifesto.png" alt="bezos api mandate" width="400" />

But:

> The reality is that services do need to work together and do sometimes need to share data. How do you do that effectively? How do you ensure that this is done in a way that is sympathetic to your application’s latency and load conditions? What happens when one service needs a lot of information from another

- Different `types of communication` between services: sync vs async

  - In `sync` communication we generally get into `web of service dependency` which overtime kills the reliability of the system.
  - With microservices we use `asynchronous` communication strategies `through the use of events`.

- `Sharing of data` between services

  - **Data duplication**: Data costs are tending to 0 so do not worry about it.
  - **Data consistency**: This can get you into trouble, think hard when designing service boundries.

- Leveraging `events` and custom `event bus` to coordinate business logic

  - Process: `Categorise events` into `domain specific and general` to help define _better business logic centralisation_ and _service boundaries_.
  - Process: How to organise event definition in a central place (as supposed what we currently have where event defintions are spread accross) and always in sync with all services ?
  - Technology: Many different implementations (NATS, Kafka, RabbitMQ etc.) have varitey of different features, evaluate before building/choosing.
  - Event Sync: Use `persistent ordered event data store` to solve for service downtime data in-consistency issues.

## Kubernetes practical notes

- All one has to do is write config files. Can't be that hard.
- We will write config for:

  - Deployments
  - Services: Kubernetes objects to hep with intra pod and outside to cluster communication.
    - ClusterIP
    - NODE Port: used to connect directly to a pod; usually used in dev enviorment
    - Load Balancers
      - `kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.49.0/deploy/static/provider/cloud/deploy.yaml`
    - External Name

- Colocating deployment and service configuration helps. We do this.
- To _update a deployment/service_
  - the deployment must be using the latest tag in the pod spec section
  - Make an update to your code
  - Build the docker image
  - Push the image to docker
  - Run the command: `kubectl rollout restart deployment [depl_name]`

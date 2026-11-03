# ECS Frontend Practice

A mock-only React and TypeScript cloud infrastructure dashboard, packaged as a small Nginx container and ready to be served behind an Application Load Balancer. The UI does not call AWS or any external API; all displayed services, image URIs, metrics, and events are sample data.

## What is included

- Dashboard with ECS service health, task counts, CPU/memory metrics, deployment health, a 24-hour chart, and recent activity.
- Responsive navigation for Dashboard, ECS Services, Container Images, Deployments, and Settings.
- React Router routes, reusable UI components, loading/error states, and typed mock data.
- Vite + React + TypeScript + Tailwind CSS + Lucide React.
- Multi-stage Node/Nginx Dockerfile, SPA fallback, static-asset caching, and `/health` endpoint.
- Docker Compose with a read-only root filesystem, dropped Linux capabilities, and a writable temporary filesystem.

## Phase status

| Phase | Status | Notes |
|---|---|---|
| 1. React dashboard | Complete | Mock data; responsive pages and reusable components. |
| 2. Docker and Nginx | Complete | Multi-stage image; Nginx serves port 80, with non-root worker processes. |
| 3. Local container validation | Partially verified | Build, lint, and tests run locally. Docker Engine is not currently responding, so image/run/browser checks inside the container remain pending. |
| 4–8. AWS deployment | Not started | Requires an AWS CLI installation, an authenticated AWS account, and a chosen region. No AWS resources were created. |
| 9. GitHub Actions/OIDC | Workflow added | Configure GitHub Actions variables and a narrowly scoped AWS OIDC role after creating the AWS resources. |
| 10. Terraform | Not started | Keep this after the Console/CLI deployment, as intended in the learning sequence. |

## Run and validate locally

Prerequisites: Node.js 22+ with npm, and Docker Desktop using Linux containers for the container checks.

```powershell
cd C:\path\to\ecs-frontend-practice
npm ci
npm run dev
```

Open the Vite URL printed in the terminal (normally `http://localhost:5173`). In another terminal, run:

```powershell
npm run lint
npm test
npm run build
```

### Build and run the production container

Start Docker Desktop and wait for its Linux engine to be ready before running these commands:

```powershell
docker build -t ecs-frontend-practice:local .
docker run -d --rm -p 8080:80 --name ecs-frontend ecs-frontend-practice:local
Invoke-WebRequest http://localhost:8080/health
Invoke-WebRequest http://localhost:8080/services
docker inspect --format='{{.State.Health.Status}}' ecs-frontend
docker stop ecs-frontend
```

`/health` should return `200` and `ok`; `/services` should return the SPA HTML, including on a direct request/refresh. The Docker health status should become `healthy`. The `-p 8080:80` option maps the local machine's port 8080 to the container's port 80.

Or use Compose:

```powershell
docker compose up --build -d
Invoke-WebRequest http://localhost:8080/health
docker compose down
```

The final container contains only the Nginx runtime and built static assets; Node and development dependencies remain in the build stage. The Nginx master starts with the privileges needed to bind port 80, then serves requests with the `nginx` non-root worker. The ECS/ALB target port therefore remains 80.

## Deployment architecture

```text
Internet
  -> internet-facing ALB (two public subnets, listener :80)
  -> IP target group (port 80, health check /health)
  -> ECS Fargate service (desired count 2, private subnets in two AZs)
  -> Nginx container (port 80)

ECR stores immutable, commit-SHA-tagged images.
CloudWatch Logs receives container stdout/stderr.
```

The ALB security group should accept HTTP from the internet. The task security group should accept port 80 **only from the ALB security group**. Fargate tasks should use private subnets and should not receive public IPs. For outbound access, choose either NAT gateways or VPC endpoints for ECR (API and Docker), S3, and CloudWatch Logs. Two NAT gateways improve AZ independence but have ongoing hourly and data-processing charges; endpoints avoid NAT costs for these services but also have hourly/data-processing costs for interface endpoints. Compare current regional pricing before creating resources.

### AWS learning sequence (not yet run)

**ECS terms.** An **ECR repository** stores container image versions. An **ECS task definition** is the versioned template (image, CPU/memory, port, log configuration, and health check) for a task. An **ECS task** is one running copy of that template. An **ECS service** keeps the configured number of tasks running, replaces failed tasks, and integrates with the load balancer. An **ECS cluster** is the logical grouping used to organize ECS services and tasks. **Fargate** supplies serverless container compute, so no EC2 hosts are managed.

**Phase 4 — ECR.** In the AWS Console, select the intended region, open **Amazon ECR → Private registry → Repositories → Create repository**, choose a private repository named `ecs-frontend-practice`, enable scan-on-push, and set tag mutability to immutable. The following PowerShell commands create and publish one image. Authenticate to AWS with IAM Identity Center/SSO (not long-lived access keys) before running them:

```powershell
$AWS_REGION = "us-east-1"
$AWS_PROFILE = "your-sso-profile"
aws sso login --profile $AWS_PROFILE
$env:AWS_PROFILE = $AWS_PROFILE
$AWS_ACCOUNT_ID = aws sts get-caller-identity --query Account --output text
$ECR_REPO = "ecs-frontend-practice"
$IMAGE_TAG = git rev-parse HEAD
$ECR_URI = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}"
$IMAGE = "${ECR_URI}:${IMAGE_TAG}"

aws ecr create-repository --repository-name $ECR_REPO --image-tag-mutability IMMUTABLE --image-scanning-configuration scanOnPush=true --encryption-configuration encryptionType=AES256 --region $AWS_REGION
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
docker build --platform linux/amd64 -t $IMAGE .
docker push $IMAGE
aws ecr describe-images --repository-name $ECR_REPO --image-ids "imageTag=$IMAGE_TAG" --query "imageDetails[0].[imageTags[0],imagePushedAt,imageSizeInBytes]" --output table --region $AWS_REGION
```

- `aws sso login` obtains a temporary CLI session through the selected SSO profile; it does not create permanent access keys.
- `aws sts get-caller-identity` confirms which AWS identity is active and reads its account ID for the ECR URI.
- `aws ecr create-repository` creates the private registry repository, turns on image scanning, encrypts at rest with the default S3-managed key, and prevents replacing a tag. If you created the repository in the Console, skip this command.
- `aws ecr get-login-password` obtains a short-lived ECR token and pipes it to Docker login; the token is not written into the project.
- `docker build` builds the Linux x86_64 image for Fargate and tags it with the full Git commit SHA. `docker push` uploads that immutable image.
- `aws ecr describe-images` verifies the pushed tag, push time, and stored size.

**Phases 5–8 — ECS, VPC, ALB, and CloudWatch.** Create the VPC before the service: use two AZs, two public and two private subnets, an internet gateway, and private-subnet egress via NAT or the ECR/S3/Logs endpoints above. In **IAM → Roles**, create an ECS task execution role trusted by `ecs-tasks.amazonaws.com`; restrict ECR pull permissions to this repository and CloudWatch log permissions to the app log group. In **CloudWatch → Logs → Log groups**, create `/ecs/ecs-frontend` with a finite retention period (for example 30 days). Logs incur ingestion and storage charges.

In **ECS → Clusters → Create cluster**, create `ecs-frontend-cluster` using Fargate. In **ECS → Task definitions → Create new task definition**, choose AWS Fargate, Linux/x86_64, `awsvpc`, 0.25 vCPU and 0.5 GiB memory, and a container named `frontend` using `$IMAGE`, container port 80, `awslogs` to `/ecs/ecs-frontend`, and the `/health` container health check. In **EC2 → Load Balancing → Target Groups**, create an IP target group with HTTP port 80 and health path `/health`. Create an internet-facing ALB across the two public subnets, with an HTTP :80 listener forwarding to that target group.

In **ECS → Clusters → ecs-frontend-cluster → Services → Create**, choose Fargate, the task definition, desired count 2, private subnets in both AZs, no public IP, the task security group (inbound port 80 from the ALB security group only), and the ALB target group. Enable the deployment circuit breaker with rollback and set an appropriate health-check grace period. Confirm that both task IPs register as healthy in **EC2 → Target Groups → Targets** before using the ALB DNS name shown in **EC2 → Load Balancers**.

Useful read-only AWS CLI checks once those resources exist:

```powershell
aws ecs describe-services --cluster ecs-frontend-cluster --services ecs-frontend-service --query "services[0].{running:runningCount,desired:desiredCount,events:events[0:5]}" --output table --region $AWS_REGION
aws elbv2 describe-target-health --target-group-arn $TARGET_GROUP_ARN --query "TargetHealthDescriptions[].{ip:Target.Id,state:TargetHealth.State,reason:TargetHealth.Reason}" --output table --region $AWS_REGION
aws logs describe-log-streams --log-group-name /ecs/ecs-frontend --order-by LastEventTime --descending --limit 5 --query "logStreams[].logStreamName" --output table --region $AWS_REGION
```

`aws ecs describe-services` reports service counts and recent deployment events; `aws elbv2 describe-target-health` confirms target registration and health; `aws logs describe-log-streams` shows whether tasks are producing log streams. Use **CloudWatch → Metrics → ECS** for service CPU/memory. For image pull failures, inspect ECS service events, execution-role ECR permissions, repository URI/tag, and private subnet egress/endpoints. For startup failures or restarts, inspect the task stopped reason and `/ecs/ecs-frontend` logs. For unhealthy targets, compare the target-group health reason with task security-group rules, port 80, and `/health`. For availability, check ALB target health, ECS running/desired counts and events, then CloudWatch logs/metrics. ALB routes requests only to healthy registered IP targets; it distributes new requests across them and removes unhealthy targets until they pass health checks again.

ECS task CPU/memory and ALB/NAT/VPC endpoint/CloudWatch charges continue while resources exist. Delete resources in dependency order after practice (service, ALB/listener/target group, cluster, log group, ECR images/repository, endpoints/NAT, then VPC); retain any ECR image needed for rollback.

### GitHub Actions deployment

The workflow in `.github/workflows/deploy-ecs.yml` runs lint, tests, and a frontend build for pull requests and pushes to `main`. A successful push to `main` builds an `linux/amd64` image tagged with the commit SHA, pushes it to ECR, registers a new revision of the configured ECS task definition with that image, and updates the ECS service. It also supports manual runs from `main`. ECR can therefore use immutable tags; the workflow never overwrites an image tag.

Before deploying, create these **Actions → Variables** in the GitHub repository:

| Variable | Value |
|---|---|
| `AWS_ROLE_ARN` | ARN of the IAM role GitHub Actions assumes through OIDC |
| `AWS_REGION` | AWS region containing the ECR repository and ECS service |
| `ECR_REPOSITORY` | ECR repository name, for example `ecs-frontend-practice` |
| `ECS_CLUSTER` | ECS cluster name, for example `ecs-frontend-cluster` |
| `ECS_SERVICE` | ECS service name, for example `ecs-frontend-service` |
| `ECS_TASK_DEFINITION` | Existing ECS task-definition family or revision |
| `ECS_CONTAINER_NAME` | Container name inside that task definition, for example `frontend` |

Configure the IAM role's OIDC trust policy to trust only this GitHub repository's `main` branch (`repo:OWNER/REPOSITORY:ref:refs/heads/main`). Grant only the permissions needed to authenticate to ECR and push images to the specified repository, describe/register the task definition, update/describe the specified ECS service, and pass its task and execution roles to ECS. Do not add AWS access keys or other credentials to the repository. Pull requests run verification only and do not receive AWS deployment credentials.

Terraform remains deferred until the Console/CLI deployment is verified; use remote state and environment-specific variables when proceeding. No AWS resources are created by the workflow itself.

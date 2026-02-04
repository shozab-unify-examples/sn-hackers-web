# Hackers Web Application

A modern web interface for viewing Hacker News content, built with Vue.js and featuring dynamic feature management.

## Local Development

### Prerequisites
- Node.js (v14+)
- npm or yarn
- Docker (optional, for container builds)

### Configuration
Create a `.env.local` file in the root directory with the following variables:
```
VUE_APP_API_URL=<your-api-url>
VUE_APP_FM_KEY=<your-feature-management-key>
```

### Running Locally
```bash
# Install dependencies
npm install

# Start development server
npm run serve

# Run unit tests
npm run test:unit

# Build for production
npm run build
```

### Building the Docker Image
```bash
docker build -t your-repo/hackers-web:tag .
```

## Deployment

### Prerequisites
- Kubernetes cluster
- Helm 3.x
- Nginx Ingress Controller
- cert-manager (for TLS)

### Helm Deployment

The application can be deployed using the included Helm chart. 

1. Update the values file (`values.yaml`) or create a custom one:

```yaml
image:
  repository: your-repo/hackers-web
  tag: your-tag

hostname: your-domain.example.com

config:
  apiUrl: https://your-api-url
  fmKey: your-feature-management-key
  authUrl: https://your-api-url
```

2. Install the chart:
```bash
helm install hackers-web ./chart -f values.yaml
```

### Configuration Options

| Parameter | Description | Default |
|-----------|-------------|---------|
| `image.repository` | Docker image repository | `""` |
| `image.tag` | Docker image tag | `""` |
| `image.pullPolicy` | Image pull policy | `IfNotPresent` |
| `hostname` | Application hostname for ingress | `""` |
| `config.apiUrl` | HN API URL | `""` |
| `config.fmKey` | Feature Management key | `""` |
| `config.authUrl` | Auth API URL | `""` |
| `ingress.enabled` | Enable ingress | `true` |
| `ingress.className` | Ingress class name | `nginx` |
| `ingress.tls.enabled` | Enable TLS | `true` |
| `resources.limits.cpu` | CPU limit | `200m` |
| `resources.limits.memory` | Memory limit | `256Mi` |
| `resources.requests.cpu` | CPU request | `100m` |
| `resources.requests.memory` | Memory request | `128Mi` |
| `replicaCount` | Number of replicas | `1` |

### TLS Configuration

The chart is configured to use Let's Encrypt for TLS certificates. It assumes:
- cert-manager is installed in the cluster
- The `letsencrypt-prod` ClusterIssuer is configured

### Health Checks

The deployment includes:
- Liveness probe at `/`
- Readiness probe at `/`

## Feature Management

The application uses feature flags to control various functionality. These are managed through the Feature Management service configured via `VUE_APP_FM_KEY`.


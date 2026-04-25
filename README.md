# Three-Tier Web Application 🚀

A full-stack, three-tier web application consisting of a **Next.js Frontend**, a **Node.js/Express Backend**, and a **MongoDB Database**. This project is fully containerized, managed via **Helm**, and deployed to **AWS EKS** using a GitOps workflow (Argo CD) and automated via **GitHub Actions**.

## 📸 Screenshots
![Screenshot 1 - Frontend UI](/images/deplyed-app.png)

![Screenshot 2 - Argo CD Dashboard](/images/argocd.png)

![Screenshot 3 - Argo CD Backend](/images/backend-argocd.png)

![Screenshot 4 - Argo CD Frontend](/images/frontend-argocd.png)
![Application UI](./images/app-preview.png)
---

## 🏗️ Architecture Overview

1. **Frontend**: Next.js application built as a static site/standalone image. Uses relative paths (`/api`) to dynamically route traffic to the backend via Ingress, avoiding hardcoded `.env` files in the browser bundle.
2. **Backend**: Node.js REST API serving data to the frontend and connecting to MongoDB.
3. **Database**: MongoDB running as a Kubernetes StatefulSet with persistent EBS storage.
4. **Ingress**: NGINX Ingress Controller routing `three-tier-app.example.com/` to the frontend and `/api` to the backend.

---

## 🛠️ Prerequisites
- Docker & Docker Compose
- `kubectl` and `helm` installed
- AWS CLI & `eksctl` configured with EKS cluster access
- Argo CD (Optional, for GitOps deployment)

---

## 🚀 Local Deployment (Docker Compose)
To run the entire stack locally for development:
```bash
docker-compose up --build
```

---

## ☸️ Kubernetes Deployment (Helm)

We migrated from standard Kubernetes manifests to **Helm Charts** for easier templating and CI/CD integration. 

### 1. Install / Upgrade the Backend Chart
```bash
helm upgrade --install backend ./backend/helm/three-tier-app -n three-tier-app-ns --create-namespace
```

### 2. Install / Upgrade the Frontend Chart
```bash
helm upgrade --install frontend ./frontend/helm/frontend -n three-tier-app-ns --create-namespace
```

### 3. Verify the Deployment
```bash
kubectl get all,pvc,ing -n three-tier-app-ns
```

---

## ☁️ AWS EKS Specific Configurations

Deploying stateful applications (like MongoDB) to modern AWS EKS requires specific CSI driver configurations. Here are the steps we executed to resolve the `Pending` PersistentVolumeClaim (PVC) issues:

### 1. Enable IAM OIDC Provider
Required to link Kubernetes Service Accounts to AWS IAM Roles (IRSA).
```bash
eksctl utils associate-iam-oidc-provider \
    --region=us-east-1 \
    --cluster=three-tier-cluster \
    --approve
```

### 2. Install the Amazon EBS CSI Driver
EKS 1.23+ requires the EBS CSI driver to provision `gp2`/`gp3` volumes. We explicitly defined `storageClassName: gp2` in the MongoDB StatefulSet.
```bash
eksctl create iamserviceaccount \
  --name ebs-csi-controller-sa \
  --namespace kube-system \
  --cluster three-tier-cluster \
  --attach-policy-arn arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy \
  --approve \
  --override-existing-serviceaccounts
```

### 3. Install EKS Pod Identity Agent (Crucial!)
Because newer EKS add-ons default to EKS Pod Identity, the driver pods will crash searching for a local credential endpoint (`169.254.170.23`) if the agent is missing.
```bash
eksctl create addon --cluster three-tier-cluster --name eks-pod-identity-agent --approve
```

### 4. Restart the CSI Driver
```bash
kubectl rollout restart deployment ebs-csi-controller -n kube-system
```

---

## 🌐 Ingress & Local Routing

We use a single Ingress resource to route traffic without CORS issues:
- `http://three-tier-app.example.com/` → Frontend
- `http://three-tier-app.example.com/api` → Backend

**Local Testing Setup:**
If testing the Ingress locally (e.g., Docker Desktop or Minikube), map the domain in your local hosts file:
```bash
sudo vim /etc/hosts
# Add the following line:
[IP_ADDRESS]   three-tier-app.example.com
```

---

## 🔄 CI/CD Pipeline (GitHub Actions)

We implemented fully automated CI pipelines for both the Frontend and Backend located in `.github/workflows/`.

### Workflow Steps:
1. **Build & Push**: Builds the Docker image and pushes it to Docker Hub using the `${{ github.run_id }}` as the image tag.
2. **Manifest Update**: Uses `sed` to dynamically update the `values.yaml` file in the Helm charts with the new image tag.
3. **Commit & Push**: Commits the updated Helm chart back to the `master` branch.

**Key Fixes Implemented:**
- Configured GitHub Secrets (`DOCKER_HUB_USERNAME`, `DOCKER_HUB_PASSWORD`, `TOKEN`).
- Granted `contents: write` permissions to the default `GITHUB_TOKEN`.
- Resolved *Divergent Branch* (`exit code 128`) errors during concurrent pipeline runs by using:
  ```bash
  git pull --rebase origin master
  ```

---
*Happy Helming! ⛵*
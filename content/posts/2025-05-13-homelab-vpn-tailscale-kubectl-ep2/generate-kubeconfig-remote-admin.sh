#!/bin/bash

set -e

# ------------------ ARGS ------------------
if [ -z "$1" ]; then
  echo "❗ Usage: $0 <CLUSTER_ENDPOINT>"
  echo "   Example: $0 https://xxx.yyyy.ts.net:6443"
  exit 1
fi

CLUSTER_ENDPOINT=$1
# ------------------------------------------

# ----------------- CONFIG -----------------
SERVICE_ACCOUNT=remote-admin
NAMESPACE=default
CLUSTER_NAME=my-homelab_remote
OUTPUT_FILE=remote-kubeconfig.yaml
CA_CERT_PATH="/var/lib/rancher/rke2/server/tls/serving-kube-apiserver.crt"
# ------------------------------------------

echo "🔧 Creating ServiceAccount: $SERVICE_ACCOUNT"
kubectl create serviceaccount $SERVICE_ACCOUNT -n $NAMESPACE || echo "ℹ️ Already exists"

echo "🔒 Binding to cluster-admin"
kubectl create clusterrolebinding ${SERVICE_ACCOUNT}-binding \
  --clusterrole=cluster-admin \
  --serviceaccount=${NAMESPACE}:${SERVICE_ACCOUNT} || echo "ℹ️ Binding already exists"

echo "⏳ Waiting for ServiceAccount token to be ready..."
sleep 2

echo "🔐 Getting token using kubectl create token"
USER_TOKEN=$(kubectl create token $SERVICE_ACCOUNT -n $NAMESPACE)

if [ -z "$USER_TOKEN" ]; then
  echo "❌ ERROR: Failed to retrieve token"
  exit 1
fi

echo "📄 Getting certificate-authority-data from: $CA_CERT_PATH"
if [ ! -f "$CA_CERT_PATH" ]; then
  echo "❌ ERROR: CA cert not found at $CA_CERT_PATH"
  exit 1
fi

CA_CRT=$(sudo cat "$CA_CERT_PATH" | base64 | tr -d '\n')

echo "📝 Writing kubeconfig to $OUTPUT_FILE"
cat <<EOF > $OUTPUT_FILE
apiVersion: v1
kind: Config
clusters:
- name: $CLUSTER_NAME
  cluster:
    server: $CLUSTER_ENDPOINT
    certificate-authority-data: $CA_CRT
users:
- name: $SERVICE_ACCOUNT
  user:
    token: $USER_TOKEN
contexts:
- name: ${CLUSTER_NAME}-context
  context:
    cluster: $CLUSTER_NAME
    user: $SERVICE_ACCOUNT
current-context: ${CLUSTER_NAME}-context
EOF

echo "✅ Kubeconfig created at $OUTPUT_FILE"

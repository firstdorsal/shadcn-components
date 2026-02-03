#!/usr/bin/env bash
set -euo pipefail

# Load environment from .env if it exists
if [ -f .env ]; then
    set -a
    # shellcheck source=/dev/null
    source .env
    set +a
fi

PROJECT_NAME="${PROJECT_NAME:?PROJECT_NAME must be set}"
CI_REGISTRY="${CI_REGISTRY:-hub.vindelicum.eu}"
TAG="${1:-latest}"

docker build \
    -t "${CI_REGISTRY}/${PROJECT_NAME}:${TAG}" \
    -t "${CI_REGISTRY}/${PROJECT_NAME}:latest" \
    .

echo "Built: ${CI_REGISTRY}/${PROJECT_NAME}:${TAG}"

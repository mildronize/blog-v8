+++
title = "Resolving Docker Multi-stage Build Errors on GitHub Actions"
date = "2024-02-01"

[taxonomies]
categories = [ "Docker" ]
tags = [
  "Docker",
  "GitHub Actions",
  "Multi-stage build",
  "pnpm",
  "Node.js"
]

[extra]
uuid = "faa2fwg"
+++

Setting up a CI/CD pipeline with multi-stage Docker builds on GitHub Actions can be a powerful way to automate your workflow. However, you may encounter challenges, as I recently did, when building a Docker image using multi-stage builds and GitHub Actions.

## The Problem
The issue surfaced when I attempted to build a Docker image with multi-stage builds using the `pnpm` package manager. The problem is not related to pnpm itself; instead, I utilized an example from the pnpm documentation for multi-stage builds. The error that emerged during the Docker image build process, seemingly tied to pnpm, was actually rooted in the Dockerfile's implementation of multi-stage builds. The error message specifically highlighted an inconsistency in the cache key calculation, leading to confusion and the need for further investigation.

The root cause of the issue lies in the `Dockerfile`, particularly during the implementation of multi-stage builds and the integration of the pnpm package manager. For reference, the approach was inspired by [the official documentation](https://pnpm.io/docker#example-1-build-a-bundle-in-a-docker-container).


```dockerfile
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
EXPOSE 8000
CMD [ "pnpm", "start" ]
```

This section of the Dockerfile, influenced by the recommended practices outlined in the official `pnpm` documentation, initiates the build process. Despite following the prescribed steps, an unforeseen error arose during the GitHub Actions workflow, prompting the need for investigation and resolution.

## GitHub Actions Workflow
The GitHub Actions workflow responsible for building and pushing the Docker image looked like this:

```yaml
- name: Build and push Docker image
  uses: docker/build-push-action@v5
  with:
    context: .
    push: true
```

The encountered error was as follows:

```
buildx failed with: ERROR: failed to solve: failed to compute cache key: failed to calculate checksum of ref 8abab386-ee6f-4a46-817c-c1639873e713::8skhbm74dq1epjac59datwfm4: "...": not found
```

## Solution 1: Consolidating Multi-Stage Builds
One approach to resolve this issue is to consolidate the multi-stage build into a single stage:

```dockerfile
FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

# Ensure `"type": "module"` is set in package.json
COPY --from=build /app/package.json /app/package.json
# Production dependencies
COPY --from=build /app/node_modules /app/node_modules
# Application
COPY --from=build /app/dist /app
```

However, be cautious as this modification might lead to another error:

```
Error: buildx failed with: ERROR: local cache importer requires src
```

## Solution 2: Modifying GitHub Actions Workflow

<!-- I've found that the documentation for the `docker/build-push-action` shown in here [docker/build-push-action](https://github.com/docker/build-push-action/tree/v5.1.0?tab=readme-ov-file#inputs) provides that we can change the cache mechanism by adding `cache-from` e.g., `type=local,src=path/to/dir`
, and I've found that in the [List of external cache sources](https://docs.docker.com/engine/reference/commandline/buildx_build/#cache-from) show `gha` (Github Actions Cache) for building docker. 

To address the additional error, modify the GitHub Actions workflow by adding `cache-from`: -->

In the pursuit of resolving the encountered error, I delved into the documentation for the **`docker/build-push-action`**, available at [docker/build-push-action](https://github.com/docker/build-push-action/tree/v5.1.0?tab=readme-ov-file#inputs). Here, I discovered a valuable configuration option called **`cache-from`** that allows us to tweak the cache mechanism. For example, we can employ **`type=local,src=path/to/dir`** to change the caching strategy.

Additionally, exploring the [List of external cache sources](https://docs.docker.com/engine/reference/commandline/buildx_build/#cache-from) revealed the use of **`gha`** (Github Actions Cache) as a viable option for Docker builds within the GitHub Actions environment.

To mitigate the secondary error, it is recommended to enhance the GitHub Actions workflow by incorporating the **`cache-from`** parameter:

```yaml
- name: Build and push Docker image
  uses: docker/build-push-action@v5
  with:
    context: .
    push: true
    cache-from: type=gha
```

These solutions aim to provide a smoother experience when working with multi-stage Docker builds in GitHub Actions. Integrating these adjustments into your pipeline should help mitigate common errors, ensuring a more efficient and reliable CI/CD process for your project.

Here's the full Dockerfile and GitHub Actions configuration:

```dockerfile
# https://pnpm.io/docker#example-1-build-a-bundle-in-a-docker-container

FROM node:20-slim As base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY --chown=node:node . ./app
WORKDIR /app
USER node

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

# Not Natively support ARM64 (M1)
FROM alpine:3.19 As production

ENV PORT=3333

# Make sure `"type": "module"` is set in package.json
COPY --from=build /app/package.json /app/package.json
# Production dependencies
COPY --from=build /app/node_modules /app/node_modules
# Application
COPY --from=build /app/dist /app

RUN apk add --update --no-cache nodejs=$NODE_VERSION


EXPOSE ${PORT}

# Create a group and user
RUN addgroup -g 1000 node \
    && adduser -u 1000 -G node -s /bin/sh -D node

USER node

CMD [ "node", "app/main.js" ]
```

and Github Actions

```yaml
# https://docs.github.com/en/actions/publishing-packages/publishing-docker-images#publishing-images-to-github-packages
name: Create and publish a Docker image

# Configures this workflow to run every time a change is pushed to the branch called `release`.
on:
  push:
    # branches: ['release']
    branches:
      - main

# Defines two custom environment variables for the workflow. These are used for the Container registry domain, and a name for the Docker image that this workflow builds.
env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

# There is a single job in this workflow. It's configured to run on the latest available version of Ubuntu.
jobs:
  build-and-push-image:
    runs-on: ubuntu-latest
    # Sets the permissions granted to the `GITHUB_TOKEN` for the actions in this job.
    permissions:
      contents: read
      packages: write
      # 
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
      # Uses the `docker/login-action` action to log in to the Container registry registry using the account and password that will publish the packages. Once published, the packages are scoped to the account defined here.
      - name: Log in to the Container registry
        uses: docker/login-action@65b78e6e13532edd9afa3aa52ac7964289d1a9c1
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      # This step uses [docker/metadata-action](https://github.com/docker/metadata-action#about) to extract tags and labels that will be applied to the specified image. The `id` "meta" allows the output of this step to be referenced in a subsequent step. The `images` value provides the base name for the tags and labels.
      - name: Extract metadata (tags, labels) for Docker
        id: meta
        uses: docker/metadata-action@9ec57ed1fcdbf14dcef7dfbe97b2010124a938b7
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
      # This step uses the `docker/build-push-action` action to build the image, based on your repository's `Dockerfile`. If the build succeeds, it pushes the image to GitHub Packages.
      # It uses the `context` parameter to define the build's context as the set of files located in the specified path. For more information, see "[Usage](https://github.com/docker/build-push-action#usage)" in the README of the `docker/build-push-action` repository.
      # It uses the `tags` and `labels` parameters to tag and label the image with the output from the "meta" step.
      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
```

You can also see the [full example repo here](https://github.com/thaitype/spy-proxy/releases/tag/v0.0.0).

## **Discussion**

### **Investigating Multi-Stage Builds**

In dissecting the encountered challenges during the Docker image build process, it became evident that the initial error, seemingly attributed to the **`pnpm`** package manager, was, in fact, a consequence of the implementation of multi-stage builds in the Dockerfile. The chosen approach drew inspiration from the official [pnpm documentation](https://pnpm.io/docker#example-1-build-a-bundle-in-a-docker-container). This revelation clarified that the issue did not originate from **`pnpm`** itself but rather from nuances in the Dockerfile structure.

### **Navigating Dockerfile Complexity**

The Dockerfile's multi-stage build, designed to optimize the image creation process, unintentionally introduced complexities that led to an error in cache key calculation. Recognizing the root cause and understanding the intricacies of multi-stage builds proved pivotal in devising effective solutions.

### **Unveiling GitHub Actions Insights**

In the quest for resolution, a deep dive into the documentation for the **[docker/build-push-action](https://github.com/docker/build-push-action/tree/v5.1.0?tab=readme-ov-file#inputs)** shed light on valuable configuration options. The discovery of the **`cache-from`** parameter provided an avenue to refine the caching strategy, offering insights into optimizing the GitHub Actions workflow for Docker image builds.

## **Solutions Explored**

### **Solution 1: Consolidating Multi-Stage Builds**

The first solution involved consolidating the multi-stage build into a single stage, modifying the Dockerfile structure. However, this adjustment posed the risk of triggering another error, necessitating a careful balance between optimization and potential pitfalls.

### **Solution 2: Refining GitHub Actions Workflow**

The second solution focused on refining the GitHub Actions workflow by leveraging insights from the [docker/build-push-action documentation](https://github.com/docker/build-push-action/tree/v5.1.0?tab=readme-ov-file#inputs). The introduction of the **`cache-from`** parameter, particularly using **`type=gha`** (GitHub Actions Cache), aimed to enhance the caching strategy, addressing the secondary error and offering a more stable foundation for Docker image building within the GitHub Actions environment.

## **Conclusion**

In navigating the complexities of multi-stage Docker builds and GitHub Actions, this exploration has illuminated the importance of meticulous configuration and adaptation. While inspired by best practices from the **`pnpm`** documentation, it is crucial to recognize that each project's unique context may demand tailored solutions.

The refinement of the Dockerfile structure and the optimization of the GitHub Actions workflow showcase the iterative nature of development. By embracing insights from documentation and understanding the tools at our disposal, we can pave the way for smoother CI/CD pipelines and more resilient Docker image builds.
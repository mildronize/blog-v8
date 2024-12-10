+++
title = "Run Container Docker on Mac M1 (Arm CPU) using Colima"
date = "2024-10-09"

[taxonomies]
categories = [ "Docker" ]
tags = [ "Docker", "Mac M1", "Arm", "Colima", "Container" ]

[extra]
id = "j4wuxv0"
+++


Docker provides a powerful tool for containerization, but running it on a Mac M1 with an ARM CPU requires a specific approach. This article introduces [**Colima**](https://github.com/abiosoft/colima), a lightweight Docker runtime that serves as an alternative to Docker Desktop, providing a seamless experience for Apple Silicon users. Here, we will guide you through the process of setting up and using Colima on your Mac M1.

## Introduction to Colima

[**Colima**](https://github.com/abiosoft/colima) is a fast and efficient Docker runtime designed for both Apple Silicon (M1) and Intel-based Macs. It simplifies the process of running Docker containers on Mac M1, ensuring compatibility with various architectures and offering an alternative to [Docker Desktop](https://www.docker.com/products/docker-desktop/). Colima provides a reliable way to utilize Docker without the performance concerns often associated with running x86 containers on ARM-based systems.

## Installation and Setup of Colima

To begin using Colima, you first need to install it. This can be done via Homebrew with the following command:

```sh
brew install colima
```

Once installed, you can proceed with starting Colima.

## Starting Colima

To run Docker commands with Colima, you must start the service. The command below initiates Colima, specifying the architecture to use:

```sh
colima start --arch x86_64
```

We recommend specifying the `x86_64` architecture, as some Docker images may not yet be available for ARM64. However, if you wish to run ARM64 containers, you can use the `--arch aarch64` option, or simply omit the flag to use the default architecture.

## Using Docker with Colima

After starting Colima, you can execute Docker commands in the same manner as with Docker Desktop. For example, pulling and running an image can be done as follows:

```sh
docker pull hello-world
docker run --rm hello-world
docker rmi hello-world
```

These commands will demonstrate the basic functionality of Docker within the Colima environment.

## Stopping Colima

Since running Colima consumes system resources, it is advisable to stop it when not in use. To stop Colima, run the following command:

```sh
colima stop
```

This will release system resources and halt Docker operations.

## Troubleshooting Colima

If you encounter issues while using Colima, the simplest solution is often to delete the Colima instance and restart it. This can be done with the following command:

```sh
colima delete
```

The system will prompt you to confirm the deletion of the Colima instance and its settings. Typing `y` will proceed with the deletion.

## Using Dive with Colima

If you are using [Dive](https://github.com/wagoodman/dive), a tool for inspecting Docker images, you may encounter an issue with the Docker socket. To resolve this, you can create a symbolic link to the Docker socket by running:

```sh
sudo ln -sf ~/.colima/docker.sock /var/run/docker.sock
```

Note that you will need to execute this command each time after starting Colima.

## Conclusion

Colima provides an efficient and straightforward solution for running Docker containers on Mac M1 systems. By leveraging Colima, users can enjoy the benefits of Docker without encountering the compatibility issues that sometimes arise with Apple Silicon. Whether you are building applications or managing containerized environments, Colima offers a reliable alternative to Docker Desktop.

## Common Issues with Docker on Mac M1

Occasionally, when building Docker images on the Mac M1, you may encounter platform-specific issues. For example, building with `esbuild` may result in errors due to the architecture mismatch. To resolve this, you can build images targeting the `amd64` platform:

```sh
docker buildx build --platform linux/amd64 -t image-name .
```

An example error during the build process might look like this:

```css
css
Copy code
#0 2.159 > esbuild src/main.ts --bundle --platform=node --target=node16 --format=cjs --outfile=dist/main.cjs --minify
#0 2.159
#0 2.255 /app/node_modules/.bin/esbuild: 13: /app/node_modules/.bin/../esbuild/bin/esbuild: Exec format error
#0 2.266  ELIFECYCLE  Command failed with exit code 126.

```

For further discussion on this topic, you can refer to the [esbuild issue](https://github.com/evanw/esbuild/issues/642) or consult resources like [this article](https://zenn.dev/nixieminton/articles/c0933bbaae43f1) for additional troubleshooting steps.

## References

- [How to Build Docker Images on Apple M-Series](https://www.izumanetworks.com/blog/build-docker-on-apple-m/)
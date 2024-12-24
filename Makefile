serve:
	zola serve

blog-build:
	zola build

id-mapper:
	cd snippets && bun generate-id-mapper

# dev-prepare: The dev-prepare target is used to prepare the development environment.
dev-prepare:
	cd snippets && bun install

# dev: The dev target is used to start the development server, post-build steps need to be taken before the site is ready.
dev: dev-prepare post-build serve

resume:
	cd snippets && bun resume:build

# build: The build target is the final target that will be called by the CI/CD pipeline.
build: blog-build post-build

# post-build: The post-build target is a placeholder for any post-build steps that need to be taken.
post-build: resume id-mapper clean-js-build

clean-js-build:
	rm -rf public/js/src
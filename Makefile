serve:
	zola serve

blog-build:
	zola build

id-mapper:
	cd snippets && bun generate-id-mapper

dev: id-mapper serve

build: blog-build id-mapper clean-js-build

clean-js-build:
	rm -rf public/js/src
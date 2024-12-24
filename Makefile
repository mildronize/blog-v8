serve:
	zola serve

blog-build:
	zola build

id-mapper:
	cd snippets && bun generate-id-mapper

dev: id-mapper resume serve

resume:
	cd snippets && bun resume:build

build: blog-build resume id-mapper clean-js-build

clean-js-build:
	rm -rf public/js/src
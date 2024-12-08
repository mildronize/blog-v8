serve:
	zola serve

blog-build:
	zola build

id-mapper:
	cd scripts && bun run src/generate-id-mapper.ts 

dev: id-mapper serve

build: blog-build id-mapper clean-js-build

clean-js-build:
	rm -rf public/js/src
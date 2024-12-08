serve:
	zola serve

blog-build:
	zola build

prebuild:
	cd scripts && bun run src/generate-id-mapper.ts 

dev: prebuild serve

build: prebuild blog-build clean-js-build

clean-js-build:
	rm -rf public/js/src
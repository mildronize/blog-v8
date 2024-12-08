serve:
	zola serve

prebuild:
	cd scripts &&  bun run src/generate-id-mapper.ts 

dev: prebuild serve
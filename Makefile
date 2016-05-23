SHELL=/bin/bash

development:
	NODE_ENV=development npm run webpack

production:
	NODE_ENV=production npm run webpack

release: development production
	mkdir -p output/development
	mkdir -p output/production
	mv build/development/index.html output/development/index.html
	mv build/production/index.html output/production/index.html
	./bin/build.js

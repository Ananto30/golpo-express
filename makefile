SHELL := /bin/bash
run:
		docker rm -f ananto-golpo
		docker build -t ananto/golpo .
		docker run --env-file=.env -p 8080:8080 --name ananto-golpo -d ananto/golpo

.PHONY: all build backend up up_d downiclean cclean dclean aclean are re 

MAKE := make -i

all:
	${MAKE} build
	${MAKE} up

build:
	docker compose build

backend:
	docker compose logs -f nestjs

up: 
	docker compose up

up_d:
	docker compose up -d

down:
	docker compose down

re:
	make dclean
	make

are:
	make aclean
	make

#image clean
iclean:
	docker image prune -f

#container clean
cclean:
	docker container prune -f

#docker clean
dclean:
	docker compose down -v
	make iclean
	make cclean
	docker system prune -af

#all clean
aclean:
	rm -rf ./database/data
	make dclean

.PHONY: all iclean cclean dclean aclean are re up down

all:
	docker compose up -d

up: 
	docker compose up

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

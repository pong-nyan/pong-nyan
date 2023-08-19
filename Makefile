.PHONY: all iclean cclean dclean aclean are re

all:
	docker compose up

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

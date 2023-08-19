all:
	docker compose up

#image clean
iclean: 
	docker image prune -f

#container clean
cclean: 
	docker container prune -f

docker_clean:
	docker compose down -v
	make iclean
	make cclean
	docker system prune -af

#all clean
aclean:
	make docker_clean 
	rm -rf ./database/data
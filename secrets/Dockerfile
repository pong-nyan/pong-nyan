# ssl 인증서를 생성하는 컨테이너. 생성된 인증서는 컨테이너들이 볼륨으로 공유할 예정.

FROM alpine:3.12

RUN apk add openssl

COPY generate_ssl_cert.sh /app/generate_ssl_cert.sh

RUN chmod +x /app/generate_ssl_cert.sh

CMD ["bin/sh", "/app/generate_ssl_cert.sh"]
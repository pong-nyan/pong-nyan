# ssl 인증서를 생성하는 컨테이너. 생성된 인증서는 컨테이너들이 볼륨으로 공유할 예정.
# dos2unix는 윈도우에서 작성된 스크립트를 리눅스에서 실행할 때 crlf 문제를 해결하기 위해 사용.

FROM alpine:3.12

COPY generate_ssl_cert.sh /app/generate_ssl_cert.sh
RUN apk update && apk add openssl && chmod +x /app/generate_ssl_cert.sh && dos2unix /app/generate_ssl_cert.sh

CMD ["bin/sh", "/app/generate_ssl_cert.sh"]

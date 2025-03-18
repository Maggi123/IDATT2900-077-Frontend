FROM alpine:latest

RUN apk add --no-cache dnsmasq

COPY dnsmasq.conf /etc/dnsmasq.conf
COPY hosts /etc/hosts

ENTRYPOINT ["dnsmasq", "-k"]
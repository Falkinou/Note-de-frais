FROM python:3.12-alpine
WORKDIR /app
RUN addgroup -g 10001 stampfel && adduser -D -u 10001 -G stampfel stampfel && mkdir /data && chown stampfel:stampfel /data
COPY server/counters.py /app/counters.py
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
USER 10001:10001
EXPOSE 8090
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8090/health', timeout=2).read()"
CMD ["python", "counters.py"]

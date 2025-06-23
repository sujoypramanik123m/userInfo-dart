# Stage 1 — Build
FROM dart:stable AS build
WORKDIR /app

COPY pubspec.* ./
RUN dart pub get

COPY . .
RUN dart pub get

RUN dart compile exe bin/main.dart -o userinfo_bot

# Stage 2 — Runtime
FROM debian:bullseye-slim AS run
WORKDIR /app

RUN apt-get update \
    && apt-get install -y ca-certificates libsqlite3-0 \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/userinfo_bot .
COPY --from=build /app/database ./database

EXPOSE 8080

CMD ["./userinfo_bot"]

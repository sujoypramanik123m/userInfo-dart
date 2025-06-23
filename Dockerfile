# Stage 1 — Build
FROM dart:stable AS build

WORKDIR /app

# Cache dependencies
COPY pubspec.* ./
RUN dart pub get

# Copy source and fetch packages
COPY . .
RUN dart pub get

# Compile to native executable (adjust path if your bot entrypoint differs)
RUN dart compile exe bin/main.dart -o userinfo_bot

# Stage 2 — Runtime
FROM debian:bullseye-slim AS run

WORKDIR /app

RUN apt-get update \
    && apt-get install -y ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/userinfo_bot .

EXPOSE 8080  # Adjust if your bot listens on a different port

CMD ["./userinfo_bot"]

# Stage 1 — Build
FROM dart:stable AS build
WORKDIR /app

# Only copy pubspec to cache dependencies
COPY pubspec.* ./
RUN dart pub get

# Copy project files
COPY . .

# Compile to native executable
# Replace bin/main.dart with your actual entrypoint if different
RUN dart compile exe bin/main.dart -o userinfo_bot

# Stage 2 — Runtime (slim)
FROM debian:bullseye-slim AS run
WORKDIR /app

RUN apt-get update \
    && apt-get install -y ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/userinfo_bot .

# Expose port (no inline comment!)
EXPOSE 8080

CMD ["./userinfo_bot"]

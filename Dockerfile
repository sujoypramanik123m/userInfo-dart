# ---------- Stage 1: Build ----------
FROM dart:stable AS build
WORKDIR /app

COPY pubspec.* ./
RUN dart pub get

COPY . .
RUN dart compile exe bin/main.dart -o /app/bin/userinfo_bot

# ---------- Stage 2: Runtime ----------
FROM debian:bullseye-slim AS runtime
WORKDIR /app

# Install required runtime dependencies
RUN apt-get update && apt-get install -y \
    libsqlite3-0 \
    ca-certificates \
 && rm -rf /var/lib/apt/lists/*

# Copy the compiled bot binary
COPY --from=build /app/bin/userinfo_bot .

# If your database folder is needed at runtime
COPY --from=build /app/database ./database

# Optional: if you store assets like language files or credentials
# COPY --from=build /app/assets ./assets

# Environment variables if needed
# ENV BOT_TOKEN=your_token_here

# CMD to start the Telegram bot
CMD ["./userinfo_bot"]

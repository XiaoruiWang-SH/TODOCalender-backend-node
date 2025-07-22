#!/bin/bash
# Default to dev environment if not specified
ENV=$1;

# Check if valid environment
if [[ "$ENV" != "dev" && "$ENV" != "prod" ]]
 then
  echo "Invalid environment: $ENV"
  echo "Usage: ./run.sh [dev|prod]"
  exit 1
fi

echo "Starting application in $ENV environment..."

case "$ENV" in
  dev)
    ENV_FILE=env/.env.dev docker compose --project-name myapp_dev -f docker-compose.yml down;
    ENV_FILE=env/.env.dev docker compose --project-name myapp_dev -f docker-compose.yml up --build -d;
    ;;
  prod)
    docker compose --project-name myapp_prod -f docker-compose-prod.yml down
    docker compose --project-name myapp_prod -f docker-compose-prod.yml --env-file .env.prod up --build -d
    ;;
esac

echo "Application started successfully in $ENV environment!" 

# 查看日志命令
# docker compose -p myapp_dev logs -f app
# docker exec -it myapp_dev-mysql-1 bash 
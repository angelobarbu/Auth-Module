############################
# Network
############################
resource "docker_network" "auth" {
  name = "auth-network"
}

############################
# Postgres image & container
############################
resource "docker_image" "postgres" {
  name = "postgres:16-alpine"
}

resource "docker_container" "db" {
  name  = "auth-db"
  image = docker_image.postgres.image_id
  env = [
    "POSTGRES_PASSWORD=${var.postgres_password}",
    "POSTGRES_DB=auth"
  ]
  networks_advanced {
    name    = docker_network.auth.name
    aliases = ["postgres"]
  }
  ports {
    internal = 5432
    external = 5433
  }
  volumes {
    host_path      = abspath("${path.root}/volumes/postgres")
    container_path = "/var/lib/postgresql/data"
  }
}

############################
# Backend image & container
############################
resource "docker_image" "backend" {
  name  = "auth-backend:latest"
  build {
    context = "${path.module}/../../"   # root of repo
    dockerfile = "docker/backend/Dockerfile"
  }
}

resource "docker_container" "api" {
  name  = "auth-api"
  image = docker_image.backend.image_id
  env = [
    "PORT=5001",
    "DATABASE_URL=postgres://postgres:${var.postgres_password}@postgres:5432/auth",
    "JWT_SECRET=${var.jwt_secret}",
    "TOKEN_EXPIRATION_SECONDS=${var.token_expiration_seconds}",
    "GOOGLE_CLIENT_ID=${var.google_client_id}",
  ]
  depends_on = [docker_container.db]
  networks_advanced {
    name    = docker_network.auth.name
    aliases = ["auth-backend"]
  }
  ports {
    internal = 5001
    external = 5003
  }
}

############################
# Frontend image & container
############################
resource "docker_image" "frontend" {
  name  = "auth-frontend:latest"
  build {
    context = "${path.module}/../../"
    dockerfile = "docker/frontend/Dockerfile"
  }
}

resource "docker_container" "ui" {
  name  = "auth-ui"
  image = docker_image.frontend.image_id
  env = [
    "REACT_APP_API_BASE_URL=http://auth-backend:5001",
    "REACT_APP_GOOGLE_CLIENT_ID=${var.google_client_id}",
]
  networks_advanced {
    name = docker_network.auth.name
  }
  ports {
    internal = 80
    external = 3000
  }
}


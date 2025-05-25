variable "postgres_password" {
  type      = string
  sensitive = true
}

variable "jwt_secret" {
  type      = string
  sensitive = true
}

variable "token_expiration_seconds" {
  type    = number
  default = 3600
}
variable "google_client_id" {
  type      = string
  sensitive = true
}

data "doppler_secrets" "yaoyao" {
  project = var.doppler_project
  config  = var.doppler_config
}

locals {
  doppler_db_host     = lookup(data.doppler_secrets.yaoyao.map, "DB_HOST", var.db_host)
  doppler_db_port     = lookup(data.doppler_secrets.yaoyao.map, "DB_PORT", var.db_port)
  doppler_db_user     = lookup(data.doppler_secrets.yaoyao.map, "DB_USER", var.db_user)
  doppler_db_password = lookup(data.doppler_secrets.yaoyao.map, "DB_PASSWORD", var.db_password)
  doppler_db_name     = lookup(data.doppler_secrets.yaoyao.map, "DB_NAME", var.db_name)
  doppler_db_sslmode  = lookup(data.doppler_secrets.yaoyao.map, "DB_SSLMODE", var.db_sslmode)
  doppler_redis_url   = lookup(data.doppler_secrets.yaoyao.map, "REDIS_URL", var.redis_url)
}

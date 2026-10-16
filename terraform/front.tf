module "front_app" {
  source  = "scalingo-community/app/scalingo"
  version = "0.3.2"

  stack = "scalingo-22"

  name = var.nom_de_l_application

  containers = {
    web = {
      size   = terraform.workspace == "production" ? "XL" : "M"
      amount = terraform.workspace == "production" ? 2 : 1
      autoscaler = terraform.workspace == "production" ? {
        min_containers = 2
        max_containers = 10
        metric         = "cpu"
        target         = 0.8
      } : null
    }
  }

  github_integration = {
    repo_url = "https://github.com/DNUM-SocialGouv/1j1s-front"
    branch   = var.branche_git
    # Auto-deploy désactivé sur tous les environnements : le déclenchement
    # est désormais explicite via les workflows GitHub Actions
    # (terraform-recette.yml et mise-en-production.yml) qui appellent
    # `scalingo integration-link-manual-deploy main` après le terraform apply.
    # Cela évite le blocage silencieux quand un check ancillaire (Docusaurus,
    # Storybook) tourne au rouge : Scalingo attendait alors tous les checks
    # verts pour déclencher l'auto-deploy via webhook.
    auto_deploy_enabled = false
  }

  environment = local.envs_du_fichier_env

  addons = [
    {
      provider          = "redis"
      plan              = terraform.workspace == "production" ? "redis-business-256" : "redis-starter-256"
      database_features = ["redis-rdb"]
    }
  ]

  domain         = var.nom_de_domaine
  domain_aliases = terraform.workspace == "production" ? ["1jeune1solution.gouv.fr"] : null

  router_logs = true
  log_drains = (var.logstash_uri != null) ? [
    {
      type = "elk"
      url  = sensitive(var.logstash_uri)
    }
  ] : null
}

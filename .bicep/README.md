# Infrastructure (Bicep)

Deploys `rg-noc-prod` and a Static Web App (`swa-noc-prod`) into it. Replaces the earlier Terraform config.

- `main.bicep` — subscription-scope entry point; creates the resource group and invokes the Static Web App module.
- `modules/staticWebApp.bicep` — the `Microsoft.Web/staticSites` resource itself.
- `main.bicepparam` — default parameter values (region `centralus`, name `swa-noc-prod`, `Free` tier).

## Deploy

This deploys `rg-noc-prod` into the **Note of Composure** subscription. That subscription must already exist (create it manually via the Azure portal or your billing provider first) — a subscription-scope Bicep deployment always targets whichever subscription the deployment command is run against; there's no in-template parameter for it.

Log in and select the subscription first:

```sh
az login
az account set --subscription "Note of Composure"
```

Then deploy:

```sh
az deployment sub create \
  --subscription "Note of Composure" \
  --location centralus \
  --template-file main.bicep \
  --parameters main.bicepparam
```

## Getting the deployment token

The Static Web App's deployment token is exposed as a `@secure()` module output but is not surfaced from `main.bicep` to avoid it landing in deployment history/logs. Fetch it directly after deployment instead:

```sh
az staticwebapp secrets list \
  --subscription "Note of Composure" \
  --name swa-noc-prod \
  --resource-group rg-noc-prod \
  --query "properties.apiKey" -o tsv
```

Store the result as the `AZURE_STATIC_WEB_APPS_API_TOKEN` GitHub secret.

@description('Azure region for the Static Web App.')
param location string

@description('Name of the Azure Static Web App resource.')
param staticWebAppName string

@description('Static Web App pricing tier.')
@allowed([
  'Free'
  'Standard'
])
param skuTier string = 'Free'

resource staticWebApp 'Microsoft.Web/staticSites@2024-04-01' = {
  name: staticWebAppName
  location: location
  sku: {
    name: skuTier
    tier: skuTier
  }
  properties: {
    provider: 'None'
  }
}

output staticWebAppName string = staticWebApp.name
output defaultHostName string = staticWebApp.properties.defaultHostname

@description('Deployment token to store as the AZURE_STATIC_WEB_APPS_API_TOKEN GitHub secret.')
@secure()
output deploymentToken string = staticWebApp.listSecrets().properties.apiKey

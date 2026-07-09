targetScope = 'subscription'

@description('Azure region for the resource group and the Static Web App. Static Web Apps are only available in a subset of regions (eastus2, centralus, westus2, westeurope, eastasia).')
param location string = 'centralus'

@description('Name of the Azure Static Web App resource.')
param staticWebAppName string = 'swa-noc-prod'

@description('Static Web App pricing tier.')
@allowed([
  'Free'
  'Standard'
])
param skuTier string = 'Free'

var resourceGroupName = 'rg-noc-prod'

resource rg 'Microsoft.Resources/resourceGroups@2024-11-01' = {
  name: resourceGroupName
  location: location
}

module staticWebApp 'modules/staticWebApp.bicep' = {
  name: 'staticWebAppDeployment'
  scope: rg
  params: {
    location: location
    staticWebAppName: staticWebAppName
    skuTier: skuTier
  }
}

output resourceGroupName string = rg.name
output staticWebAppName string = staticWebApp.outputs.staticWebAppName
output defaultHostName string = staticWebApp.outputs.defaultHostName

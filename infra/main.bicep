// BI Visualization Accelerator — Azure-native serverless infrastructure.
// Deploy with: az deployment group create -g <rg> -f infra/main.bicep -p @infra/main.parameters.json
// See docs/azure-deployment.md for the full runbook.
//
// Auth note: there is no Entra ID / Easy Auth wiring here by design — identity is a
// `Users` table row looked up by email (POST /api/auth/login), trusted via plain
// request headers thereafter (see docs/architecture.md's Auth section). If you
// re-introduce real auth later, this is the file to add an authsettingsV2 resource
// (App Service Authentication) back into, pointed at an Entra ID App Registration.

@description('Short, globally-unique-ish prefix used to name every resource, e.g. pbiacc.')
param namePrefix string

@description('Azure region for all resources.')
param location string = resourceGroup().location

@description('Origin of the static website (Blob $web endpoint, or a custom domain/Front Door in front of it), used for Function App CORS. Example: https://pbiaccweb.z13.web.core.windows.net')
param staticWebsiteOrigin string

@description('Default cohort label (informational only — the Users table is populated directly, not auto-provisioned).')
param defaultCohort string = 'BI-Visualization-Accelerator'

var storageAccountName = toLower('${namePrefix}st${uniqueString(resourceGroup().id)}')
var functionAppName = '${namePrefix}-api'
var appServicePlanName = '${namePrefix}-plan'
var appInsightsName = '${namePrefix}-insights'
var logAnalyticsName = '${namePrefix}-logs'

var tableNames = [
  'Progress'
  'ProgressByDay'
  'QuizAttempts'
  'GithubSubmissions'
  'AssignmentSubmissions'
  'Evaluations'
  'Activity'
  'Notifications'
  'Users'
]

// ---------------------------------------------------------------------------
// Storage: Table Storage (trainee data) + Blob Storage (course content,
// datasets, and — once you enable it per the runbook — the $web static site).
// ---------------------------------------------------------------------------
resource storage 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: storageAccountName
  location: location
  sku: { name: 'Standard_LRS' }
  kind: 'StorageV2'
  properties: {
    minimumTlsVersion: 'TLS1_2'
    allowBlobPublicAccess: true // required for the datasets container's anonymous blob read
    supportsHttpsTrafficOnly: true
  }
}

resource tableService 'Microsoft.Storage/storageAccounts/tableServices@2023-05-01' = {
  parent: storage
  name: 'default'
}

resource tables 'Microsoft.Storage/storageAccounts/tableServices/tables@2023-05-01' = [
  for tableName in tableNames: {
    parent: tableService
    name: tableName
  }
]

resource blobService 'Microsoft.Storage/storageAccounts/blobServices@2023-05-01' = {
  parent: storage
  name: 'default'
}

resource courseContentContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-05-01' = {
  parent: blobService
  name: 'course-content'
  properties: {
    publicAccess: 'None' // only the Function App (via Managed Identity) reads/writes this
  }
}

resource datasetsContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-05-01' = {
  parent: blobService
  name: 'datasets'
  properties: {
    publicAccess: 'Blob' // freely downloadable lab CSVs/images referenced from Study Material
  }
}

// ---------------------------------------------------------------------------
// Observability
// ---------------------------------------------------------------------------
resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: logAnalyticsName
  location: location
  properties: {
    sku: { name: 'PerGB2018' }
    retentionInDays: 30
  }
}

resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: appInsightsName
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalytics.id
  }
}

// ---------------------------------------------------------------------------
// Azure Functions (Consumption plan — serverless, pay-per-execution)
// ---------------------------------------------------------------------------
resource appServicePlan 'Microsoft.Web/serverfarms@2023-12-01' = {
  name: appServicePlanName
  location: location
  sku: { name: 'Y1', tier: 'Dynamic' }
  kind: 'functionapp'
  properties: {
    reserved: true // Linux
  }
}

resource functionApp 'Microsoft.Web/sites@2023-12-01' = {
  name: functionAppName
  location: location
  kind: 'functionapp,linux'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'Node|20'
      cors: {
        allowedOrigins: [
          staticWebsiteOrigin
        ]
      }
      appSettings: [
        { name: 'FUNCTIONS_EXTENSION_VERSION', value: '~4' }
        { name: 'FUNCTIONS_WORKER_RUNTIME', value: 'node' }
        { name: 'WEBSITE_NODE_DEFAULT_VERSION', value: '~20' }
        { name: 'AzureWebJobsStorage__accountName', value: storage.name }
        { name: 'STORAGE_ACCOUNT_NAME', value: storage.name }
        { name: 'COURSE_CONTENT_CONTAINER', value: 'course-content' }
        { name: 'DATASETS_CONTAINER', value: 'datasets' }
        { name: 'DEFAULT_COHORT', value: defaultCohort }
        { name: 'APPLICATIONINSIGHTS_CONNECTION_STRING', value: appInsights.properties.ConnectionString }
      ]
    }
  }
}

// Managed Identity RBAC — the Function App reads/writes Table & Blob storage without
// ever holding an account key or connection string. This pair of role assignments is
// the only thing that would need to change (plus container.ts) if you moved the
// storage layer to a different account or resource type later.
resource storageBlobDataContributorRole 'Microsoft.Authorization/roleDefinitions@2022-04-01' existing = {
  scope: subscription()
  name: 'ba92f5b4-2d11-453d-a403-e96b0029c9fe' // Storage Blob Data Contributor
}

resource storageTableDataContributorRole 'Microsoft.Authorization/roleDefinitions@2022-04-01' existing = {
  scope: subscription()
  name: '0a9a7e1f-b9d0-4cc4-a60d-0319b160aaa3' // Storage Table Data Contributor
}

resource blobRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(storage.id, functionApp.id, 'blob-data-contributor')
  scope: storage
  properties: {
    roleDefinitionId: storageBlobDataContributorRole.id
    principalId: functionApp.identity.principalId
    principalType: 'ServicePrincipal'
  }
}

resource tableRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(storage.id, functionApp.id, 'table-data-contributor')
  scope: storage
  properties: {
    roleDefinitionId: storageTableDataContributorRole.id
    principalId: functionApp.identity.principalId
    principalType: 'ServicePrincipal'
  }
}

output functionAppName string = functionApp.name
output functionAppHostname string = functionApp.properties.defaultHostName
output storageAccountName string = storage.name

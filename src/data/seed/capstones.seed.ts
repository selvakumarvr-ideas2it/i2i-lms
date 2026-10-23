import type { Capstone } from '@/domain/course'

const COMMON_CAPSTONE_REQUIREMENT =
  'Meets the common capstone requirements: three pages, 8+ DAX measures, 3+ slicers, drill-down or drill-through, a validation sheet with 10 tests, a model diagram, a KPI dictionary, a Claude prompt log, and a 10-minute customer demo plus 5-minute Q&A.'

export const CAPSTONES: Capstone[] = [
  {
    id: 'capstone-healthcare',
    key: 'healthcare',
    title: 'Healthcare Financial & Claims Dashboard',
    customerContext:
      'Customer needs executive visibility into claims cost, revenue, members, provider performance, payer performance and regional trends.',
    dataTables: ['FactClaims', 'DimMember', 'DimProvider', 'DimDate', 'DimRegion/Payer'],
    kpis: [
      'Total Revenue',
      'Total Claims Cost',
      'Gross Margin',
      'Member Count',
      'Claim Count',
      'Claims PMPM',
      'Revenue PMPM',
      'YoY Revenue %',
      'YoY Claims Cost %',
    ],
    pages: ['Executive Overview', 'Provider Analysis', 'Claim/Provider Detail'],
    pageContent: [
      'Revenue, Claims Cost, Margin, Members; monthly trend; regional/payer performance.',
      'Provider ranking with claims, cost, revenue, margin.',
      'Drill-through to provider/member/claim detail.',
    ],
    acceptanceCriteria: [
      'All primary KPIs reconcile to supplied expected outputs.',
      'Slicers work.',
      'Drill-through works.',
      'Time comparison is validated.',
      'Eight stated business questions can be answered.',
      COMMON_CAPSTONE_REQUIREMENT,
    ],
  },
  {
    id: 'capstone-supplychain',
    key: 'supplychain',
    title: 'Supply Chain Command Center',
    customerContext:
      'Manufacturing customer needs visibility into inventory, purchase orders, suppliers, delivery performance and stock-outs.',
    dataTables: [
      'FactInventory',
      'FactPurchaseOrder (trainer may provide)',
      'FactShipment (trainer may provide)',
      'DimProduct',
      'DimSupplier',
      'DimWarehouse',
      'DimDate',
    ],
    kpis: [
      'Inventory Value',
      'Inventory Units',
      'PO Value',
      'Supplier Count',
      'On-Time Delivery %',
      'Stock-Out %',
      'Average Lead Time',
      'Open PO Value',
      'Slow Moving Inventory',
    ],
    pages: ['Supply Chain Executive', 'Supplier Analysis', 'Inventory Detail'],
    pageContent: [
      'Inventory/open PO/OTD/stock-out KPIs plus trend and warehouse performance.',
      'Supplier ranking with PO value, delivery and lead time.',
      'Product/warehouse inventory with drill-through.',
    ],
    acceptanceCriteria: [
      'Critical numbers reconcile.',
      'User can identify supplier/warehouse exceptions.',
      'Legacy report, if supplied, is improved without changing agreed KPI definitions.',
      COMMON_CAPSTONE_REQUIREMENT,
    ],
  },
  {
    id: 'capstone-sales360',
    key: 'sales360',
    title: 'Sales & Customer 360',
    customerContext:
      'B2B organization needs executive sales performance plus salesperson and customer-level analysis.',
    dataTables: [
      'FactSales',
      'FactTargets',
      'DimCustomer',
      'DimProduct',
      'DimSalesperson',
      'DimRegion',
      'DimDate',
    ],
    kpis: [
      'Revenue',
      'Target',
      'Achievement %',
      'Profit',
      'Margin %',
      'Orders',
      'Customers',
      'Average Order Value',
      'New Customers',
      'Repeat Customers',
      'YoY Growth',
    ],
    pages: ['Executive Sales', 'Salesperson Performance', 'Customer 360'],
    pageContent: [
      'Revenue/target/achievement/profit; regional/product performance.',
      'Salesperson ranking with target attainment and margin.',
      'Customer revenue, orders, products, last order and margin; drill-through.',
    ],
    acceptanceCriteria: [
      'KPIs reconcile.',
      'Target attainment is correct.',
      'Customer drill-through works.',
      'Report answers executive, manager and customer questions.',
      COMMON_CAPSTONE_REQUIREMENT,
    ],
  },
]

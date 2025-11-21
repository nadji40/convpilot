# Sector Handling in ConvPilot

## Important Note on Sector Names

Some sectors in the convertible bonds data contain **commas as part of their name**. These are **single sectors**, not multiple sectors.

### Sectors with Commas

The following sectors have commas in their names:
- **Consumer,Cyclical** → This is ONE sector
- **Consumer,Non-cyclical** → This is ONE sector

### All Available Sectors

```json
[
  "Consumer,Cyclical",
  "Consumer,Non-cyclical",
  "Industrial",
  "Communications",
  "Utilities",
  "Financial",
  "Energy",
  "Basic Materials",
  "Technology"
]
```

## Implementation Details

### 1. Data Storage
Sectors are stored as complete strings without any splitting or parsing:

```typescript
// In dataLoader.ts
sector: staticBond.issuer.sector  // "Consumer,Non-cyclical" stays as-is
```

### 2. Filtering
Sectors are compared as complete strings:

```typescript
// In dataUtils.ts - filterBonds()
if (filters.sector && filters.sector.length > 0) {
  if (!filters.sector.includes(bond.sector)) return false;
}
// This correctly matches "Consumer,Non-cyclical" as a single value
```

### 3. Aggregation
Sectors are grouped by their complete string value:

```typescript
// In dataUtils.ts - aggregateBySector()
bonds.forEach(bond => {
  const sector = bond.sector; // Keep sector as-is (do not split on comma)
  sectorMap.set(sector, (sectorMap.get(sector) || 0) + bond.outstandingAmount);
});
```

### 4. CSV Export
**Critical Fix Applied**: Sectors with commas are properly escaped in CSV export:

```typescript
// In dataUtils.ts - exportToCSV()
const escapeCSV = (value: any): string => {
  if (value === null || value === undefined) return '';
  const str = String(value);
  // If the value contains comma, quote, or newline, wrap it in quotes
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

// Usage:
escapeCSV(bond.sector)  // "Consumer,Non-cyclical" → "Consumer,Non-cyclical" (wrapped in quotes)
```

This ensures CSV files are properly formatted:
```csv
ISIN,Issuer,Sector,Country
FR001,"Acme Corp","Consumer,Non-cyclical",FRANCE
```

### 5. Display in UI
Sectors are displayed as-is in all UI components:

- **Universe Table**: Shows complete sector name
- **Filter Panels**: Shows complete sector name with count
- **Aggregation Charts**: Shows complete sector name
- **Overview Charts**: Shows complete sector name (may truncate for display)

### 6. Search and Matching
Sectors are matched exactly:

```typescript
// Exact match
bond.sector === "Consumer,Non-cyclical"  // ✓ Correct

// Incorrect approaches (NOT used):
bond.sector.split(',')  // ✗ Would incorrectly split into ["Consumer", "Non-cyclical"]
```

## Common Pitfalls to Avoid

### ❌ DON'T split sectors on commas
```typescript
// WRONG:
const sectors = bond.sector.split(',');
```

### ❌ DON'T treat "Consumer" and "Non-cyclical" as separate
```typescript
// WRONG:
if (bond.sector.includes('Consumer') || bond.sector.includes('Non-cyclical'))
```

### ❌ DON'T export to CSV without escaping
```typescript
// WRONG:
const csvRow = `${bond.isin},${bond.issuer},${bond.sector}`;
// This breaks with "Consumer,Non-cyclical"
```

### ✓ DO treat as complete strings
```typescript
// CORRECT:
const sector = bond.sector;  // "Consumer,Non-cyclical"
if (selectedSectors.includes(sector)) { ... }
```

### ✓ DO escape when exporting to CSV
```typescript
// CORRECT:
const escapedSector = escapeCSV(bond.sector);  // Wraps in quotes if contains comma
```

### ✓ DO display complete sector name
```typescript
// CORRECT:
<Text>{bond.sector}</Text>  // Shows "Consumer,Non-cyclical"
```

## Chart Display Considerations

For pie charts and other visualizations where space is limited, you may want to truncate long sector names while preserving the full name in tooltips:

```typescript
// For labels - truncate if needed
label={({ name, percent }) => `${name.split(' ')[0]} (${(percent * 100).toFixed(0)}%)`}
// "Consumer,Non-cyclical" → "Consumer,Non-cyclical" (first word includes comma)

// For tooltips - show full name
<Tooltip 
  formatter={(value, name) => [value, name]}  // Shows full "Consumer,Non-cyclical"
/>
```

## Testing

To verify correct sector handling:

```typescript
// Test 1: Load data
const bonds = loadConvertibleBonds();
const consumerNonCyclical = bonds.find(b => b.sector === "Consumer,Non-cyclical");
console.assert(consumerNonCyclical !== undefined, "Should find bonds in Consumer,Non-cyclical");

// Test 2: Aggregation
const sectorData = aggregateBySector(bonds);
const sector = sectorData.find(s => s.name === "Consumer,Non-cyclical");
console.assert(sector !== undefined, "Should aggregate Consumer,Non-cyclical as single sector");

// Test 3: Filtering
const filtered = filterBonds(bonds, { sector: ["Consumer,Non-cyclical"] });
console.assert(filtered.every(b => b.sector === "Consumer,Non-cyclical"), "Should filter correctly");

// Test 4: CSV Export
const csv = exportToCSV(bonds, 'test.csv');
// CSV should contain: "Consumer,Non-cyclical" (properly quoted)
```

## Summary

✅ **Key Takeaway**: Sectors like "Consumer,Non-cyclical" are **single, atomic values**  
✅ **Never split on commas** - the comma is part of the sector name  
✅ **Always escape** when exporting to CSV  
✅ **Treat as complete strings** in all operations  

This ensures data integrity and correct behavior across the entire application.


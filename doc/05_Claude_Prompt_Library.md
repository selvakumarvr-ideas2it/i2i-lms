# Claude Prompt Library --- Power BI Developer Accelerator

## Usage Rule

Treat AI output as draft material. Validate DAX, M, SQL and business
definitions before deployment. Never send confidential customer data to
an unapproved AI environment.

## Requirement Analyst

**Prompt**

Analyze this customer requirement. Return business questions, KPI
definitions, dimensions, filters, pages, visuals, drill paths,
assumptions and open questions. Do not invent missing business
definitions.

**Validation**

-   Confirm schema/table names.
-   Test with known expected values.
-   Test multiple filter states.
-   Review assumptions and edge cases.

## DAX Builder

**Prompt**

Create Power BI DAX measures using only the supplied table and column
names. Explain each measure, filter-context behavior, assumptions and
edge cases. Provide a SQL validation approach.

**Validation**

-   Confirm schema/table names.
-   Test with known expected values.
-   Test multiple filter states.
-   Review assumptions and edge cases.

## SQL to DAX

**Prompt**

Map this SQL business logic to Power BI DAX. Explain semantic
differences between SQL aggregation and DAX filter context and provide
validation queries.

**Validation**

-   Confirm schema/table names.
-   Test with known expected values.
-   Test multiple filter states.
-   Review assumptions and edge cases.

## SQL to Power Query

**Prompt**

Convert this SQL transformation into Power Query M. Preserve joins, null
behavior, data types and filtering. Explain each step.

**Validation**

-   Confirm schema/table names.
-   Test with known expected values.
-   Test multiple filter states.
-   Review assumptions and edge cases.

## UX Reviewer

**Prompt**

Review this report for hierarchy, visual choice, consistency,
accessibility, cognitive load and navigation. Prioritize the five
highest-value improvements.

**Validation**

-   Confirm schema/table names.
-   Test with known expected values.
-   Test multiple filter states.
-   Review assumptions and edge cases.

## Legacy Mapper

**Prompt**

Map this Cognos/MicroStrategy report's metrics, attributes, prompts,
filters and drill paths to Power BI. Flag items requiring business
clarification.

**Validation**

-   Confirm schema/table names.
-   Test with known expected values.
-   Test multiple filter states.
-   Review assumptions and edge cases.

## Test Generator

**Prompt**

Create a test matrix for this Power BI report covering filters, totals,
edge cases, time intelligence, drill-through and reconciliation to SQL.

**Validation**

-   Confirm schema/table names.
-   Test with known expected values.
-   Test multiple filter states.
-   Review assumptions and edge cases.

## DAX Debugger

**Prompt**

Explain why this DAX returns an unexpected result under the supplied
filter context. Identify the likely root cause, corrected DAX and a
validation test.

**Validation**

-   Confirm schema/table names.
-   Test with known expected values.
-   Test multiple filter states.
-   Review assumptions and edge cases.

## Prototype Planner

**Prompt**

Turn this customer requirement into a three-page Power BI prototype.
Include page purpose, KPIs, visuals, slicers, drill paths and acceptance
criteria.

**Validation**

-   Confirm schema/table names.
-   Test with known expected values.
-   Test multiple filter states.
-   Review assumptions and edge cases.

## Migration Gap Analyst

**Prompt**

Compare the legacy report definition with the proposed Power BI design.
Identify missing logic, changed definitions, risks and validation steps.

**Validation**

-   Confirm schema/table names.
-   Test with known expected values.
-   Test multiple filter states.
-   Review assumptions and edge cases.

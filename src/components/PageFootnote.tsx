/**
 * §7 Every screen closes with a page footnote stating the demo-data caveat and
 * naming the production source systems. The line between what a reviewer
 * touches (real) and what is behind the glass (demo) must never blur (§1).
 */
export function PageFootnote() {
  return (
    <div className="pagefoot">
      Illustrative demo data for FY2027 Q1, built on verified FY2026 actuals and FY2027 guidance. Every figure carries
      the system it would be read from in production — Circana, Target POL, Walmart Retail Link, SAP, Salesforce, Braze,
      customs and broker feeds, and AWS agent telemetry.
    </div>
  );
}

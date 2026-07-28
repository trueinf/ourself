/**
 * §6 CalcPanel — "How this was calculated". Dotted-divider rows of
 * label/value; final row bold and undivided. Mandatory beside every scenario
 * (§7.4): the numbers are arithmetic, hand-checkable line by line, which is
 * how the reasoning/compute contract is made visible (§2.1).
 */
export function CalcPanel({ rows }: { rows: Array<[label: string, value: string]> }) {
  return (
    <div className="calc">
      <h4>How this was calculated</h4>
      {rows.map(([label, value], i) => (
        <div className="calc-r" key={i}>
          <span>{label}</span>
          <span className="num">{value}</span>
        </div>
      ))}
    </div>
  );
}

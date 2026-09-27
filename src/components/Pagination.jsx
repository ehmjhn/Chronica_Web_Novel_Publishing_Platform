import { pageCount } from "../lib/format";

export default function Pagination({
  page,
  total,
  onChange,
  label = "Page",
  perPage = 1,
  siblings = 1,
}) {
  const pages = pageCount(total, perPage);
  if (pages <= 1) return null;

  const current = Math.min(Math.max(page, 1), pages);

  // Windowed page numbers with ellipses: 1 … 4 5 6 … 20
  const numbers = [];
  const from = Math.max(2, current - siblings);
  const to = Math.min(pages - 1, current + siblings);

  if (from > 2) numbers.push(1, "start-gap");
  for (let n = from; n <= to; n += 1) numbers.push(n);
  if (to < pages - 1) numbers.push("end-gap", pages);

  const go = (next) => {
    const clamped = Math.min(Math.max(next, 1), pages);
    if (clamped !== current) onChange(clamped);
  };

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        type="button"
        className="page-btn"
        onClick={() => go(current - 1)}
        disabled={current === 1}
      >
        <i className="fa-solid fa-angle-left" aria-hidden="true" /> Previous
      </button>

      <span className="pagination__numbers">
        {numbers.map((n, index) =>
          typeof n === "number" ? (
            <button
              key={n}
              type="button"
              className={`page-number ${n === current ? "is-active" : ""}`}
              onClick={() => go(n)}
              aria-current={n === current ? "page" : undefined}
            >
              {n}
            </button>
          ) : (
            <span key={`${n}-${index}`} className="page-gap" aria-hidden="true">
              &hellip;
            </span>
          )
        )}
      </span>

      <span className="pagination__status">
        {label} {current} of {pages}
      </span>

      <button
        type="button"
        className="page-btn"
        onClick={() => go(current + 1)}
        disabled={current === pages}
      >
        Next <i className="fa-solid fa-angle-right" aria-hidden="true" />
      </button>
    </nav>
  );
}

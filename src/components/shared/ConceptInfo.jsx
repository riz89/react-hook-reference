/**
 * ConceptInfo
 * ------------------------------------------------------------------
 * Not a hook itself — a small presentational component reused by every
 * demo in this app to show the "definition / when to use / interview Q&A"
 * block right next to the live example, so you can study and experiment
 * in the same view.
 */
function ConceptInfo({ title, definition, whenToUse, question, answer }) {
  return (
    <div className="concept-info">
      <h2>{title}</h2>
      <p className="definition">{definition}</p>
      <p>
        <strong>When to use it:</strong> {whenToUse}
      </p>
      <details className="interview-qa" open>
        <summary>Likely interview question</summary>
        <p className="qa-question">Q: {question}</p>
        <p className="qa-answer">A: {answer}</p>
      </details>
    </div>
  )
}

export default ConceptInfo

export async function generateScore(payload: any) {
  const res = await fetch('/api/generate-score', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to generate score');
  return res.json();
}

export async function generateFeedback(payload: any) {
  const res = await fetch('/api/generate-feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to generate feedback');
  return res.json();
}

export async function sendReportEmail(payload: any) {
  const res = await fetch('/api/generate-report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to send report email');
  return res.json();
}

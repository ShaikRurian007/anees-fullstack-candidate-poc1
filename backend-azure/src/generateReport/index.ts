type Ctx={log:(...a:any[])=>void;res?:{status?:number;headers?:Record<string,string>;body?:any}}; type Req={body?:any;headers?:Record<string,string|undefined>};

import { cosmos, ensureContainers } from '../shared/db';
import { scoreCandidate } from '../shared/scoring';
import { generateFeedback } from '../shared/feedback';
import { sendEmail } from '../shared/email';

export default async function (context: Ctx, req: Req): Promise<void> {
  const body = (req.body ?? {}) as any;
  const candidate = body.candidate;
  if (!candidate) {
    context.res = { status: 400, body: { error: 'candidate required' } };
    return;
  }

  const scored = scoreCandidate(candidate);
  const feedback = generateFeedback(candidate, scored);

  try {
    await ensureContainers();
    const c = cosmos();
    if (c) {
      const db = c.database(process.env.COSMOS_DB_NAME || 'candidate-eval');
      const container = db.container('reports');
      await container.items.create({
        id: `report-${candidate.id}-${Date.now()}`,
        candidateId: String(candidate.id),
        candidate,
        scored,
        feedback,
        createdAt: new Date().toISOString()
      });
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    context.log('Cosmos report write failed:', msg);
  }

  const to = candidate.email || 'test@example.com';
  const subject = `Your Skill Report, ${candidate.name}`;
  const html = `<h2>Report</h2>
    <p>Overall Score: <b>${scored.overallScore}</b></p>
    <p>Top Gaps: ${scored.gaps.join(', ')}</p>
    <pre>${feedback.codeSnippet.replace(/</g, '&lt;')}</pre>`;
  try {
    await sendEmail(to, subject, html);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    context.log('SendGrid email failed:', msg);
  }

  context.res = { status: 200, body: { ok: true, scored, feedback } };
};


type Ctx={log:(...a:any[])=>void;res?:{status?:number;headers?:Record<string,string>;body?:any}}; type Req={body?:any;headers?:Record<string,string|undefined>};

import { scoreCandidate } from '../shared/scoring';
import { Candidate } from '../shared/types';
import { cosmos, ensureContainers } from '../shared/db';

export default async function (context: Ctx, req: Req): Promise<void> {
  const origin = (req.headers && (req.headers['origin'] || req.headers['Origin'])) || '';
  const allowed = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
  const corsOk = allowed.includes(origin) || allowed.includes('*');

  const body = (req.body ?? {}) as any;
  const candidate = (body.candidate as Candidate) ?? undefined;
  if (!candidate) {
    context.res = { status: 400, body: { error: 'candidate required' }, headers: { 'Access-Control-Allow-Origin': corsOk ? origin : '' } };
    return;
  }

  const scored = scoreCandidate(candidate);

  try {
    await ensureContainers();
    const c = cosmos();
    if (c) {
      const db = c.database(process.env.COSMOS_DB_NAME || 'candidate-eval');
      const container = db.container('evaluations');
      await container.items.create({
        id: `${candidate.id}-${Date.now()}`,
        candidateId: String(candidate.id),
        candidate,
        scored,
        createdAt: new Date().toISOString()
      });
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    context.log('Cosmos write skipped/failed:', msg);
  }

  context.res = {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': corsOk ? origin : ''
    },
    body: scored
  };
};


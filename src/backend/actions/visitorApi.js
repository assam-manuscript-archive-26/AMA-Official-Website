import Api from '../apis/Api';

export async function getVisitorCount() {
  try {
    const response = await Api.get('/artifex-visitors', {
      fields: 'id,count,last_updated',
    });
    if (response.err) return { success: false, error: response.result };
    const visitor = response.result?.[0];
    return { success: true, count: visitor?.count || 0, lastUpdated: visitor?.last_updated };
  } catch (error) {
    return { success: false, error: 'Failed to fetch visitor count' };
  }
}

export async function incrementVisitorCount() {
  try {
    const current = await getVisitorCount();
    const newCount = (current.success ? current.count : 0) + 1;

    const existing = await Api.get('/artifex-visitors', { fields: 'id' });
    const existingId = existing.result?.[0]?.id;

    if (existingId) {
      await Api.put(`/artifex-visitors/${existingId}`, {
        body: { count: newCount, last_updated: new Date().toISOString() },
      });
    } else {
      await Api.post('/artifex-visitors', {
        body: { count: 1, last_updated: new Date().toISOString() },
      });
    }

    return { success: true, count: newCount };
  } catch (error) {
    return { success: false, error: 'Failed to update visitor count' };
  }
}

export async function getVisitorHistory(options = {}) {
  try {
    const { page = 1, limit = 30 } = options;
    const response = await Api.get('/artifex-visitors-history', {
      page,
      limit,
      sort: { created_at: 'desc' },
      fields: 'id,count,date,source',
    });
    if (response.err) return { success: false, error: response.result };
    return { success: true, history: response.result || [] };
  } catch (error) {
    return { success: false, error: 'Failed to fetch visitor history' };
  }
}
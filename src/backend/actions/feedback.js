import Api from '../apis/Api';

export async function getAllFeedback(options = {}) {
  try {
    const { page = 1, limit = 20, sort = {} } = options;
    const response = await Api.get('/artifex-feedback', {
      page,
      limit,
      sort,
      fields: 'id,name,email,message,rating,created_at',
    });
    if (response.err) return { success: false, error: response.result };
    return { success: true, feedbacks: response.result || [] };
  } catch (error) {
    return { success: false, error: 'Failed to fetch feedback' };
  }
}

export async function createFeedback(data) {
  try {
    const response = await Api.post('/artifex-feedback', {
      body: data,
    });
    if (response.err) return { success: false, error: response.result };
    return { success: true, feedback: response.result };
  } catch (error) {
    return { success: false, error: 'Failed to submit feedback' };
  }
}

export async function deleteFeedback(id) {
  try {
    const response = await Api.delete(`/artifex-feedback/${id}`);
    if (response.err) return { success: false, error: response.result };
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete feedback' };
  }
}

export async function getFeedbackStats() {
  try {
    const response = await Api.get('/artifex-feedback', {
      fields: 'id,rating',
    });
    if (response.err) return { success: false, error: response.result };
    const feedbacks = response.result || [];
    const total = feedbacks.length;
    const avgRating = total > 0
      ? feedbacks.reduce((sum, f) => sum + (Number(f.rating) || 0), 0) / total
      : 0;
    return { success: true, total, averageRating: avgRating.toFixed(1) };
  } catch (error) {
    return { success: false, error: 'Failed to fetch stats' };
  }
}
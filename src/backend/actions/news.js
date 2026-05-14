import Api from '../apis/Api';

export async function getAllNews(options = {}) {
  try {
    const { page = 1, limit = 20 } = options;
    const response = await Api.get('/artifex-news', {
      page,
      limit,
      sort: { published_at: 'desc' },
      fields: 'id,title,content,excerpt,image,published_at,author',
    });
    if (response.err) return { success: false, error: response.result };
    return { success: true, news: response.result || [] };
  } catch (error) {
    return { success: false, error: 'Failed to fetch news' };
  }
}

export async function getNewsById(id) {
  try {
    const response = await Api.get(`/artifex-news/${id}`, {
      fields: 'id,title,content,image,published_at,author,tags',
    });
    if (response.err) return { success: false, error: response.result };
    return { success: true, news: response.result };
  } catch (error) {
    return { success: false, error: 'Failed to fetch news' };
  }
}

export async function createNews(data) {
  try {
    const response = await Api.post('/artifex-news', { body: data });
    if (response.err) return { success: false, error: response.result };
    return { success: true, news: response.result };
  } catch (error) {
    return { success: false, error: 'Failed to create news' };
  }
}

export async function updateNews(id, data) {
  try {
    const response = await Api.put(`/artifex-news/${id}`, { body: data });
    if (response.err) return { success: false, error: response.result };
    return { success: true, news: response.result };
  } catch (error) {
    return { success: false, error: 'Failed to update news' };
  }
}

export async function deleteNews(id) {
  try {
    const response = await Api.delete(`/artifex-news/${id}`);
    if (response.err) return { success: false, error: response.result };
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete news' };
  }
}

export async function getLatestNews(limit = 3) {
  try {
    const response = await Api.get('/artifex-news', {
      page: 1,
      limit,
      sort: { published_at: 'desc' },
      fields: 'id,title,excerpt,image,published_at',
    });
    if (response.err) return { success: false, error: response.result };
    return { success: true, news: response.result || [] };
  } catch (error) {
    return { success: false, error: 'Failed to fetch latest news' };
  }
}
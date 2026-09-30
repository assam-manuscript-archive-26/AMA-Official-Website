import Api from '../apis/Api';

export async function getAllGalleryItems(options = {}) {
  try {
    const response = await Api.get('/ama-gallery', {
      fields: 'id,title,category,imageUrl,accent,description,created_at,updated_at',
      sort: '-created_at',
      page: '1,1000',
    });
    if (response.err) return { success: false, error: response.result };
    return { success: true, items: response.result || [] };
  } catch (error) {
    return { success: false, error: 'Failed to fetch gallery items' };
  }
}

export async function getGalleryItemById(id) {
  try {
    const response = await Api.get(`/ama-gallery/${id}`, {
      fields: 'id,title,category,imageUrl,accent,description,created_at,updated_at',
    });
    if (response.err) return { success: false, error: response.result };
    const item = response.result?.[0] || response.result || null;
    return { success: true, item };
  } catch (error) {
    return { success: false, error: 'Failed to fetch gallery item' };
  }
}

export async function createGalleryItem(data) {
  try {
    const response = await Api.post('/ama-gallery', {
      body: data,
    });
    if (response.err) return { success: false, error: response.result };
    return { success: true, item: response.result };
  } catch (error) {
    return { success: false, error: 'Failed to create gallery item' };
  }
}

export async function updateGalleryItem(id, data) {
  try {
    const response = await Api.put(`/ama-gallery/${id}`, {
      body: data,
    });
    if (response.err) return { success: false, error: response.result };
    return { success: true, item: response.result };
  } catch (error) {
    return { success: false, error: 'Failed to update gallery item' };
  }
}

export async function deleteGalleryItem(id) {
  try {
    const response = await Api.delete(`/ama-gallery/${id}`);
    if (response.err) return { success: false, error: response.result };
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete gallery item' };
  }
}

export async function searchGalleryItems(query) {
  try {
    const response = await Api.get('/ama-gallery', {
      search: { title: query, category: query, accent: query },
      fields: 'id,title,category,imageUrl,accent,description',
    });
    if (response.err) return { success: false, error: response.result };
    return { success: true, items: response.result || [] };
  } catch (error) {
    return { success: false, error: 'Failed to search gallery items' };
  }
}

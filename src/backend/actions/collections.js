import Api from '../apis/Api';

export async function getAllCollections(options = {}) {
  try {
    const { page = 1, limit = 20, sort = {} } = options;
    const response = await Api.get('/artifex-collections', {
      page,
      limit,
      sort,
      fields: 'id,name,description,thumbnail,artifacts_count,created_at',
    });
    if (response.err) return { success: false, error: response.result };
    return { success: true, collections: response.result || [] };
  } catch (error) {
    return { success: false, error: 'Failed to fetch collections' };
  }
}

export async function getCollectionById(id) {
  try {
    const response = await Api.get(`/artifex-collections/${id}`, {
      fields: 'id,name,description,thumbnail,artifacts_count,created_at',
    });
    if (response.err) return { success: false, error: response.result };
    return { success: true, collection: response.result };
  } catch (error) {
    return { success: false, error: 'Failed to fetch collection' };
  }
}

export async function createCollection(data) {
  try {
    const response = await Api.post('/artifex-collections', {
      body: data,
    });
    if (response.err) return { success: false, error: response.result };
    return { success: true, collection: response.result };
  } catch (error) {
    return { success: false, error: 'Failed to create collection' };
  }
}

export async function updateCollection(id, data) {
  try {
    const response = await Api.put(`/artifex-collections/${id}`, {
      body: data,
    });
    if (response.err) return { success: false, error: response.result };
    return { success: true, collection: response.result };
  } catch (error) {
    return { success: false, error: 'Failed to update collection' };
  }
}

export async function deleteCollection(id) {
  try {
    const response = await Api.delete(`/artifex-collections/${id}`);
    if (response.err) return { success: false, error: response.result };
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete collection' };
  }
}

export async function searchCollections(query) {
  try {
    const response = await Api.get('/artifex-collections', {
      search: { name: query, description: query },
      fields: 'id,name,description,thumbnail,artifacts_count',
    });
    if (response.err) return { success: false, error: response.result };
    return { success: true, collections: response.result || [] };
  } catch (error) {
    return { success: false, error: 'Failed to search collections' };
  }
}
import Api from '../apis/Api';

export async function getAllResources() {
  try {
    const response = await Api.get('/ama-resources', {
      fields: 'id,title,author,source,year,url,category',
      sort: 'category,title',
      page: '1,1000',
    });
    if (response.err) return { success: false, error: response.result };
    return { success: true, resources: response.result || [] };
  } catch (error) {
    return { success: false, error: 'Failed to fetch resources' };
  }
}

export async function getResourcesByCategory(category) {
  try {
    const response = await Api.get('/ama-resources', {
      fields: 'id,title,author,source,year,url,category',
      filter: { category },
      sort: 'title',
      page: '1,1000',
    });
    if (response.err) return { success: false, error: response.result };
    return { success: true, resources: response.result || [] };
  } catch (error) {
    return { success: false, error: 'Failed to fetch resources' };
  }
}

export async function getResourceById(id) {
  try {
    const response = await Api.get(`/ama-resources/${id}`, {
      fields: 'id,title,author,source,year,url,category',
    });
    if (response.err) return { success: false, error: response.result };
    return { success: true, resource: response.result };
  } catch (error) {
    return { success: false, error: 'Failed to fetch resource' };
  }
}

export async function createResource(data) {
  try {
    const response = await Api.post('/ama-resources', { body: data });
    if (response.err) return { success: false, error: response.result };
    return { success: true, resource: response.result };
  } catch (error) {
    return { success: false, error: 'Failed to create resource' };
  }
}

export async function updateResource(id, data) {
  try {
    const response = await Api.put(`/ama-resources/${id}`, { body: data });
    if (response.err) return { success: false, error: response.result };
    return { success: true, resource: response.result };
  } catch (error) {
    return { success: false, error: 'Failed to update resource' };
  }
}

export async function deleteResource(id) {
  try {
    const response = await Api.delete(`/ama-resources/${id}`);
    if (response.err) return { success: false, error: response.result };
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete resource' };
  }
}

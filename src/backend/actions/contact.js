import Api from '../apis/Api';

export async function getAllContactSubmissions(options = {}) {
  try {
    const { page = 1, limit = 20 } = options;
    const response = await Api.get('/artifex-contactUs', {
      page,
      limit,
      sort: { created_at: 'desc' },
      fields: 'id,name,email,subject,message,created_at,status',
    });
    if (response.err) return { success: false, error: response.result };
    return { success: true, contacts: response.result || [] };
  } catch (error) {
    return { success: false, error: 'Failed to fetch contact submissions' };
  }
}

export async function createContactSubmission(data) {
  try {
    const response = await Api.post('/artifex-contactUs', { body: data });
    if (response.err) return { success: false, error: response.result };
    return { success: true, contact: response.result };
  } catch (error) {
    return { success: false, error: 'Failed to submit contact form' };
  }
}

export async function updateContactStatus(id, status) {
  try {
    const response = await Api.put(`/artifex-contactUs/${id}`, { body: { status } });
    if (response.err) return { success: false, error: response.result };
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to update status' };
  }
}

export async function deleteContactSubmission(id) {
  try {
    const response = await Api.delete(`/artifex-contactUs/${id}`);
    if (response.err) return { success: false, error: response.result };
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete submission' };
  }
}
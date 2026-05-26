import Api from '../apis/Api';

export async function getAllContactSubmissions(options = {}) {
  try {
    const { page = 1, limit = 1000 } = options;
    const response = await Api.get('/ama-contact', {
      page,
      limit,
      sort: { created_at: 'desc' },
      fields: 'id,fullName,email,phone,message,created_at,status,starred',
    });
    if (response.err) return { success: false, error: response.result };
    return { success: true, contacts: response.result || [] };
  } catch (error) {
    return { success: false, error: 'Failed to fetch contact submissions' };
  }
}

export async function createContactSubmission(data) {
  try {
    const response = await Api.post('/ama-contact', { body: data });
    if (response.err) return { success: false, error: response.result };
    return { success: true, contact: response.result };
  } catch (error) {
    return { success: false, error: 'Failed to submit contact form' };
  }
}

export async function updateContactSubmission(id, updates) {
  try {
    const response = await Api.put(`/ama-contact/${id}`, { body: updates });
    if (response.err) return { success: false, error: response.result };
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to update contact submission' };
  }
}

export async function updateContactStatus(id, status) {
  return updateContactSubmission(id, { status });
}

export async function sendReplyEmail(data) {
  try {
    const response = await Api.post('/send-email', { body: data });
    if (response.err) return { success: false, error: response.result };
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to send reply email' };
  }
}

export async function deleteContactSubmission(id) {
  try {
    const response = await Api.delete(`/ama-contact/${id}`);
    if (response.err) return { success: false, error: response.result };
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete submission' };
  }
}
import Api from '../apis/Api';

export async function getAllQuestionnaireResponses(options = {}) {
  try {
    const { page = 1, limit = 20 } = options;
    const response = await Api.get('/artifex-questionnaire', {
      page,
      limit,
      fields: 'id,name,email,visit_date,enjoyed_most,suggestions,created_at',
    });
    if (response.err) return { success: false, error: response.result };
    return { success: true, responses: response.result || [] };
  } catch (error) {
    return { success: false, error: 'Failed to fetch questionnaire responses' };
  }
}

export async function createQuestionnaireResponse(data) {
  try {
    const response = await Api.post('/artifex-questionnaire', {
      body: data,
    });
    if (response.err) return { success: false, error: response.result };
    return { success: true, response: response.result };
  } catch (error) {
    return { success: false, error: 'Failed to submit questionnaire' };
  }
}

export async function generateCertificate(name, visitDate) {
  return {
    success: true,
    certificate: {
      name,
      visitDate,
      issuedAt: new Date().toISOString(),
      certificateId: `SS-${Date.now()}`,
    },
  };
}
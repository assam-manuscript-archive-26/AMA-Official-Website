import Api from '../apis/Api';

export async function getAllArtifacts(options = {}) {
  try {
    const response = await Api.get('/ama-collections', {
      fields: 'id,name,category,keywords,imageUrl,english_audio_url,hindi_audio_url,assamese_audio_url,english_description,hindi_description,assamese_description,has_audio,audio_guide_id,created_at,updated_at',
      sort: '-created_at',
      page: '1,1000',
    });
    if (response.err) return { success: false, error: response.result };
    return { success: true, artifacts: response.result || [] };
  } catch (error) {
    return { success: false, error: 'Failed to fetch artifacts' };
  }
}

export async function getArtifactById(id) {
  try {
    const response = await Api.get(`/ama-collections/${id}`, {
      fields: 'id,name,category,keywords,imageUrl,english_audio_url,hindi_audio_url,assamese_audio_url,english_description,hindi_description,assamese_description,has_audio,audio_guide_id,created_at,updated_at',
    });
    if (response.err) return { success: false, error: response.result };
    // FrontQL returns result as an array even for single-item lookups
    const artifact = response.result?.[0] || response.result || null;
    return { success: true, artifact };
  } catch (error) {
    return { success: false, error: 'Failed to fetch artifact' };
  }
}

export async function getArtifactsByCollection(collectionId, options = {}) {
  try {
    const { page = 1, limit = 20 } = options;
    const response = await Api.get('/ama-collections', {
      page,
      limit,
      filter: { collection_id: collectionId },
      fields: 'id,title,description,image,year,artist',
    });
    if (response.err) return { success: false, error: response.result };
    return { success: true, artifacts: response.result || [] };
  } catch (error) {
    return { success: false, error: 'Failed to fetch artifacts' };
  }
}

export async function createArtifact(data) {
  try {
    const response = await Api.post('/ama-collections', {
      body: data,
    });
    if (response.err) return { success: false, error: response.result };
    return { success: true, artifact: response.result };
  } catch (error) {
    return { success: false, error: 'Failed to create artifact' };
  }
}

export async function updateArtifact(id, data) {
  try {
    const response = await Api.put(`/ama-collections/${id}`, {
      body: data,
    });
    if (response.err) return { success: false, error: response.result };
    return { success: true, artifact: response.result };
  } catch (error) {
    return { success: false, error: 'Failed to update artifact' };
  }
}

export async function deleteArtifact(id) {
  try {
    const response = await Api.delete(`/ama-collections/${id}`);
    if (response.err) return { success: false, error: response.result };
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete artifact' };
  }
}

export async function searchArtifacts(query, options = {}) {
  try {
    const { filter = {} } = options;
    const response = await Api.get('/ama-collections', {
      search: { title: query, description: query, artist: query },
      filter,
      fields: 'id,title,description,image,year,artist,collection_id',
    });
    if (response.err) return { success: false, error: response.result };
    return { success: true, artifacts: response.result || [] };
  } catch (error) {
    return { success: false, error: 'Failed to search artifacts' };
  }
}
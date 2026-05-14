import Api from '../apis/Api';

export async function getAllAudioPlayers(options = {}) {
  try {
    const { page = 1, limit = 20 } = options;
    const response = await Api.get('/artifex-audio-player', {
      page,
      limit,
      fields: 'id,artifact_id,audio_english,audio_hindi,audio_assamese,duration',
    });
    if (response.err) return { success: false, error: response.result };
    return { success: true, players: response.result || [] };
  } catch (error) {
    return { success: false, error: 'Failed to fetch audio players' };
  }
}

export async function getAudioPlayerByArtifactId(artifactId) {
  try {
    const response = await Api.get('/artifex-audio-player', {
      filter: { artifact_id: artifactId },
      fields: 'id,artifact_id,audio_english,audio_hindi,audio_assamese,duration',
    });
    if (response.err) return { success: false, error: response.result };
    return { success: true, player: response.result?.[0] };
  } catch (error) {
    return { success: false, error: 'Failed to fetch audio player' };
  }
}

export async function createAudioPlayer(data) {
  try {
    const response = await Api.post('/artifex-audio-player', {
      body: data,
    });
    if (response.err) return { success: false, error: response.result };
    return { success: true, player: response.result };
  } catch (error) {
    return { success: false, error: 'Failed to create audio player' };
  }
}

export async function updateAudioPlayer(id, data) {
  try {
    const response = await Api.put(`/artifex-audio-player/${id}`, {
      body: data,
    });
    if (response.err) return { success: false, error: response.result };
    return { success: true, player: response.result };
  } catch (error) {
    return { success: false, error: 'Failed to update audio player' };
  }
}

export async function deleteAudioPlayer(id) {
  try {
    const response = await Api.delete(`/artifex-audio-player/${id}`);
    if (response.err) return { success: false, error: response.result };
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete audio player' };
  }
}
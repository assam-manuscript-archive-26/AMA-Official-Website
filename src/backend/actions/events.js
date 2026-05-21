import Api from '../apis/Api';

export async function getAllEvents() {
  try {
    const response = await Api.get('/ama-events', {
      fields: 'id,title,description,date,time,location,category,featured',
      sort: '-date',
      page: '1,1000',
    });
    if (response.err) return { success: false, error: response.result };
    return { success: true, events: response.result || [] };
  } catch (error) {
    return { success: false, error: 'Failed to fetch events' };
  }
}

export async function getEventById(id) {
  try {
    const response = await Api.get(`/ama-events/${id}`, {
      fields: 'id,title,description,date,location,image,organizer,contact',
    });
    if (response.err) return { success: false, error: response.result };
    return { success: true, event: response.result };
  } catch (error) {
    return { success: false, error: 'Failed to fetch event' };
  }
}

export async function createEvent(data) {
  try {
    const response = await Api.post('/ama-events', { body: data });
    if (response.err) return { success: false, error: response.result };
    return { success: true, event: response.result };
  } catch (error) {
    return { success: false, error: 'Failed to create event' };
  }
}

export async function updateEvent(id, data) {
  try {
    const response = await Api.put(`/ama-events/${id}`, { body: data });
    if (response.err) return { success: false, error: response.result };
    return { success: true, event: response.result };
  } catch (error) {
    return { success: false, error: 'Failed to update event' };
  }
}

export async function deleteEvent(id) {
  try {
    const response = await Api.delete(`/ama-events/${id}`);
    if (response.err) return { success: false, error: response.result };
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete event' };
  }
}
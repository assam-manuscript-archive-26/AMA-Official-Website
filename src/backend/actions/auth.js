import Api from '../apis/Api';

const SESSION_KEY = 'samaguri_admin_session';
const USER_KEY = 'samaguri_admin_user';

function getCurrentDateTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export async function login(email, password) {
  try {
    const response = await Api.post('/auth-artifex-users', {
      body: { email, password },
      fields: 'id,email',
    });

    if (response.err) {
      return { success: false, error: response.result || 'Invalid credentials' };
    }

    if (response.result && response.result.is_active === false) {
      return { success: false, error: 'Admin access revoked' };
    }

    if (response.session) {
      localStorage.setItem(SESSION_KEY, response.session);
      localStorage.setItem(USER_KEY, JSON.stringify(response.result));
      document.cookie = `${SESSION_KEY}=${encodeURIComponent(response.session)}; path=/`;

      try {
        await Api.put(`/admins/${response.result.id}`, {
          body: { last_login: getCurrentDateTime() },
        });
      } catch (e) {
        console.warn('Failed to update last_login:', e);
      }

      return { success: true, user: response.result };
    }

    return { success: false, error: 'Authentication failed' };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
}

export function logout() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(USER_KEY);
  document.cookie = `${SESSION_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  window.location.href = '/admin/login';
}

export function getSession() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(SESSION_KEY);
}

export function getCurrentUser() {
  if (typeof window === 'undefined') return null;
  const userData = localStorage.getItem(USER_KEY);
  if (!userData) return null;
  try {
    return JSON.parse(userData);
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  if (typeof window === 'undefined') return false;
  const session = getSession();
  if (!session) return false;
  try {
    const payload = JSON.parse(atob(session.split('.')[1]));
    const exp = payload.exp;
    if (exp && Date.now() >= exp * 1000) {
      logout();
      return false;
    }
  } catch {}
  return true;
}

export async function getAllAdmins() {
  try {
    const response = await Api.get('/auth-artifex-users', {
      fields: 'id,username,name,is_active,last_login',
    });
    if (response.err) return { success: false, error: response.result };
    return { success: true, admins: response.result || [] };
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
}
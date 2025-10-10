interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const AUTH_STORAGE_KEY = 'snuggles_auth';

class AuthStore {
  private state: AuthState = {
    user: null,
    isAuthenticated: false,
  };

  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      try {
        this.state = JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse stored auth state');
      }
    }
  }

  private saveToStorage() {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(this.state));
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getState(): AuthState {
    return { ...this.state };
  }

  register(name: string, email: string, password: string): boolean {
    // Mock registration - in real app, would validate and hash password
    const user: User = {
      id: Math.random().toString(36).substring(7),
      name,
      email,
    };

    this.state = {
      user,
      isAuthenticated: true,
    };

    this.saveToStorage();
    return true;
  }

  login(email: string, password: string): boolean {
    // Mock login - in real app, would verify credentials
    const user: User = {
      id: Math.random().toString(36).substring(7),
      name: email.split('@')[0],
      email,
    };

    this.state = {
      user,
      isAuthenticated: true,
    };

    this.saveToStorage();
    return true;
  }

  logout() {
    this.state = {
      user: null,
      isAuthenticated: false,
    };

    this.saveToStorage();
  }
}

export const authStore = new AuthStore();

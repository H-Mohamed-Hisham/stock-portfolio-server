import { AsyncLocalStorage } from 'async_hooks';

export interface User {
  id: string;
  name: string;
  email: string;
  created_at: Date;
}

export const UserStorage = {
  storage: new AsyncLocalStorage<User>(),
  get() {
    return this.storage.getStore();
  },
  set(user: User) {
    return this.storage.enterWith(user);
  },
};

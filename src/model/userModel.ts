interface UserItem {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  provider: string;
  providerId: string;
}

export default class User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  provider: string;
  providerId: string;
  constructor({
    id,
    name,
    email,
    password,
    role,
    provider,
    providerId,
  }: UserItem) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
    this.provider = provider;
    this.providerId = providerId;
  }
    
  static from(userItem: UserItem): User {
    return new User(userItem);
  }
    
}




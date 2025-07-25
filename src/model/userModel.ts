import { insertUser, queryEmail } from "../data/db";
import { dbName, userTable, calendarTable } from "../app";

export interface UserItem {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  provider: string | null;
  providerId: string | null;
}

export default class User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  provider: string | null;
  providerId: string | null;
  constructor({
    id = 0,
    name,
    email,
    password,
    role = "user",
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

  toPlain() {
    return {
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role,
      provider: this.provider,
      providerId: this.providerId,
    };
  }

  toInfo() {
    return {
      name: this.name,
      email: this.email,
      role: this.role,
    };
  }

  async checkIfExist() {
    try {
      const rows = await queryEmail(this.email, dbName, userTable);
      return rows.length > 0;
    } catch (error) {
      return true;
    }
  }

  static async queryUser(email: string): Promise<UserItem[]> {
    try {
      const rows = await queryEmail(email, dbName, userTable);
      return rows;
    } catch (error) {
      return [];
    }
  }

  async register() {
    try {
      const result = await insertUser(this, dbName, userTable);
      return result.insertId;
    } catch (error) {
      return -1;
    }
  }
}

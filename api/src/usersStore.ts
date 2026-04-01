import db from './db';

type UserRow = {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  created_at: string | number;
};

export type User = {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  createdAt: number;
};

function rowToUser(row: UserRow): User {
  return {
    id: row.id,
    email: row.email,
    passwordHash: row.password_hash,
    firstName: row.first_name,
    lastName: row.last_name,
    createdAt: Number(row.created_at),
  };
}

export async function createUser(
  email: string,
  passwordHash: string,
  firstName: string,
  lastName: string,
): Promise<User> {
  const [row] = await db<UserRow>('users')
    .insert({
      id: crypto.randomUUID(),
      email,
      password_hash: passwordHash,
      first_name: firstName,
      last_name: lastName,
      created_at: Date.now(),
    })
    .returning('*');
  return rowToUser(row);
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const row = await db<UserRow>('users').where({ email }).first();
  return row ? rowToUser(row) : null;
}

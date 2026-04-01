export type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export async function register(payload: RegisterPayload): Promise<{ token: string }> {
  const res = await fetch('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message ?? 'Registration failed.');
  }
  return data;
}

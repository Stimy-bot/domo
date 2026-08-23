// libs/services/src/lib/googleAuthService.ts
import axios from 'axios';

export interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  token_type: string;
  id_token?: string;
}

export interface GoogleUser {
  sub: string;
  name: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  email: string;
  email_verified: boolean;
  locale?: string;
  birthdate?: string;
}

export const exchangeCodeForToken = async (
  code: string,
): Promise<GoogleTokenResponse> => {
  const client_id = process.env['GOOGLE_CLIENT_ID'];
  const client_secret = process.env['GOOGLE_CLIENT_SECRET'];
  const redirect_uri = process.env['GOOGLE_OAUTH_REDIRECT_URL'];

  if (!client_id || !client_secret || !redirect_uri) {
    throw new Error('Missing Google OAuth environment variables in backend.');
  }

  const values = {
    code,
    client_id,
    client_secret,
    redirect_uri,
    grant_type: 'authorization_code',
  };

  try {
    const response = await axios.post<GoogleTokenResponse>(
      'https://oauth2.googleapis.com/token',
      new URLSearchParams(values),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        'Google Token Exchange Error:',
        error.response?.data || error.message,
      );
    } else {
      console.error('Google Token Exchange Error:', error);
    }
    throw error;
  }
};

export const getGoogleUser = async (
  access_token: string,
): Promise<GoogleUser> => {
  try {
    const response = await axios.get<GoogleUser>(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: { Authorization: `Bearer ${access_token}` },
      },
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        'Google User Info Error:',
        error.response?.data || error.message,
      );
    }
    throw error;
  }
};
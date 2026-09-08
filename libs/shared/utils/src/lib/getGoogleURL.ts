// libs/shared/utils/src/lib/getGoogleURL.ts
function getGoogleOAuthURL() {
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  
  const redirect_uri = process.env.VITE_GOOGLE_OAUTH_REDIRECT_URL;
  const client_id = process.env.VITE_GOOGLE_CLIENT_ID;

  // Safety Check
  if (!redirect_uri || !client_id) {
    console.error("❌ Google OAuth Error: Missing Environment Variables!", {
      redirect_uri,
      client_id
    });
    return "#error-missing-env"; 
  }

  const options = {
    redirect_uri: redirect_uri as string,
    client_id: client_id as string,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' '),
  };

  const qs = new URLSearchParams(options);
  return `${rootUrl}?${qs.toString()}`;
}

export { getGoogleOAuthURL };
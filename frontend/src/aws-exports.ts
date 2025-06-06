export default {
  Auth: {
    Cognito: {
      userPoolId:
        import.meta.env.VITE_COGNITO_USER_POOL_ID ?? 'us-east-1_QyefTyRMH',
      userPoolClientId:
        import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID ??
        '5lbbjfe6raii0h2h7jbd2t5ju8',
      loginWith: {
        oauth: {
          domain:
            import.meta.env.VITE_COGNITO_USER_POOL_DOMAIN ??
            'dev-app-auth-iwkiic.auth.us-east-1.amazoncognito.com',
          scopes: ['openid'],
          redirectSignIn: [
            import.meta.env.VITE_COGNITO_REDIRECT_SIGN_IN ??
              'http://localhost:3000/',
          ],
          redirectSignOut: [
            import.meta.env.VITE_COGNITO_REDIRECT_SIGN_OUT ??
              'http://localhost:3000/',
          ],
          responseType: 'code',
        },
      },
    },
  },
};

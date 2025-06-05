export default {
  Auth: {
    Cognito: {
      userPoolId:
        import.meta.env.VITE_COGNITO_USER_POOL_ID ?? 'us-east-1_2r1RKBUmX',
      userPoolClientId:
        import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID ??
        '21i69m0prtoenufpeph5a12rp5',
      loginWith: {
        oauth: {
          domain:
            import.meta.env.VITE_COGNITO_USER_POOL_DOMAIN ??
            'dev-app-auth-fqx8xh.auth.us-east-1.amazoncognito.com',
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

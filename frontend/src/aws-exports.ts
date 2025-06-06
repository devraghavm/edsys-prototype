export default {
  Auth: {
    Cognito: {
      userPoolId:
        import.meta.env.VITE_COGNITO_USER_POOL_ID ?? 'us-east-1_Atcu9KiJe',
      userPoolClientId:
        import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID ??
        '2jo2lj7ejvgbgm6na8sa1bmaqg',
      loginWith: {
        oauth: {
          domain:
            import.meta.env.VITE_COGNITO_USER_POOL_DOMAIN ??
            'dev-app-auth-2cc7q5.auth.us-east-1.amazoncognito.com',
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

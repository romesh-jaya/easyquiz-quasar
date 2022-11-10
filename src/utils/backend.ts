export const getBackendURL = () => {
  const url =
    process.env.ENV === 'staging'
      ? process.env.BACKEND_URL_STAGING
      : process.env.BACKEND_URL;
  if (!url) {
    throw new Error('Env variable BACKEND_URL cannot be empty');
  }
  return url;
};

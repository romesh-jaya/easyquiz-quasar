export const getBackendURL = () => {
  const url = process.env.BACKEND_URL;
  if (!url) {
    throw new Error('Env variable BACKEND_URL cannot be empty');
  }
  return url;
};

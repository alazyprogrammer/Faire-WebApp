export const getCurrentBaseUrl = (newPort) => {
    // Get the current URL
  const currentUrl = window.location.href;

  // Parse the current URL
  const url = new URL(currentUrl);

  // Update the port
  url.port = newPort;

  // Return the new base URL
  return url.origin;
};
  
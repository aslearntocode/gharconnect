async function logout() {
  // Clear all authentication tokens/cookies
  localStorage.removeItem('authToken');
  sessionStorage.clear();
  
  // If using cookies, also clear them
  document.cookie.split(";").forEach(function(c) { 
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });

  // Additional cleanup if needed
  await auth.signOut(); // If using a third-party auth service
  
  // Get current path to determine society
  const path = window.location.pathname;
  const society = path.startsWith('/ag-sewri') ? 'ag-sewri' : 'parel';
  
  // Redirect to login page
  window.location.href = `/${society}/login`;
} 
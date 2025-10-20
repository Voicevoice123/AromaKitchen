// ===============================
// 🌐 Google Sign-In Handler
// ===============================
function handleGoogleSignIn(response) {
  // Decode JWT to get user info
  const data = parseJwt(response.credential);

  // Extract user details
  const user = {
    username: data.name,
    email: data.email,
    picture: data.picture,
    provider: "google",
  };

  // Save to localStorage
  localStorage.setItem("aroma_auth", JSON.stringify(user));

  alert(`Welcome, ${user.username}!`);
  window.location.href = "index.html"; // redirect to home page
}

// Helper to decode JWT token
function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("JWT parse error", e);
    return {};
  }
}

export async function doLogout() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    const result = await res.json();
    if (res.status == 200) {
      return { status: true, message: "User logged out" };
    } else {
      return { status: false, message: "User failed to logged out" };
    }
  } catch (error) {
    return { status: false, message: "User failed to logged out" };
  }
}

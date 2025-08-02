export default async function doLogin({
  data,
}: {
  data: {
    email: string;
    password: string;
  };
}) {
  try {
    const result: Response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Client-Type": "web",
      },
      credentials: "include",
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    });
    const results = await result.json();

    if (result.status === 200) {
      return { status: true, data: results };
    } else {
      return { status: false, data: results };
    }
  } catch (error) {
    console.error(error);
    return {
      status: false,
      data: { message: "Network error or server unavailable." },
    };
  }
}

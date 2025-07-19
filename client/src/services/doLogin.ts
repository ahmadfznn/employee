export default async function doLogin({
  data,
}: {
  data: {
    email: String;
    password: String;
    passwordConfirm: String;
  };
}) {
  try {
    console.log(data);
    const result: Response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          // password_confirm: data.password,
        }),
      }
    );

    const results = await result.json();
    console.log(results);
    if (result.status == 200) {
      return { status: true, data: results };
    } else {
      return { status: false, data: results };
    }
  } catch (error) {
    console.log(error);
    return { status: false, data: error };
  }
}
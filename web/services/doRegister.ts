export default async function doRegister({
  data,
}: {
  data: {
    firstName: String;
    lastName: String;
    email: String;
    tel: String;
    password: String;
    passwordConfirm: String;
  };
}) {
  try {
    console.log(data);
    const result: Response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          tel: data.tel,
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

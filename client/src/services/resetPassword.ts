interface ResetPasswordResponse {
  status: boolean;
  data: any;
  message: string;
}

export default async function resetPassword({
  email,
}: {
  email: string;
}): Promise<ResetPasswordResponse> {
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return {
      status: false,
      data: null,
      message: "Please provide a valid email address.",
    };
  }

  try {
    const result: Response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );
    const results = await result.json();
    if (result.ok) {
      return { status: true, data: results, message: results.message };
    } else {
      return { status: false, data: results, message: results.message };
    }
  } catch (error) {
    return {
      status: false,
      data: error,
      message: "Something went wrong",
    };
  }
}

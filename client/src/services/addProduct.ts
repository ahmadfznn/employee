export default async function addProduct({
  data,
}: {
  data: {
    productPicture: String;
    name: String;
    price: String;
    stock: String;
    description: String;
  };
}) {
  try {
    const result: Response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/product`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          productPicture: data.productPicture,
          name: data.name,
          price: data.price,
          stock: data.stock,
          description: data.description,
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

export function retrieveFoodName(fileInput) {
  var myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  // myHeaders.append("Content-Type", "multipart/form-data");
  myHeaders.append(
    "Authorization",
    "Bearer 295428c9a7c625f77fa3a8925c57dabe4aeb37e0"
  );

  var formdata = new FormData();
  formdata.append("image", fileInput);

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: formdata,
    redirect: "follow",
  };
  const foodInfo = fetch(
    "https://api.logmeal.es/v2/image/recognition/complete/v1.0?language=eng",
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => result)
    .catch((error) => error);

  return foodInfo;
}

export function confirmFoodName(fileInput) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Accept", "application/json");
  myHeaders.append(
    "Authorization",
    "Bearer 295428c9a7c625f77fa3a8925c57dabe4aeb37e0"
  );

  var raw = JSON.stringify(fileInput);

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(
    "https://api.logmeal.es/v2/image/confirm/dish/v1.0?language=eng",
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}

export async function confirmFoodQuantity(fileInput) {
  var myHeaders = new Headers();
  myHeaders.append(
    "Authorization",
    "Bearer 295428c9a7c625f77fa3a8925c57dabe4aeb37e0"
  );
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify(fileInput);

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  await fetch(
    "https://api.logmeal.es/v2/nutrition/confirm/quantity",
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}

export function getFoodNutriInfo(fileInput) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Accept", "application/json");
  myHeaders.append(
    "Authorization",
    "Bearer 295428c9a7c625f77fa3a8925c57dabe4aeb37e0"
  );

  var raw = JSON.stringify(fileInput);

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  const foodInfo = fetch(
    "https://api.logmeal.es/v2/nutrition/recipe/nutritionalInfo/v1.0?language=eng",
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => result)
    .catch((error) => error);
  return foodInfo;
}

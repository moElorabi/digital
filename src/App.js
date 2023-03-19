import React from "react";
import "./App.css";
import Webcam from "react-webcam";
import {
  retrieveFoodName,
  confirmFoodName,
  confirmFoodQuantity,
  getFoodNutriInfo,
} from "./services/image-detection-api";

function App() {
  const webcamRef = React.useRef(null);
  const [imgSrc, setImgSrc] = React.useState(null);
  const [foods, setFoods] = React.useState(null);
  const [imageId, setImageId] = React.useState(null);
  const [selectedFood, setSelectedFood] = React.useState(null);
  const [nutriInfo, setNutriInfo] = React.useState(null);

  const handleUploadImage = async (e) => {
    const foodNames = await retrieveFoodName(e.target.files[0]);
    const parsedFoodNames = JSON.parse(foodNames);
    setImageId(parsedFoodNames.imageId);
    arrangeObj(parsedFoodNames.recognition_results);
  };

  const arrangeObj = (arr) => {
    const myArr = arr.map((e) => {
      return e.subclasses;
    });
    const flattedArr = myArr.flat();
    const myArrWithNoSubclasses = arr.map((e) => {
      delete e.subclasses;
      return e;
    });
    const twoArr = [...flattedArr, ...myArrWithNoSubclasses];
    const finalResult = twoArr.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.name === value.name)
    );
    setFoods(finalResult);
  };

  const handleConfirmFood = (e) => {
    setSelectedFood({ ...selectedFood, imageId: imageId, name: e.name });
    confirmFoodName({
      confirmedClass: [e.id, e.name],
      imageId: imageId,
      source: ["logmeal", "other"],
    });
  };

  const handleQuantitiy = (e) => {
    setSelectedFood({
      ...selectedFood,
      quantity: e,
    });
  };

  const handleRetriveNutriInfo = async () => {
    await confirmFoodQuantity({
      imageId: selectedFood.imageId,
      quantity: parseInt(selectedFood.quantity),
    });
    const nutriInfo = await getFoodNutriInfo({
      imageId: selectedFood.imageId,
    });
    const parsedNutriInfo = JSON.parse(nutriInfo);
    setNutriInfo(parsedNutriInfo);
  };
  return (
    <>
      <label>
        Your Image File
        <input
          type="file"
          name="image"
          id="image"
          accept="image/png, image/jpeg"
          onChange={(e) => handleUploadImage(e)}
        />
      </label>
      <div className="list-group">
        {foods &&
          foods.map((e, key) => {
            return (
              <button
                key={key}
                type="button"
                className="list-group-item list-group-item-action"
                onClick={() => handleConfirmFood(e)}
              >
                {e.name}
              </button>
            );
          })}
      </div>
      <label>Quantity: </label>
      <input
        type="number"
        id="quantity"
        name="quantity"
        min="1"
        onInput={(e) => handleQuantitiy(e.target.value)}
      />

      <div>
        {selectedFood && (
          <span className="m-5">
            Food: {selectedFood?.name ? selectedFood?.name : "Choose a food"}
          </span>
        )}
        {selectedFood && (
          <span>
            Quantity: {selectedFood?.quantity ? selectedFood?.quantity : 0}gm
          </span>
        )}
      </div>
      <button
        type="button"
        className="btn btn-primary d-block"
        onClick={() => handleRetriveNutriInfo()}
      >
        Calculate calories
      </button>
      <div className="m-5 text-danger text-center">
        {nutriInfo && (
          <span className="m-5 text-danger text-center">
            {selectedFood?.quantity}gm of {selectedFood?.name} have{" "}
            {Math.trunc(nutriInfo?.nutritional_info?.calories)} calories
          </span>
        )}
      </div>
    </>
  );
}

export default App;

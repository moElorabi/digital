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
  const [loading, setLoding] = React.useState(false);

  const handleUploadImage = async (e) => {
    setLoding(true);
    const foodNames = await retrieveFoodName(e.target.files[0]);
    const parsedFoodNames = JSON.parse(foodNames);
    setImageId(parsedFoodNames.imageId);
    arrangeObj(parsedFoodNames.recognition_results);
    setLoding(false);
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
    <div className="d-flex justify-content-center flex-column m-3">
      <div className="mb-3">
        <input
          type="file"
          name="image"
          id="image"
          accept="image/png, image/jpeg"
          onChange={(e) => handleUploadImage(e)}
        />
      </div>
      {loading ? (
        <div class="spinner-border text-primary" role="status"></div>
      ) : (
        <>
          <div className="mb-3">
            <select
              class="form-select"
              aria-label="Default select example"
              id="food"
              onChange={(e) => {
                let select = document.getElementById("food");
                let option = select.options[select.selectedIndex];

                handleConfirmFood({
                  name: option.innerHTML,
                  id: parseInt(e.target.value),
                });
              }}
            >
              <option selected>Choose food</option>
              {foods &&
                foods.map((e) => {
                  return (
                    <option key={e.id} value={e.id}>
                      {e.name}
                    </option>
                  );
                })}
            </select>
          </div>

          <div className="mb-3">
            <label>Quantity: </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="1"
              onInput={(e) => handleQuantitiy(e.target.value)}
            />
          </div>

          <div className="d-flex justify-content-between mb-2">
            <h5>
              Food:{" "}
              <span class="badge bg-primary">
                {selectedFood?.name ? selectedFood?.name : "Choose a food"}
              </span>
            </h5>
            <h5>
              Quantity:{" "}
              <span class="badge bg-primary">
                {selectedFood?.quantity ? selectedFood?.quantity : 0}gm
              </span>
            </h5>
          </div>
          <button
            type="button"
            className="btn btn-primary d-block"
            onClick={() => handleRetriveNutriInfo()}
          >
            Calculate calories
          </button>
        </>
      )}
      <div className="m-5 text-danger text-center">
        {nutriInfo && (
          <h5>
            <span class="badge bg-primary">
              {selectedFood?.quantity}gm of {selectedFood?.name} have{" "}
              {Math.trunc(nutriInfo?.nutritional_info?.calories)} calories
            </span>
          </h5>
        )}
      </div>
    </div>
  );
}

export default App;

import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { Chips } from "primereact/chips";
import { Toast } from "primereact/toast";
import { notify } from "../utils/notification.util";
import { createProductQuery, useFetch } from "../utils/gpl.util";

type Props = {
  visible: boolean;
  onHide: () => void;
  pushToProductList: any;
};

const AddProduct: React.FC<Props> = ({
  visible,
  onHide,
  pushToProductList,
}) => {
  const [edited, setEdited] = useState<boolean>(false);
  const toastRef: any = React.useRef();
  const { fetchData, isLoading } = useFetch(createProductQuery, null, false);
  const [productData, setProductData] = useState<any>({
    title: "",
    description: "",
    images: [],
    currentPrice: 0,
    originalPrice: 0,
    rating: 0,
    stock: 0,
    category: "",
    exclusive: false,
    tags: [],
    specifications: [],
    color: "",
    brand: "",
    tagline: "",
  });

  function updateData(
    field: string,
    value: string | boolean | string[],
    type?: string
  ) {
    const update: any = { ...productData };
    update[field] = type === "number" ? Number(value) : value;
    setProductData(update);
    setEdited(true);
  }

  function addSpecificationField() {
    const update: any = {
      ...productData,
      specifications: [...productData?.specifications!],
    };
    update.specifications?.push({
      id: crypto.randomUUID(),
      key: "",
      value: "",
    });

    setProductData(update);
    setEdited(true);
  }

  function removeSpecificationField(id: string) {
    const arr = [...productData?.specifications!];
    const update: any = { ...productData };
    update["specifications"] = arr.filter((item: any) => item.id !== id);

    setProductData(update);
    setEdited(true);
  }

  function updateSpecificationFields(field: string, value: string, id: string) {
    const arr = [...productData?.specifications!];
    const productDataUpdate: any = { ...productData };

    let fieldToUpdate = { ...arr.find((item: any) => item.id === id) };
    const updatedArr = arr.filter((item) => item.id !== id);

    fieldToUpdate[field] = value;
    updatedArr.push(fieldToUpdate);
    productDataUpdate["specifications"] = updatedArr;

    setProductData(productDataUpdate);
    setEdited(true);
  }

  async function createProduct() {
    if (
      !productData.title ||
      !productData.description ||
      !productData.category ||
      !productData.currentPrice ||
      !productData.originalPrice ||
      !productData.color
    ) {
      notify(
        {
          title: "Error!",
          message: "Please fill all the fields!",
          type: "error",
        },
        toastRef
      );
      return;
    }

    const res = await fetchData(productData);
    if (res.createProduct && !res.createProduct.isError) {
      const productUpdate = { ...productData };
      productUpdate._id = res.createProduct.data;
      pushToProductList(productUpdate);

      onHide();
      notify(
        { title: "Success!", message: "Product Created 🔥", type: "info" },
        toastRef
      );
    } else {
      notify(
        { title: "Oops!", message: "Something went wrong ❌", type: "error" },
        toastRef
      );
    }
  }

  return (
    <>
      <Toast ref={toastRef} />
      <Dialog
        header="Add new product"
        visible={visible}
        style={{ width: "50vw" }}
        onHide={onHide}
      >
        <div className="mt-6">
          <div className="my-4">
            <label htmlFor="title" className="block mb-2">
              Product Title
            </label>
            <InputText
              value={productData?.title}
              id="title"
              className="w-full p-inputtext-sm"
              onChange={({ target }) => updateData("title", target.value)}
            />
          </div>
          <div className="my-4">
            <label htmlFor="description" className="block mb-2">
              Description
            </label>
            <InputTextarea
              value={productData?.description}
              id="description"
              rows={5}
              className="w-full p-inputtext-sm"
              onChange={({ target }) => updateData("description", target.value)}
            />
          </div>
          <div className="flex justify-between my-4">
            <div className="flex-1 mr-4">
              <label htmlFor="currentPrice" className="block mb-2">
                Current Price
              </label>
              <InputText
                value={productData?.currentPrice}
                id="currentPrice"
                className="w-full p-inputtext-sm"
                type={"number"}
                onChange={({ target }) =>
                  updateData("currentPrice", target.value, "number")
                }
              />
            </div>
            <div className="flex-1">
              <label htmlFor="originalPrice" className="block mb-2">
                Original Price
              </label>
              <InputText
                id="originalPrice"
                type={"number"}
                className="w-full p-inputtext-sm"
                value={productData?.originalPrice}
                onChange={({ target }) =>
                  updateData("originalPrice", target.value, "number")
                }
              />
            </div>
          </div>
          <div className="flex justify-between my-4">
            <div className="flex-1 mr-4">
              <label htmlFor="brand" className="block mb-2">
                Brand
              </label>
              <InputText
                value={productData?.brand}
                id="brand"
                className="w-full p-inputtext-sm"
                onChange={({ target }) => updateData("brand", target.value)}
              />
            </div>
            <div className="flex-1">
              <label htmlFor="rating" className="block mb-2">
                Rating
              </label>
              <InputText
                id="rating"
                type={"number"}
                className="w-full p-inputtext-sm"
                value={productData?.rating}
                onChange={({ target }) =>
                  updateData("rating", target.value, "number")
                }
              />
            </div>
          </div>
          <div className="flex justify-between my-4">
            <div className="flex-1 mr-4">
              <label htmlFor="stock" className="block mb-2">
                Stock
              </label>
              <InputText
                value={productData?.stock}
                id="stock"
                type={"number"}
                className="w-full p-inputtext-sm"
                onChange={({ target }) =>
                  updateData("stock", target.value, "number")
                }
              />
            </div>
            <div className="flex-1">
              <label htmlFor="exclusive" className="block mb-2">
                Exclusive Product
              </label>
              <Dropdown
                id="exclusive"
                className="w-full p-inputtext-sm"
                value={productData?.exclusive ? "Yes" : "No"}
                options={["Yes", "No"]}
                placeholder="Select Option"
                onChange={(e) =>
                  updateData("exclusive", e.value === "Yes" ? true : false)
                }
              />
            </div>
          </div>
          {productData?.exclusive ? (
            <div>
              <label htmlFor="tagline" className="block mb-2">
                Product Tagline
              </label>
              <InputText
                value={productData?.tagline || ""}
                id="tagline"
                className="w-full p-inputtext-sm"
                onChange={({ target }) => updateData("tagline", target.value)}
              />
            </div>
          ) : (
            <></>
          )}
          <div className="flex justify-between my-4">
            <div className="flex-1 mr-4">
              <label htmlFor="category" className="block mb-2">
                Product Category
              </label>
              <Dropdown
                id="category"
                className="w-full p-inputtext-sm"
                value={productData?.category}
                options={[
                  "Mobiles & Tablets",
                  "Computers & Laptops",
                  "Accessories",
                  "TV's & Monitors",
                ]}
                onChange={(e) => updateData("category", e.value)}
                placeholder="Select Category"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="color" className="block mb-2">
                Product Color
              </label>
              <Dropdown
                id="color"
                className="w-full p-inputtext-sm"
                value={productData?.color}
                options={["Red", "Blue", "Black", "White", "Green"]}
                onChange={(e) => updateData("color", e.value)}
                placeholder="Select Option"
              />
            </div>
          </div>
          <Divider />
          <div className="flex-1 my-4">
            <label className="block mb-2">Specifications</label>
            {productData.specifications.map((item: any) => {
              return (
                <div key={item.id} className="flex justify-between my-4">
                  <div className="flex-1 mr-4">
                    <InputText
                      value={item.key}
                      className="w-full p-inputtext-sm"
                      onChange={({ target }) =>
                        updateSpecificationFields("key", target.value, item.id)
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <InputText
                      className="w-full p-inputtext-sm"
                      value={item.value}
                      onChange={({ target }) =>
                        updateSpecificationFields(
                          "value",
                          target.value,
                          item.id
                        )
                      }
                    />
                  </div>
                  <Button
                    icon="pi pi-times"
                    onClick={() => removeSpecificationField(item.id)}
                    className="p-button-sm !ml-2 p-button-rounded p-button-outlined p-button-danger"
                  />
                </div>
              );
            })}
            <Button
              onClick={addSpecificationField}
              label="Add Field"
              className="w-full !my-4 p-button-outlined p-button-help p-button-sm"
              icon="pi pi-plus"
            />
          </div>
          <Divider />
          <div className="flex-1 my-4">
            <label className="block mb-2">Product Tags</label>
            <Chips
              className="w-full p-inputtext-sm"
              value={productData?.tags}
              onChange={(e) => updateData("tags", e.value)}
              separator=","
            />
          </div>
        </div>
        <Button
          disabled={!edited}
          onClick={createProduct}
          loading={isLoading}
          label="Create Product"
          className="w-full !my-4 p-button-sm"
          icon="pi pi-plus"
        />
      </Dialog>
    </>
  );
};

export default AddProduct;

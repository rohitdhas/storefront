import { IProduct } from "../interfaces";
import { Sidebar } from "primereact/sidebar";
import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Chips } from "primereact/chips";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";

type Props = {
  product: IProduct | undefined;
  visible: boolean;
  onHide: () => void;
};

const EditProduct: React.FC<Props> = ({ product, visible, onHide }) => {
  const [productData, setProductData] = useState<IProduct | undefined>();
  const [edited, setEdited] = useState<boolean>(false);

  useEffect(() => {
    setProductData(product);
    setEdited(false);
  }, [product]);

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

  if (!product) return <></>;
  return (
    <div className="w-[100vw]">
      <Sidebar
        className="!w-full lg:!w-[40%] relative"
        visible={visible}
        position="right"
        onHide={onHide}
      >
        <h2 className="text-2xl font-bold text-slate-800">
          Edit Product Details ✏️
        </h2>
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
          <div className="flex-1">
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
          label="Update Product"
          className="w-full !my-4"
          icon="pi pi-pencil"
        />
      </Sidebar>
    </div>
  );
};

// specifications, images,
export default EditProduct;

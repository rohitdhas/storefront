import { updateProductQuery, useFetch } from "../utils/gpl.util";
import { IProduct } from "../interfaces";
import { Sidebar } from "primereact/sidebar";
import React, { useEffect, useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Chips } from "primereact/chips";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { ImageUpload } from "./fileUpload";
import { notify } from "../utils/notification.util";
import { Badge } from "primereact/badge";
import Image from "next/image";
import { Toast } from "primereact/toast";

type Props = {
  product: IProduct | undefined;
  visible: boolean;
  onHide: () => void;
  updateProductList: (product: IProduct) => void;
};

const EditProduct: React.FC<Props> = ({
  product,
  visible,
  onHide,
  updateProductList,
}) => {
  const [productData, setProductData] = useState<IProduct | undefined>();
  const [edited, setEdited] = useState<boolean>(false);
  const [uploadPopupVisible, setUploadPopupVisible] = useState<boolean>(false);
  const toastRef: any = useRef();
  const { fetchData, isLoading } = useFetch(updateProductQuery, null, false);

  useEffect(() => {
    if (product) {
      const filteredProduct: any = JSON.parse(JSON.stringify(product));
      delete filteredProduct.__typename;

      filteredProduct.specifications.forEach((item: any) => {
        delete item.__typename;
      });

      setProductData(filteredProduct);
      setEdited(false);
    }
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

    setEdited(true);
    setProductData(update);
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

  function removeImage(url: string) {
    const imgArr: string[] = [...productData?.images!];
    const update: any = { ...productData };
    update["images"] = imgArr.filter((imgUrl) => imgUrl !== url);

    setProductData(update);
    setEdited(true);
  }

  function addImages(imgs: string[]) {
    const imgArr: string[] = [...productData?.images!, ...imgs];
    const update: any = { ...productData };
    update["images"] = imgArr;

    setProductData(update);
  }

  async function updateProductData() {
    if (!edited) return;
    const res = await fetchData(productData);
    if (res.updateProduct) {
      notify(
        { title: "Success", message: "Product Updated!✅", type: "success" },
        toastRef
      );
      updateProductList(productData!);
      onHide();
    } else {
      notify(
        { title: "Opps...", message: "Something went wrong!", type: "error" },
        toastRef
      );
    }
  }

  function ImageUploadBtn() {
    return (
      <div
        onClick={() => setUploadPopupVisible(true)}
        className="hover:border-primary hover:text-primary cursor-pointer mx-4 my-2 p-2 border border-slate-300 rounded-md p-overlay-badge h-auto w-[90px] flex align items-center justify-center"
      >
        <i className="pi pi-plus !text-xl font-bold" />
      </div>
    );
  }

  if (!product) return <></>;
  return (
    <>
      <Toast ref={toastRef} />
      <div className="w-[100vw]">
        <Sidebar
          className="!w-full lg:!w-[45%] relative"
          visible={visible}
          position="right"
          onHide={onHide}
        >
          <ImageUpload
            productId={productData?._id!}
            visible={uploadPopupVisible}
            addImages={addImages}
            onHide={() => setUploadPopupVisible(false)}
          />
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
                onChange={({ target }) =>
                  updateData("description", target.value)
                }
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
              {productData?.specifications.map((item: any) => {
                return (
                  <div key={item.id} className="flex justify-between my-4">
                    <div className="flex-1 mr-4">
                      <InputText
                        value={item.key}
                        className="w-full p-inputtext-sm"
                        onChange={({ target }) =>
                          updateSpecificationFields(
                            "key",
                            target.value,
                            item.id
                          )
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
            <div className="flex-1 my-4">
              <label className="block mb-2">Product Images</label>
              <div className="w-full flex flex-wrap">
                {productData?.images.map((img) => {
                  return (
                    <div
                      key={img}
                      className="mx-4 my-2 p-2 border border-slate-300 rounded-md p-overlay-badge"
                    >
                      <Badge
                        onClick={() => removeImage(img)}
                        className="cursor-pointer"
                        severity="danger"
                        value={"X"}
                      />

                      <div className="relative h-[70px] w-[90px] mx-auto my-4">
                        <Image
                          src={`${process.env.BUCKET_URL}/${img}`}
                          alt="product_image"
                          layout={"fill"}
                          objectFit={"contain"}
                        />
                      </div>
                    </div>
                  );
                })}
                <ImageUploadBtn />
              </div>
            </div>
          </div>
          <Button
            disabled={!edited}
            onClick={updateProductData}
            loading={isLoading}
            label="Update Product"
            className="w-full !my-4 p-button-sm"
            icon="pi pi-pencil"
          />
        </Sidebar>
      </div>
    </>
  );
};

export default EditProduct;

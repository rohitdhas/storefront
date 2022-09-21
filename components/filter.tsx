import { Accordion, AccordionTab } from "primereact/accordion";
import { SelectButton } from "primereact/selectbutton";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { Rating } from "primereact/rating";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import React, { useState } from "react";

const Filter: React.FC = () => {
  const [brands, setBrands] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [outOfStock, setOutofStock] = useState<boolean>(false);
  const [rating, setRating] = useState<number | null | undefined>(0);

  const onBrandChange = (e: any) => {
    let selectedBrands: any = [...brands];

    if (e.checked) {
      selectedBrands.push(e.value);
    } else {
      selectedBrands.splice(selectedBrands.indexOf(e.value), 1);
    }
    setBrands(selectedBrands);
  };

  const colorOptions = [
    { icon: "pi pi-circle-fill text-error mr-2", value: "Red" },
    { icon: "pi pi-circle-fill text-secondary mr-2", value: "Blue" },
    { icon: "pi pi-circle-fill text-slate-900 mr-2", value: "Black" },
    { icon: "pi pi-circle-fill text-slate-200 mr-2", value: "White" },
    { icon: "pi pi-circle-fill text-success mr-2", value: "Green" },
  ];

  const colorTemplate = (option: { icon: string; value: string }) => {
    return (
      <span>
        <i className={option.icon} />
        <span>{option.value}</span>
      </span>
    );
  };

  return (
    <div className="my-4">
      <Accordion className="w-[300px]">
        <AccordionTab header="Product Range">
          <div className="flex justify-between">
            <span className="mr-2">
              <label htmlFor="from-input" className="font-semibold text-sm">
                From
              </label>
              <InputText
                id="from-input"
                type="text"
                className="p-inputtext-sm block w-[100%]"
              />
            </span>
            <span>
              <label htmlFor="to-input" className="font-semibold text-sm">
                To
              </label>
              <InputText
                id="to-input"
                type="text"
                className="p-inputtext-sm block w-[100%]"
              />
            </span>
          </div>
        </AccordionTab>
        <AccordionTab header="Brands">
          <div className="field-checkbox my-2">
            <Checkbox
              className="mr-2"
              inputId="keychron"
              name="brand"
              value="Keychron"
              onChange={onBrandChange}
              checked={brands.indexOf("Keychron") !== -1}
            />
            <label htmlFor="keychron">Keychron</label>
          </div>
          <div className="field-checkbox my-2">
            <Checkbox
              className="mr-2"
              inputId="dell"
              name="brand"
              value="Dell"
              onChange={onBrandChange}
              checked={brands.indexOf("Dell") !== -1}
            />
            <label htmlFor="dell">Dell</label>
          </div>
          <div className="field-checkbox my-2">
            <Checkbox
              className="mr-2"
              inputId="acer"
              name="brand"
              value="Acer"
              onChange={onBrandChange}
              checked={brands.indexOf("Acer") !== -1}
            />
            <label htmlFor="acer">Acer</label>
          </div>
          <div className="field-checkbox my-2">
            <Checkbox
              className="mr-2"
              inputId="sony"
              name="brand"
              value="Sony"
              onChange={onBrandChange}
              checked={brands.indexOf("Sony") !== -1}
            />
            <label htmlFor="sony">Sony</label>
          </div>
          <div className="field-checkbox my-2">
            <Checkbox
              className="mr-2"
              inputId="longitech"
              name="brand"
              value="Longitech"
              onChange={onBrandChange}
              checked={brands.indexOf("Longitech") !== -1}
            />
            <label htmlFor="longitech">Longitech</label>
          </div>
          <div className="field-checkbox my-2">
            <Checkbox
              className="mr-2"
              inputId="razer"
              name="brand"
              value="Razer"
              onChange={onBrandChange}
              checked={brands.indexOf("Razer") !== -1}
            />
            <label htmlFor="razer">Razer</label>
          </div>
          <div className="field-checkbox my-2">
            <Checkbox
              className="mr-2"
              inputId="samsung"
              name="brand"
              value="Samsung"
              onChange={onBrandChange}
              checked={brands.indexOf("Samsung") !== -1}
            />
            <label htmlFor="samsung">Samsung</label>
          </div>
          <div className="field-checkbox my-2">
            <Checkbox
              className="mr-2"
              inputId="apple"
              name="brand"
              value="Apple"
              onChange={onBrandChange}
              checked={brands.indexOf("Apple") !== -1}
            />
            <label htmlFor="apple">Apple</label>
          </div>
          <div className="field-checkbox my-2">
            <Checkbox
              className="mr-2"
              inputId="realme"
              name="brand"
              value="Realme"
              onChange={onBrandChange}
              checked={brands.indexOf("Realme") !== -1}
            />
            <label htmlFor="realme">Realme</label>
          </div>
          <div className="field-checkbox my-2">
            <Checkbox
              className="mr-2"
              inputId="boat"
              name="brand"
              value="Boat"
              onChange={onBrandChange}
              checked={brands.indexOf("Boat") !== -1}
            />
            <label htmlFor="boat">Boat</label>
          </div>
        </AccordionTab>
        <AccordionTab header="Categories">
          <div className="field-checkbox my-2">
            <Checkbox
              className="mr-2"
              inputId="mobile_tablets"
              name="category"
              value="Mobiles & Tablets"
              onChange={onBrandChange}
              checked={brands.indexOf("Mobiles & Tablets") !== -1}
            />
            <label htmlFor="mobile_tablets">Mobiles & Tablets</label>
          </div>
          <div className="field-checkbox my-2">
            <Checkbox
              className="mr-2"
              inputId="computers_laptops"
              name="category"
              value="Computers & Laptops"
              onChange={onBrandChange}
              checked={brands.indexOf("Computers & Laptops") !== -1}
            />
            <label htmlFor="computers_laptops">Computers &amp; Laptops</label>
          </div>
          <div className="field-checkbox my-2">
            <Checkbox
              className="mr-2"
              inputId="accessories"
              name="category"
              value="Accessories"
              onChange={onBrandChange}
              checked={brands.indexOf("Accessories") !== -1}
            />
            <label htmlFor="accessories">Accessories</label>
          </div>
          <div className="field-checkbox my-2">
            <Checkbox
              className="mr-2"
              inputId="tv_monitors"
              name="category"
              value="TV's & Monitors"
              onChange={onBrandChange}
              checked={brands.indexOf("TV's & Monitors") !== -1}
            />
            <label htmlFor="tv_monitors">TV&apos;s &amp; Monitors</label>
          </div>
        </AccordionTab>
        <AccordionTab header="Rating">
          <Rating value={rating!} onChange={(e) => setRating(e.value)} />
        </AccordionTab>
        <AccordionTab header="Colors">
          <SelectButton
            value={colors}
            options={colorOptions}
            onChange={(e) => setColors(e.value)}
            itemTemplate={colorTemplate}
            optionLabel="value"
            multiple
          />
        </AccordionTab>
        <AccordionTab header="Stock">
          <div className="field-checkbox my-2">
            <Checkbox
              className="mr-2"
              inputId="stock"
              name="inStock"
              value={outOfStock}
              onChange={(e) => setOutofStock(e.checked)}
              checked={outOfStock}
            />
            <label htmlFor="stock">Out of Stock</label>
          </div>
        </AccordionTab>
      </Accordion>
      <Card className="w-[300px] my-2 sticky bottom-0 shadow-lg">
        <Button label="Apply Filters" className="p-button-sm mr-2" />
        <Button label="Reset" className="p-button-outlined p-button-sm" />
      </Card>
    </div>
  );
};

export default Filter;

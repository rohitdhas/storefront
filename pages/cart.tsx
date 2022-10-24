import {
  numFormatter,
  getRandomId,
  reloadNextAuthSession,
  calculatePriceBreakdown,
} from "../utils/main.utils";

import { removeFromCart, updateProductQuantity } from "../utils/cart.utils";
import { notify } from "../utils/notification.util";
import { useSelector, useDispatch } from "react-redux";
import { updateCart } from "../redux/userSlice";
import type { RootState } from "../redux/store";
import { useSession, signIn } from "next-auth/react";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Accordion, AccordionTab } from "primereact/accordion";
import { SelectButton } from "primereact/selectbutton";
import {
  useFetch,
  updateAddressQuery,
  createCheckoutQuery,
} from "../utils/gpl.util";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { motion } from "framer-motion";
import React, { useState, useRef, useEffect } from "react";
import { NextPage } from "next";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { IProduct, IAddress } from "../interfaces/index";

const Cart: NextPage = () => {
  const { cart: products }: any = useSelector((state: RootState) => state.user);
  const [selectedAddress, setSelectedAddress] = useState<IAddress>();
  const [loginBtnLoading, setLoginBtnLoading] = useState<boolean>(false);
  const { status, data: session }: any = useSession();
  const [addressPopupVisible, setAddressPopupVisible] =
    useState<boolean>(false);
  const toast = useRef<any>();

  const [priceBreakdown, setPriceBreakDown] = useState({
    cartValue: 0,
    discount: 0,
    shipping: 0,
    tax: 0,
    total: 0,
  });

  const { isLoading, fetchData: createStripeCheckout } = useFetch(
    createCheckoutQuery,
    null,
    false
  );

  useEffect(() => {
    const res = calculatePriceBreakdown(products);
    setPriceBreakDown(res);
  }, [products]);

  async function checkout() {
    if (!selectedAddress) return;
    if (priceBreakdown.total >= 1000000) {
      notify(
        {
          title: "There's an Issue!",
          message: "The total amount of cart must be no more than ₹999,999.99.",
          type: "error",
        },
        toast
      );
      return;
    }

    const productArr = products.map((item: IProduct) => {
      return {
        productId: item._id,
        quantity: item.quantity,
      };
    });

    const res = await createStripeCheckout({
      cartItems: productArr,
      addressId: selectedAddress?.id,
    });

    if (!res.isError) {
      const { data } = res.createOrder;
      window.location = data.stripeURL;
    } else {
      notify(
        {
          title: "Opps!",
          message: "Something went wrong!",
          type: "error",
        },
        toast
      );
    }
  }

  return (
    <div className="max-w-[1600px] mx-auto">
      <Head>
        <title>Checkout</title>
        <meta
          name="description"
          content="Explore the greatest product deals on the internet"
        />
        <link rel="shortcut icon" href="logo.svg" type="image/x-icon" />
      </Head>
      <Toast ref={toast} />
      <main>
        {!products.length ? (
          <div className="w-max mx-auto text-center">
            <div className="relative h-[200px] w-[250px] md:h-[400px] md:w-[400px] mx-auto my-4">
              <Image
                src="/empty_cart.svg"
                alt="product_image"
                layout={"fill"}
                objectFit={"contain"}
              />
            </div>
            <div className="mt-6">
              <h5 className="font-bold text-slate-800">Your Cart is Empty!</h5>
              <p className="text-sm text-gray-500">
                Find your favorite products and add them to your cart.
              </p>
            </div>
            <Link href={"/products"}>
              <a>
                <Button
                  label="Explore Products"
                  className="p-button-sm !my-6"
                />
              </a>
            </Link>
          </div>
        ) : (
          <div className="flex justify-evenly flex-col align items-center md:items-start md:flex-row pt-6">
            <div className="w-[95%] md:w-[35%]">
              <h5 className="text-xl font-bold text-info mb-4">
                Cart Items ({products.length}) 🎈
              </h5>
              <section>
                <div className="grid grid-cols-1 gap-4">
                  {products.map((product: IProduct) => {
                    return <CartItem key={product._id} product={product} />;
                  })}
                </div>
              </section>
              <Divider />
              <div>
                <p className="flex justify-between">
                  <span className="font-bold text-slate-800">
                    Grand Total:{" "}
                  </span>
                  <span className="text-info">
                    {numFormatter(priceBreakdown.total)}
                  </span>
                </p>
                <Accordion className="accordion-custom !mt-4" activeIndex={0}>
                  <AccordionTab
                    header={
                      <>
                        <i className="pi pi-info-circle mx-2"></i>
                        <span>Price Breakdown</span>
                      </>
                    }
                  >
                    <p className="flex justify-between align items-center mb-2">
                      <span className="text-info text-sm">Cart Value</span>
                      <span className="font-bold text-slate-800">
                        {numFormatter(priceBreakdown.cartValue)}
                      </span>
                    </p>
                    <p className="flex justify-between align items-center mb-2">
                      <span className="text-info text-sm">Discount</span>
                      <span className="font-bold text-slate-800">
                        {numFormatter(priceBreakdown.discount)}
                      </span>
                    </p>
                    <p className="flex justify-between align items-center mb-2">
                      <span className="text-info text-sm">Shipping</span>
                      <span className="font-bold text-slate-800">
                        {numFormatter(priceBreakdown.shipping)}
                      </span>
                    </p>
                    <p className="flex justify-between align items-center mb-2">
                      <span className="text-info text-sm">Tax/VAT</span>
                      <span className="font-bold text-slate-800">
                        {numFormatter(priceBreakdown.tax)}
                      </span>
                    </p>
                    <Divider />
                    <p className="flex justify-between align items-center mb-2">
                      <span className="text-info text-sm">Total</span>
                      <span className="font-bold text-slate-800">
                        {numFormatter(priceBreakdown.total)}
                      </span>
                    </p>
                  </AccordionTab>
                </Accordion>
              </div>
            </div>
            <div className="w-[95%] md:w-[32%] mt-4 md:mt-0">
              {status === "authenticated" ? (
                <div className="sticky top-20">
                  <AddressForm
                    visible={addressPopupVisible}
                    close={() => setAddressPopupVisible(false)}
                  />
                  <h5 className="text-xl font-bold text-info !mb-4">
                    Choose Shipping Address 🚚
                  </h5>
                  <Button
                    onClick={() => setAddressPopupVisible(true)}
                    label="+ Add new"
                    className="p-button-outlined w-full py-5 mb-2"
                  />
                  <SelectButton
                    value={selectedAddress}
                    options={session?.user?.address}
                    onChange={(e) => setSelectedAddress(e.value)}
                    itemTemplate={addressTemplate}
                    optionLabel="value"
                    id="addressList"
                  />
                  <Button
                    label="Procced to checkout"
                    icon="pi pi-wallet"
                    onClick={checkout}
                    loading={isLoading}
                    className="w-full !my-2 p-button-warning"
                    disabled={!selectedAddress}
                  />
                </div>
              ) : (
                <div className="mx-auto text-center sticky top-20">
                  <Image src="/cart.svg" alt="cart" height={300} width={300} />
                  <p className="text-slate-800">
                    Please login or signup to continue.
                  </p>
                  <p className="text-xs text-info">
                    You will need to choose/add an address.
                  </p>
                  <Button
                    onClick={() => {
                      setLoginBtnLoading(true);
                      signIn("google");
                    }}
                    label="Login or Sign Up"
                    loading={loginBtnLoading}
                    className="p-button-sm !my-4"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const CartItem: React.FC<{ product: IProduct }> = React.memo(({ product }) => {
  const savings = product.originalPrice - product.currentPrice;
  const savingsPercentage = ((savings / product.originalPrice) * 100).toFixed(
    2
  );
  const dispatch = useDispatch();

  const updateQuantity = (type: string) => {
    const updatedCart = updateProductQuantity(product._id, type);
    dispatch(updateCart({ updatedCart: updatedCart! }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex align items-center justify-between border border-gray-300 rounded-md w-full p-4"
    >
      <div className="flex align items-center">
        <div className="relative h-[90px] w-[120px]">
          <Image
            src={`${process.env.BUCKET_URL}/${product.images[0]}`}
            alt="product_image"
            layout={"fill"}
            objectFit={"contain"}
          />
        </div>
        <div className="ml-4">
          <h6 className="font-bold flex justify-between align items-center">
            <span>{product.title}</span>
          </h6>
          <div className="mt-2">
            <p>
              <span className="text-slate-700">
                {numFormatter(product.currentPrice)}{" "}
              </span>
              <span className="line-through text-sm text-info">
                {numFormatter(product.originalPrice)}
              </span>
            </p>
            <p className="text-xs">
              Savings{" "}
              <span className="text-success font-bold">
                {numFormatter(savings)}
              </span>{" "}
              ({savingsPercentage}%)
            </p>
          </div>
          <div className="mt-2">
            <Button
              onClick={() => {
                if (product.quantity! > 1) {
                  updateQuantity("remove");
                }
              }}
              label="-"
              className="p-button-sm text-xs !px-3 !py-1"
            />
            <span className="mx-2 font-bold text-info">{product.quantity}</span>
            <Button
              onClick={() => {
                if (product.quantity! < 10) updateQuantity("add");
              }}
              label="+"
              className="p-button-sm text-xs !px-3 !py-1"
            />
          </div>
        </div>
      </div>
      <motion.div
        className="h-full"
        whileTap={{ scale: 0.8 }}
        whileHover={{ width: "100px" }}
      >
        <Button
          onClick={() => {
            const update = removeFromCart(product._id);
            dispatch(updateCart({ updatedCart: update }));
          }}
          icon="pi pi-trash"
          className="p-button-sm p-button-danger text-xs md:!h-full !w-full !rounded-sm"
        />
      </motion.div>
    </motion.div>
  );
});

const addressTemplate = (address: IAddress) => {
  return (
    <div className="w-full text-left p-2">
      <span>
        {address.apartment}, {address.street}
      </span>
      <br />
      <span>{address.city}</span>
      <br />
      <span>
        {address.state}, {address.country}
      </span>
      <br />
      <span className="font-bold">{address.zipCode}</span>
      <br />
      <span>{address.phone}</span>
    </div>
  );
};

export const AddressForm = ({
  visible,
  close,
}: {
  visible: boolean;
  close: () => void;
}) => {
  const [apartment, setApartment] = useState<string>("");
  const [street, setStreet] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [zipCode, setZipCode] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const toast = useRef<any>();

  const { fetchData, isLoading } = useFetch(updateAddressQuery, null, false);

  const Footer = () => {
    return (
      <div>
        <Button
          onClick={close}
          label="Close"
          icon="pi pi-times"
          className="p-button-text"
        />
        <Button
          disabled={
            !apartment ||
            !street ||
            !city ||
            !state ||
            !country ||
            !zipCode ||
            !phone
          }
          onClick={addAddress}
          label="Submit"
          loading={isLoading}
          icon="pi pi-plus"
        />
      </div>
    );
  };

  const addAddress = async () => {
    if (
      !apartment ||
      !street ||
      !city ||
      !state ||
      !country ||
      !zipCode ||
      !phone
    )
      return;

    const address = {
      id: getRandomId(),
      apartment,
      street,
      city,
      state,
      country,
      zipCode,
      phone,
    };

    const { updateAddress }: any = await fetchData({
      address,
      updateType: "ADD",
    });
    if (updateAddress && !updateAddress.isError) {
      notify(
        { title: "Success!", message: updateAddress.message, type: "success" },
        toast
      );
      reloadNextAuthSession();
    } else {
      notify(
        { title: "Opps!", message: "Something went wrong!", type: "error" },
        toast
      );
    }

    close();
  };
  return (
    <>
      <Toast position="bottom" ref={toast} />
      <Dialog
        header="Add new address"
        visible={visible}
        draggable={false}
        className="w-[550px]"
        footer={<Footer />}
        onHide={close}
      >
        <div>
          <div className="my-2">
            <label htmlFor="apartment" className="block mb-2">
              Apartment
            </label>
            <InputText
              value={apartment}
              id="apartment"
              className="w-full p-inputtext-sm"
              onChange={({ target }) => setApartment(target.value)}
            />
          </div>
          <div className="my-2">
            <label htmlFor="street" className="block mb-2">
              Street
            </label>
            <InputText
              id="street"
              className="w-full p-inputtext-sm"
              value={street}
              onChange={({ target }) => setStreet(target.value)}
            />
          </div>
        </div>
        <div className="flex justify-between my-2">
          <div className="flex-1 mr-4">
            <label htmlFor="city" className="block mb-2">
              City
            </label>
            <InputText
              value={city}
              id="city"
              className="w-full p-inputtext-sm"
              onChange={({ target }) => setCity(target.value)}
            />
          </div>
          <div className="flex-1">
            <label htmlFor="state" className="block mb-2">
              State
            </label>
            <InputText
              id="state"
              className="w-full p-inputtext-sm"
              value={state}
              onChange={({ target }) => setState(target.value)}
            />
          </div>
        </div>
        <div className="flex justify-between my-2">
          <div className="flex-1 mr-4">
            <label htmlFor="country" className="block mb-2">
              Country
            </label>
            <InputText
              value={country}
              id="country"
              className="w-full p-inputtext-sm"
              onChange={({ target }) => setCountry(target.value)}
            />
          </div>
          <div className="flex-1">
            <label htmlFor="zip-code" className="block mb-2">
              Zip Code
            </label>
            <InputText
              id="zip-code"
              className="w-full p-inputtext-sm"
              value={zipCode}
              onChange={({ target }) => setZipCode(target.value)}
            />
          </div>
        </div>
        <div>
          <div className="my-2">
            <label htmlFor="phone" className="block mb-2">
              Phone
            </label>
            <InputText
              value={phone}
              id="phone"
              className="w-full p-inputtext-sm"
              onChange={({ target }) => setPhone(target.value)}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default Cart;

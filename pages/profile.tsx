import React, { useState, useRef } from "react";
import { NextPage } from "next";
import { InputText } from "primereact/inputtext";
import { useSession, getSession } from "next-auth/react";
import Image from "next/image";
import Head from "next/head";
import { AddressForm } from "./cart";
import { useFetch, updateAddressQuery } from "../utils/gpl.util";
import { Button } from "primereact/button";
import { reloadNextAuthSession } from "../utils/main.utils";
import { notify } from "../utils/notification.util";
import { Toast } from "primereact/toast";

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

const Profile: NextPage = () => {
  const { data: session }: any = useSession();
  const [name, setName] = useState<string>(session.user?.name);
  const [addressPopupVisible, setAddressPopupVisible] =
    useState<boolean>(false);

  return (
    <div className="mx-2 mt-4 max-w-[1600px] md:px-6 md:mx-auto">
      <Head>
        <title>Profile</title>
        <meta
          name="description"
          content="Explore the greatest product deals on the internet"
        />
        <link rel="shortcut icon" href="logo.svg" type="image/x-icon" />
      </Head>
      <main className="mx-4 md:mx-auto md:w-[50%]">
        <h3 className="text-2xl font-bold text-slate-800 !my-6 text-center">
          Account Settings ⚙️
        </h3>
        <Image
          src={session.user?.image!}
          alt="profile_pic"
          className="rounded-md"
          height={100}
          width={100}
        />
        <div className="md:w-[100%] my-6">
          <div className="my-3">
            <label htmlFor="name" className="block mb-2 text-sm">
              Name
            </label>
            <InputText
              value={name}
              id="name"
              className="w-full p-inputtext-sm"
              onChange={({ target }) => setName(target.value)}
            />
          </div>
          <div className="my-3">
            <label htmlFor="email" className="block mb-2 text-sm">
              Email
            </label>
            <InputText
              value={session.user?.email}
              id="email"
              disabled
              className="w-full p-inputtext-sm"
            />
          </div>
          <div className="flex justify-between">
            <div className="my-3 mr-4 flex-1">
              <label htmlFor="cur_pass" className="block mb-2 text-sm">
                Current Password
              </label>
              <InputText id="cur_pass" className="w-full p-inputtext-sm" />
            </div>
            <div className="my-3 flex-1">
              <label htmlFor="new_pass" className="block mb-2 text-sm">
                New Password
              </label>
              <InputText id="new_pass" className="w-full p-inputtext-sm" />
            </div>
          </div>
        </div>
        <div>
          <Button label="Update" disabled className="!mr-4" />
          <Button label="Cancel" disabled />
        </div>
        <div className="mt-10">
          <h4 className="text-xl font-bold text-info">Address</h4>
          <AddressForm
            visible={addressPopupVisible}
            close={() => setAddressPopupVisible(false)}
          />
          <Button
            onClick={() => setAddressPopupVisible(true)}
            label="+ Add new"
            className="p-button-outlined w-full py-5 mt-4"
          />
          <div>
            {session.user?.address &&
              session.user?.address.map((address: any) => {
                return <AddressTemplate key={address.id} address={address} />;
              })}
          </div>
        </div>
      </main>
    </div>
  );
};

const AddressTemplate = ({ address }: any) => {
  const { fetchData, isLoading } = useFetch(updateAddressQuery, null, false);
  const toast: any = useRef();

  async function removeAddress() {
    const { updateAddress }: any = await fetchData({
      address,
      updateType: "REMOVE",
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
  }

  return (
    <div className="w-full text-left p-4 text-sm border border-slate-500 rounded-md my-4 flex justify-between">
      <Toast ref={toast} />
      <div>
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
      <Button
        onClick={removeAddress}
        icon="pi pi-trash"
        loading={isLoading}
        className="p-button-danger"
      />
    </div>
  );
};

export default Profile;

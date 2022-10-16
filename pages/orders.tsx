import { NextPage } from "next";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { getOrdersQuery, useFetch } from "../utils/gpl.util";
import { formatDate, numFormatter } from "../utils/main.utils";
import { useSession } from "next-auth/react";
import { Tag } from "primereact/tag";
import Image from "next/image";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { updateCart } from "../redux/userSlice";
import Link from "next/link";
import Loader from "../components/spinner";
import { ORDER_STATUS } from "../constants/index";
import { IAddress } from "../interfaces/index";

let addresses: IAddress[] = [];

const Orders: NextPage = () => {
  const [orders, setOrders] = useState([]);
  const [expandedRows, setExpandedRows] = useState<any>();
  const { data, isLoading } = useFetch(getOrdersQuery, null);
  const { data: session }: any = useSession();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (router.query.success === "true") {
      localStorage.setItem("cart", JSON.stringify([]));
      dispatch(updateCart({ updatedCart: [] }));
    }
  }, [router.query]);

  useEffect(() => {
    if (data) {
      setOrders(data.orders);
    }
  }, [data]);

  useEffect(() => {
    if (session) {
      addresses = session?.user.address;
    }
  }, [session]);

  return (
    <div className="mx-2 mt-4 max-w-[1600px] md:px-6 md:mx-auto">
      <Head>
        <title>Orders</title>
        <meta
          name="description"
          content="Explore the greatest product deals on the internet"
        />
        <link rel="shortcut icon" href="logo.svg" type="image/x-icon" />
      </Head>
      <Loader loading={isLoading} />
      <main>
        <div>
          <h3 className="text-2xl font-bold">My Orders</h3>
          <p className="text-sm text-info">
            Here are all the orders you&apos;ve made!
          </p>
        </div>
        <div className="!my-6">
          {orders.length ? (
            <DataTable
              rows={10}
              paginator
              expandedRows={expandedRows}
              onRowToggle={(e) => setExpandedRows(e.data)}
              rowExpansionTemplate={rowExpansionTemplate}
              responsiveLayout="scroll"
              value={orders}
            >
              <Column field="order_id" header="Order ID" />
              <Column
                header="Total Amount"
                body={(rowData) => numFormatter(rowData.totalAmount)}
              />
              <Column
                header="Order Status"
                body={(rowData) => (
                  <Tag
                    icon={`pi ${ORDER_STATUS[rowData.status].icon}`}
                    severity={ORDER_STATUS[rowData.status].type}
                    value={rowData.status}
                  />
                )}
              />
              <Column
                header="Ordered On"
                body={(rowData) => formatDate(parseInt(rowData.createdAt))}
              />
              <Column
                header="Delivery By"
                body={(rowData) =>
                  rowData.paid
                    ? formatDate(parseInt(rowData.deliveryDate))
                    : "-"
                }
              />
              <Column
                header="Paid"
                body={(rowData) => (rowData.paid ? "✅" : "❌")}
              />
              <Column header="More Details" expander />
            </DataTable>
          ) : (
            <div className="mx-auto text-center">
              <Image
                height={400}
                width={400}
                src="/orders.svg"
                alt="No Results Found"
              />
              <h5 className="font-bold text-slate-700">No Orders Found</h5>
              <p className="text-sm text-slate-500">
                Go buy something or try changing the search term.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const rowExpansionTemplate = (data: {
  address: string;
  products: any;
  paymentReceipt: string;
}) => {
  const { address: addressId, products } = data;

  const shippingAddress = addresses.find(
    (address: { id: string }) => address.id === addressId
  );

  return (
    <div>
      <div className="my-3">
        <h4 className="font-bold text-slate-800 mb-2">
          Cart Items ({products.length}) 🛒
        </h4>
        <ul>
          {products.map(
            (item: { productId: string; title: string; quantity: number }) => {
              return (
                <li key={item.productId}>
                  <Link href={`/products?id=${item.productId}`}>
                    <a
                      target={"_blank"}
                      className="hover:text-blue-500 hover:underline"
                    >
                      - {item.title}
                    </a>
                  </Link>{" "}
                  X <span>{item.quantity}</span>
                </li>
              );
            }
          )}
        </ul>
      </div>
      {shippingAddress ? (
        <div className="my-3">
          <h4 className="font-bold text-slate-800 mb-2">Shpping Address 🚚</h4>
          <div className="w-full text-left text-sm">
            <span>
              {shippingAddress.apartment}, {shippingAddress.street}
            </span>
            <br />
            <span>{shippingAddress.city}</span>
            <br />
            <span>
              {shippingAddress.state}, {shippingAddress.country}
            </span>{" "}
            (<span className="font-bold">{shippingAddress.zipCode}</span>)
            <br />
            <span>Phone - {shippingAddress.phone}</span>
          </div>
        </div>
      ) : (
        <></>
      )}
      {data.paymentReceipt ? (
        <div className="my-3">
          <Link href={data.paymentReceipt}>
            <a
              className="text-secondary hover:text-blue-700 hover:underline"
              target={"_blank"}
            >
              &gt; See Payment Receipt 📄
            </a>
          </Link>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Orders;

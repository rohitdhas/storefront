import { NextPage } from "next";
import Head from "next/head";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import Image from "next/image";
import { numFormatter } from "../utils/main.utils";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import Link from "next/link";

const Wishlist: NextPage = () => {
  const { wishlist }: any = useSelector((state: RootState) => state.user);
  return (
    <div className="mx-2 mt-4 max-w-[1600px] md:px-6 md:mx-auto">
      <Head>
        <title>Wishlist</title>
        <meta
          name="description"
          content="Explore the greatest product deals on the internet"
        />
        <link rel="shortcut icon" href="logo.svg" type="image/x-icon" />
      </Head>
      <div>
        <h3 className="text-2xl font-bold">Your Wishlist 💖</h3>
      </div>
      <div className="my-4">
        <DataTable value={wishlist} responsiveLayout="scroll">
          <Column
            align={"center"}
            header="Product"
            body={(rowData) => {
              return (
                <div>
                  <Image src={rowData.images[0]} height={100} width={130} />
                  <div>
                    <Link href={`/products?id=${rowData._id}`}>
                      <a className="font-bold text-slate-800 hover:text-blue-500">
                        {rowData.title}
                      </a>
                    </Link>
                  </div>
                </div>
              );
            }}
          />
          <Column
            header="Price"
            align={"center"}
            body={(rowData) => {
              const savings = rowData.originalPrice - rowData.currentPrice;
              const savingsPercentage = (
                (savings / rowData.originalPrice) *
                100
              ).toFixed(2);

              return (
                <div>
                  <span className="font-semibold text-slate-700">
                    {numFormatter(rowData.currentPrice)}
                  </span>{" "}
                  <span className="line-through text-sm text-gray-400">
                    {numFormatter(rowData.originalPrice)}
                  </span>
                  <p className="text-sm text-info">
                    You&apos;ll save{" "}
                    <span className="text-success font-semibold">
                      {numFormatter(savings)}
                    </span>{" "}
                    ({savingsPercentage}
                    %)
                  </p>
                </div>
              );
            }}
          />
          <Column
            header="Stock Status"
            align={"center"}
            body={(rowData) => {
              console.log(rowData);
              return (
                <>
                  {rowData.stock > 0 ? (
                    <div>
                      {rowData.stock < 10 ? (
                        <p className="text-red-400 font-semibold">
                          Only {rowData.stock} left in stock!
                        </p>
                      ) : (
                        <p className="font-semibold">In Stock ✅</p>
                      )}
                    </div>
                  ) : (
                    <span className="font-semibold">Out Of Stock ❌</span>
                  )}
                </>
              );
            }}
          />
          <Column
            header="Actions"
            align={"center"}
            body={(rowData) => {
              return (
                <div className="flex flex-wrap justify-center">
                  {rowData.stock > 0 && (
                    <Button
                      icon="pi pi-shopping-cart"
                      tooltip="Add to cart"
                      tooltipOptions={{ position: "bottom" }}
                      className="p-button-sm mx-2"
                    />
                  )}
                  <Button
                    icon="pi pi-times"
                    tooltip="Remove from wishlist"
                    tooltipOptions={{ position: "bottom" }}
                    className="p-button-sm p-button-danger"
                  />
                </div>
              );
            }}
          />
        </DataTable>
      </div>
    </div>
  );
};

export default Wishlist;

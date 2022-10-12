import { NextPage } from "next";
import Head from "next/head";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import Image from "next/image";
import { numFormatter } from "../utils/main.utils";

const Wishlist: NextPage = () => {
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
        <DataTable value={[]} responsiveLayout="scroll">
          <Column
            header="Product"
            body={(rowData) => {
              return (
                <div>
                  <Image src={rowData.images[0]} height={200} width={200} />
                  <p>{rowData.title}</p>
                </div>
              );
            }}
          />
          <Column
            header="Price"
            body={(rowData) => {
              const savings = rowData.originalPrice - rowData.currentPrice;
              const savingsPercentage = (
                (savings / rowData.originalPrice) *
                100
              ).toFixed(2);

              return (
                <div>
                  <p>{numFormatter(rowData.currentPrice)}</p>
                  <p>{numFormatter(rowData.originalPrice)}</p>
                  <p>
                    You&apos;ll save {numFormatter(savings)} (
                    {savingsPercentage}
                    %)
                  </p>
                </div>
              );
            }}
          />
          <Column
            header="Stock Status"
            body={(rowData) => (rowData.inStock ? "✅" : "❌")}
          />
          <Column
            header="Actions"
            body={(rowData) => {
              return (
                <div>
                  {rowData.inStock && <Button label="Add to Cart" />}
                  <Button label="Remove" icon="pi pi-times" />
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

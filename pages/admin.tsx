import React from "react";
import { getSession } from "next-auth/react";

export async function getServerSideProps(context: any) {
  const session: any = await getSession(context);

  if (!session || session.user.type !== "admin") {
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

function AdminPanal() {
  return (
    <div>
      <p>Hello</p>
    </div>
  );
}

export default AdminPanal;

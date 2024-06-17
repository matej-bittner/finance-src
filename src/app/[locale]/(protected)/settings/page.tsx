import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { z } from "zod";
import { auth, signOut } from "@/auth";
const Settings = async ({ searchParams }: any) => {
  const category = searchParams.category;
  const session = await auth();
  return (
    <div id="settings" className=" flex flex-col w-full gap-2">
      {JSON.stringify(session)}

      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button type="submit">Signout</button>
      </form>
      <div className="flex">
        <Select>
          <SelectTrigger className="w-fit gap-2 focus:outline-none focus:ring-0 bg-transparent focus:ring-offset-0 pl-3 pr-1 py-1.5 sm:py-2 border-none rounded-lg ">
            <p className="text-lg font-semibold">Účet</p>
          </SelectTrigger>
          <SelectContent className="bg-main-gray border-main-gray">
            <Link href="?category=family" className="settings-select-link">
              Zabezpečení
            </Link>
            <Link href="/" className="settings-select-link">
              Předplatné
            </Link>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-fit gap-2 focus:outline-none focus:ring-0 bg-transparent focus:ring-offset-0 pl-3 pr-1 py-1.5 sm:py-2 border-none rounded-lg ">
            <p className="text-lg font-semibold">Obecné</p>
          </SelectTrigger>
          <SelectContent className="bg-main-gray border-main-gray">
            <div className="grid grid-cols-2">
              <Link href="/" className="settings-select-link">
                Připojené účty
              </Link>
              <Link href="/" className="settings-select-link">
                Jazyk
              </Link>
              <Link href="/" className="settings-select-link">
                Rodina
              </Link>
              <Link href="/" className="settings-select-link">
                Měna
              </Link>
            </div>
          </SelectContent>
        </Select>
      </div>
      <div className="w-full flex items-center justify-center">
        <h1 className="text-xl font-semibold underline">Zabezpečení</h1>
      </div>
    </div>
  );
};

export default Settings;

// import React from "react";
// import { auth, signOut } from "@/auth";
// const Settings = async () => {
//   const session = await auth();
//   return (
//     <div>
//       {JSON.stringify(session)}
//
//       <form
//         action={async () => {
//           "use server";
//           await signOut();
//         }}
//       >
//         <button type="submit">Signout</button>
//       </form>
//     </div>
//   );
// };
//
// export default Settings;
//

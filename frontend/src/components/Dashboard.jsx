import React, { useContext } from "react";
import { UserContext } from "../context/usecontext";
import Navber from "./Navber";
import SideMenu from "./SideMenu";

function Dashboard({ children, activeMenu }) {
  const { user } = useContext(UserContext);

  return (
    <div>
      <Navber activeMenu={activeMenu} />
      {user && (
        <div className="flex">
          <div className="max-[1080px]:hidden">
            <SideMenu activeMenu={activeMenu} />
          </div>
          <div className="grow mx-5">{children}</div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;

import React from "react"

import { INavItem } from "@/app/interfaces/front-end/INav"

import NavItem from "../navItem"

interface INavBarPropsType {
  navList: INavItem[]
}
const Navbar: React.FC<INavBarPropsType> = ({ navList }) => {
  return (
    <>
      <div className="flex items-center gap-[40px] ">
        {navList?.map((element, index) => (
          <NavItem key={index} name={element.name} path={element.path} />
        ))}
      </div>
    </>
  )
}

export default Navbar

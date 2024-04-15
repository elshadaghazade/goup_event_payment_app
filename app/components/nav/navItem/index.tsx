import Link from "next/link"
import React from "react"

interface INavItemPropsType {
  path: string
  name: string
}
const NavItem: React.FC<INavItemPropsType> = ({ name, path }) => {
  return (
    <>
      <Link href={path}>
        <h2 className="font-dm text-[14px] font-bold text-[#777E90] cursor-pointer ">
          {name}
        </h2>
      </Link>
    </>
  )
}

export default NavItem

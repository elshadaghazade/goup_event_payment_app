import React from "react"

import { INavItem } from "@/app/interfaces/front-end/INav"

import Navbar from "../../nav/navbar"
import Logo from "../../UI/logo"

const Header: React.FC = () => {
  const navList: INavItem[] = [
    { path: "/", name: "Home" },
    { path: "/api-doc", name: "API Documentation" },
  ]
  return (
    <>
      <header className="bg-">
        <div className="m-auto h-[89px] flex items-center  w-10/12 justify-between">
          {/* left */}
          <div className="flex items-center gap-[40px] ">
            <Logo
              style={
                "text-[27px] text-[#23262F] font-poppins font-semibold cursor-pointer"
              }
              url={'/logo.png'}
              width={36}
              height={36}
              name={"DocPoint"}
            />
            <span className=" h-[48px]  w-px border border-[#E6E8EC]"></span>
            <Navbar navList={navList} />
          </div>
          {/* right */}
          {/* <div className="flex items-center  gap-[24px]">
            <div>
              <LanguageSelector />
            </div>
            <div>
              <Button style=" border-[2px] font-semibold font-dm text-[14px]  px-[12px] py-[6px] text-[#000]">
                {"List doctor"}
              </Button>
            </div>
            <div>
              <Image src={shopCart} alt="shopCart" width={24} height={24} />
            </div>
            <div className="flex gap-[8px]">
              <Button style=" border-[2px]  font-semibold font-dm text-[14px]  px-[12px] py-[6px] text-[#000]">
                {"Log In"}
              </Button>
              <Button style="bg-[#3B71FE] font-semibold font-dm text-[14px]  px-[17px] py-[9px] text-[#fff]">
                {"Sign Up"}
              </Button>
            </div>
          </div> */}
        </div>
      </header>
    </>
  )
}

export default Header

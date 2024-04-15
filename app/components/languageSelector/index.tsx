import React from "react"
import Image from "next/image"
import languageIcon from "@/public/logos/languageIcon.png"

const LanguageSelector = () => {
  return (
    <>
      <div className="flex items-center gap-[8px]">
        <Image src={languageIcon} alt="Language icon" width={16} height={16} />
        <div className="cursor-pointer font-semibold font-dm text-[14px] text-[#777E90]">
          Language
        </div>
      </div>
    </>
  )
}

export default LanguageSelector

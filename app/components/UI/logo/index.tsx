import React from "react"
import Image from "next/image"

interface ILogoPropsType {
  url: string
  name: string
  width: number
  height: number
  style: string
}
const Logo: React.FC<ILogoPropsType> = ({
  url,
  width,
  height,
  name,
  style,
}) => {
  return (
    <>
      <div className="flex items-center gap-[9px]">
        <Image width={width} height={height} src={url} alt="Logo" />
        <h2 className={style}>{name}</h2>
      </div>
    </>
  )
}

export default Logo

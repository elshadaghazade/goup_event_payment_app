import React from "react"

interface IButtonPropsType {
  children: string
  style: string
}
const Button: React.FC<IButtonPropsType> = ({ children, style }) => {
  return (
    <>
      <button className={`cursor-pointer rounded-[90px]  ${style}`}>
        {children}
      </button>
    </>
  )
}

export default Button

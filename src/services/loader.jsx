import React from 'react'
import { ClipLoader } from "react-spinners";

export default function loader() {
  return (
    <div className="loader-className">
      <ClipLoader color="#36d7b7" size={60} />
    </div>
  )
}

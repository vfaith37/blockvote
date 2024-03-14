import React, { useRef, useState } from "react";
import { useNavigate, useNavigation } from "react-router-dom";
import { useFormik } from "formik";
import { candidateSchema } from "../schemas";
import classNames from "classnames";
import client from "../api/client";
import { FaEdit } from "react-icons/fa";
import { HiOutlineTrash } from "react-icons/hi";
import PreviewImage from "./PreviewImage";

const inputStyles =
  "w-[350px] h-11 text-white py-2 my-2 bg-transparent rounded-md border border-white pl-2";

const Modal = (props) => {
  const { onClose, children } = props;
  return (
    <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50 py-10">
      <div className="max-h-full w-full max-w-xl overflow-y-auto sm:rounded-2xl bg-neutral-800">
        {children}
      </div>
    </div>
  );
};
export default Modal;

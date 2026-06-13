import React from "react";

const Modal = (props) => {
  const { children } = props;
  return (
    <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black/60 backdrop-blur-sm py-10">
      <div className="max-h-full w-full max-w-xl overflow-y-auto sm:rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl shadow-black/60">
        {children}
      </div>
    </div>
  );
};
export default Modal;

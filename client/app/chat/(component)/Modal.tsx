import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const Modal = ({ children }: Props) => {
  return (
    <div
      // ref={overlay}
      className="fixed bottom-0 left-0 right-0 top-0 z-10 mx-auto bg-black/60"
      // onClick={onClick}
    >
      <div
        //   ref={wrapper}
        className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 p-6 sm:w-10/12 md:w-8/12 lg:w-1/2"
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;

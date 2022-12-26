import { PropsWithChildren } from "react";

export function H4(props: PropsWithChildren) {
  return (
    <h4 className="border-l-4 border-t-0 border-b-0 border-r-0 border-blue-500 border-solid pl-4">{props.children}</h4>
  );
}

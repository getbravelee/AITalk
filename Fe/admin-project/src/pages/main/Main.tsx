import { ReactNode } from 'react';

interface MainProps {
  children: ReactNode;
}

export default function Main({ children }: MainProps): React.JSX.Element {
  return (
    <div>
      <main>{children}</main>
    </div>
  );
}

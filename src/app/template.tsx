export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col flex-1 w-full">
      {children}
    </div>
  );
}

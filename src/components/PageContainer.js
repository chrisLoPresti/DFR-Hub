import SideNavigation from "./SideNavigation";

const PageContainer = ({ children }) => {
  return (
    <>
      <header className="sticky top-0">
        <div className="bg-tertiary w-full h-12 shadow-lg"></div>
      </header>
      <div className="flex h-[calc(100vh_-_48px)] relative">
        <SideNavigation />
        {children}
      </div>
    </>
  );
};

export default PageContainer;

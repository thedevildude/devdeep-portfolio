const Header = () => {
  return (
    <header className="fixed top-0 left-0 z-50 flex w-full flex-row items-center justify-between">
      <div>Logo</div>
      <nav className="flex flex-row gap-4">
        <div>Work</div>
        <div>Linkedin</div>
        <div>Resume</div>
      </nav>
    </header>
  );
};

export default Header;

import { UserNav } from './user-nav';
import { VaultIcon } from './custom-icons';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <a className="mr-6 flex items-center space-x-2" href="/">
            <VaultIcon className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline sm:inline-block">
              Vault Hunter HQ
            </span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <UserNav />
        </div>
      </div>
    </header>
  );
};

export default Header;

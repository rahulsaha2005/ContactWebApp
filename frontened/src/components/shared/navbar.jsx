import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "../ui/button.jsx";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover.jsx";
import { Avatar, AvatarImage } from "../ui/avatar.jsx";
import { LogOut, User2, Menu, X } from "lucide-react";

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  const getAvatar = () => {
    if (!user) return "";
    return user.profile
      ? user.profile
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
          user.fullname
        )}&background=random&color=fff`; // fallback random
  };

  const popContent = user && (
    <Popover>
      <PopoverTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={getAvatar()} />
        </Avatar>
      </PopoverTrigger>

      <PopoverContent className="w-80">
        <div className="flex items-center gap-4 mb-4">
          <Avatar>
            <AvatarImage src={getAvatar()} />
          </Avatar>
          <div>
            <h4 className="font-medium">{user.fullname}</h4>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 text-gray-600">
          <Link to="/profile" className="flex items-center gap-2">
            <User2 className="text-blue-500" />
            <Button variant="link">View Profile</Button>
          </Link>

          <div className="flex items-center gap-2 cursor-pointer">
            <LogOut className="text-red-500" />
            <Button variant="link">Logout</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );

  const LoginSignup = (
    <div className="flex flex-col sm:flex-row gap-2">
      <Link to="/login">
        <Button variant="outline" className="w-full sm:w-auto">
          LOGIN
        </Button>
      </Link>
      <Link to="/signup">
        <Button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700">
          SIGN UP
        </Button>
      </Link>
    </div>
  );

  // Dynamic date
  const formattedDate = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <nav className="bg-white shadow">
      <div className="flex items-center justify-between mx-auto max-w-6xl h-16 px-4">
        {/* Logo + Date */}
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">
            My<span className="text-indigo-600">Contacts</span>
          </h1>
          <span className="text-gray-500 text-sm hidden sm:block">
            {formattedDate}
          </span>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-12">
          <ul className="flex gap-10 font-medium">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/browse">Browse</Link>
            </li>
          </ul>

          {!loading && (user ? popContent : LoginSignup)}
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3">
          <ul className="flex flex-col gap-2">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/browse">Browse</Link>
            </li>
          </ul>
          {!loading && (user ? popContent : LoginSignup)}
        </div>
      )}
    </nav>
  );
};

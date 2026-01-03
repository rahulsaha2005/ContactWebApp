import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button.jsx";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover.jsx";
import { Avatar, AvatarImage } from "../ui/avatar.jsx";
import { LogOut, User2, Menu, X } from "lucide-react";
import axios from "axios";
import { USER_API_END_POINT } from "../../utils/constant.js";
import { toast } from "sonner";
import { setAuthUser } from "../../redux/authSlice";

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading } = useSelector((state) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setAuthUser(null));
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      dispatch(setAuthUser(null));
      toast.error(error?.response?.data?.message || "Logout failed");
      navigate("/login");
    }
  };

  const isActive = (path) =>
    location.pathname === path
      ? "text-indigo-600 font-semibold"
      : "text-gray-600 hover:text-indigo-600";

  const getAvatar = () =>
    user?.profile ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.fullname || "User"
    )}&background=random&color=fff`;

  const popContent = user && (
    <Popover>
      <PopoverTrigger asChild>
        <Avatar className="cursor-pointer ring-2 ring-indigo-500/30 hover:ring-indigo-500 transition">
          <AvatarImage src={getAvatar()} />
        </Avatar>
      </PopoverTrigger>

      <PopoverContent className="w-80 rounded-xl p-4 shadow-xl">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={getAvatar()} />
          </Avatar>
          <div>
            <h4 className="font-semibold">{user.fullname}</h4>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Link
            to="/profile"
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            <User2 className="text-indigo-500" size={18} />
            <span>View Profile</span>
          </Link>

          <button
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 text-red-500 transition"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );

  const LoginSignup = (
    <div className="flex gap-3">
      <Link to="/login">
        <Button variant="outline">Login</Button>
      </Link>
      <Link to="/signup">
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
          Sign Up
        </Button>
      </Link>
    </div>
  );

  const formattedDate = new Date().toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto h-16 px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-2xl font-bold">
            My<span className="text-indigo-600">Contacts</span>
          </Link>
          <span className="hidden sm:block text-sm text-gray-500">
            {formattedDate}
          </span>
        </div>

        <div className="hidden md:flex items-center gap-10">
          <ul className="flex gap-8 text-sm">
            <li>
              <Link to="/" className={isActive("/")}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/browse" className={isActive("/browse")}>
                Browse
              </Link>
            </li>
          </ul>

          {!loading && (user ? popContent : LoginSignup)}
        </div>

        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur border-t px-4 py-4 space-y-4">
          <ul className="flex flex-col gap-3 text-sm">
            <li>
              <Link to="/" className={isActive("/")}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/browse" className={isActive("/browse")}>
                Browse
              </Link>
            </li>
          </ul>

          {!loading &&
            (user ? (
              <div className="flex flex-col gap-2">
                <Link
                  to="/profile"
                  className="px-3 py-2 hover:bg-gray-100 rounded"
                >
                  Profile
                </Link>
                <button
                  className="px-3 py-2 text-red-500 hover:bg-red-50 rounded"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                    Sign Up
                  </Button>
                </Link>
              </div>
            ))}
        </div>
      )}
    </nav>
  );
};

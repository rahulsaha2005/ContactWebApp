import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Users, Shield, Search } from "lucide-react";
import { useSelector } from "react-redux";

export default function Home() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="relative min-h-[calc(100vh-64px)] p-4 bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500 overflow-hidden">
      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-white">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Manage Your Contacts
            <span className="block text-yellow-300">
              Smart • Secure • Simple
            </span>
          </h1>

          <p className="mt-6 text-lg text-white/90">
            MyContacts helps you store, manage, and access your contacts
            securely from anywhere — fast and easy.
          </p>

          {!user && (
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/signup">
                <Button className="bg-white text-indigo-600 hover:bg-gray-100 font-semibold">
                  Get Started
                </Button>
              </Link>
              <Link to="/browse">
                <Button variant="outline" className="border-white text-white">
                  Browse Contacts
                </Button>
              </Link>
            </div>
          )}

          {user && (
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/browse">
                <Button variant="outline" className="border-white text-white">
                  Browse Contacts
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="bg-white/85 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/30">
            <Users className="text-indigo-600 mb-4" size={32} />
            <h3 className="text-xl font-semibold text-gray-800">
              Easy Contact Management
            </h3>
            <p className="text-gray-600 mt-2">
              Add, edit, and organize your contacts effortlessly in one place.
            </p>
          </div>

          <div className="bg-white/85 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/30">
            <Shield className="text-green-600 mb-4" size={32} />
            <h3 className="text-xl font-semibold text-gray-800">
              Secure & Private
            </h3>
            <p className="text-gray-600 mt-2">
              Your data is protected with modern authentication and security.
            </p>
          </div>

          <div className="bg-white/85 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/30">
            <Search className="text-pink-600 mb-4" size={32} />
            <h3 className="text-xl font-semibold text-gray-800">Fast Search</h3>
            <p className="text-gray-600 mt-2">
              Find contacts instantly with powerful search and filters.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

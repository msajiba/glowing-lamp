import Link from "next/link";

import LogoutButton from "./logout-button";

import { getCurrentUser } from "@/fetcher";

export default async function Navbar() {
  const user = await getCurrentUser();

  return (
    <nav className="bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-2xl font-bold text-primary">SOFTEKO</span>
            </Link>
          </div>
          <div className="mr-2">
            <div className="ml-10 flex items-center space-x-4">
              {user?.role === "ADMIN" ? (
                <>
                  <Link
                    href="/employees"
                    className="text-white bg-gray-700  px-3 py-2 rounded-md text-sm font-medium"
                  >
                    employees
                  </Link>
                  <Link
                    href="/attendance-list"
                    className="text-white bg-gray-700  px-3 py-2 rounded-md text-sm font-medium"
                  >
                    attendance list
                  </Link>
                </>
              ) : null}

              <Link
                href="/attendance"
                className="text-white bg-gray-700  px-3 py-2 rounded-md text-sm font-medium"
              >
                Attendance
              </Link>

              <LogoutButton />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

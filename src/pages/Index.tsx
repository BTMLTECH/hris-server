import Login from "@/components/Login";
import Dashboard from "@/components/Dashboard/Dashboard";

import { useAppSelector } from "@/store/hooks";

const Index = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  try {
    return isAuthenticated && user ? <Dashboard /> : <Login />;
  } catch (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Something went wrong
          </h1>
          <p className="text-gray-600">Please refresh the page to try again.</p>
        </div>
      </div>
    );
  }
};

export default Index;

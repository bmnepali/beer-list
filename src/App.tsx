import { lazy, Suspense } from "react";
import { ToastContainer } from "react-toastify";
import Loader from "./compponents/Loader";

import "react-toastify/dist/ReactToastify.css";
import "./styles.css";

const BeerListPage = lazy(() => import("./pages/BeerListPage"));

export default function App() {
  return (
    <div className="houzz-app">
      <ToastContainer />
      <Suspense fallback={<Loader />}><BeerListPage /></Suspense>
    </div>
  );
}

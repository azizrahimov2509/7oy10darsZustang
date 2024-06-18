import { useEffect, useState } from "react";
import { useStore } from "./store";
import "./App.css";
import { useQuery } from "@tanstack/react-query";

function App() {
  const [select, setSelect] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: [select, search, sortBy],
    queryFn: async () => {
      const url =
        select === "all"
          ? `https://dummyjson.com/products/search?q=${search}&sortBy=${sortBy}`
          : `https://dummyjson.com/products/category/${select}?sortBy=${sortBy}`;
      const req = await fetch(url);
      const res = await req.json();
      return res?.products;
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const req = await fetch("https://dummyjson.com/products/categories");
      const res = await req.json();
      return res;
    },
  });

  const { addToCart, cart, incrementCount, decrementCount } = useStore(
    (state) => state
  );

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Dark mode state and toggle function
  const [darkMode, setDarkMode] = useState(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    return savedDarkMode ? JSON.parse(savedDarkMode) : false;
  });

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", JSON.stringify(newDarkMode));
    document.documentElement.setAttribute(
      "data-theme",
      newDarkMode ? "dark" : "light"
    );
  };

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  return (
    <div className="app">
      <section>
        <header className="mb-5 flex gap-5">
          <label className="input input-bordered flex items-center gap-2">
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelect("all");
              }}
              type="text"
              className="grow"
              placeholder="Search"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          </label>
          {categories && (
            <select
              value={select}
              className="select select-bordered w-full max-w-xs mb-4"
              onChange={(e) => {
                setSelect(e.target.value);
                setSearch("");
              }}
            >
              <option value="all">Filter by Category</option>
              {categories.map(({ slug, name }) => (
                <option key={slug} value={slug}>
                  {name}
                </option>
              ))}
            </select>
          )}

          <select
            value={sortBy}
            className="select select-bordered w-full max-w-xs mb-4"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">Sort by</option>
            {["title", "price", "rating"].map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle"
            >
              <div className="indicator">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="badge badge-sm indicator-item">
                  {cart.length}
                </span>
              </div>
            </div>
            <div
              tabIndex={0}
              className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow"
            >
              <div className="card-body">
                <span className="font-bold text-lg">{cart.length} Items</span>
                <div className="card-actions">
                  <button className="btn btn-primary btn-block">
                    View cart
                  </button>
                </div>
              </div>
            </div>
          </div>
          <label className="flex  items-center cursor-pointer gap-2 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
            </svg>
            <input
              type="checkbox"
              className="toggle theme-controller"
              checked={darkMode}
              onChange={toggleDarkMode}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </label>
        </header>
        <div className="grid grid-cols-3 gap-5">
          {data &&
            data.map(({ id, images, price, rating, title }) => (
              <div key={id} className="card w-96 bg-base-100 shadow-md">
                <figure>
                  <img
                    className="w-[320px] h-[320px] object-contain object-center"
                    src={images[0]}
                    alt="Shoes"
                    width={320}
                    height={320}
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">
                    {title}
                    <div className="badge badge-secondary">NEW</div>
                  </h2>
                  <div className="card-actions justify-end">
                    <div className="badge badge-outline p-[8px]">
                      Price - {price}$
                    </div>
                    <div className="badge badge-outline p-[8px]">
                      Rating -{rating}⭐
                    </div>
                  </div>
                </div>
                {cart.findIndex((item) => item.id === id) !== -1 ? (
                  <div className="flex items-center justify-center gap-5">
                    <button
                      className="btn btn-sm btn-primary text-white font-bold"
                      onClick={() => decrementCount(id)}
                    >
                      -
                    </button>
                    <p>
                      {cart[cart.findIndex((item) => item.id === id)].count}
                    </p>
                    <button
                      className="btn btn-sm btn-primary text-white font-bold"
                      onClick={() => incrementCount(id)}
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={() => addToCart(id)}
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            ))}
        </div>
        <div className="flex items-center justify-center">
          {isLoading && (
            <span
              className="  loading loading-spinner loading-lg "
              style={{ zoom: "2" }}
            ></span>
          )}
        </div>
      </section>
    </div>
  );
}

export default App;

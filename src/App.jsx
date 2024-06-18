import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { useStore } from "./store";
import "./App.css";
import { useQuery, useQueryClient } from "@tanstack/react-query";

function App() {
  const queryClient = useQueryClient();
  const [select, setSelect] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const { data, isLoading, error } = useQuery({
    queryKey: [select, search, sortBy],
    queryFn: async () => {
      const url =
        select === "all"
          ? "https://dummyjson.com/products/search?q=" +
            search +
            "&sortBy=" +
            sortBy
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
  console.log(data);

  const { addToCart, cart, incrementCount, decrementCount } = useStore(
    (state) => state
  );

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <>
      <section>
        <header className=" mb-5 flex  gap-5">
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
              {categories.map(({ slug, name, url }) => (
                <option key={slug} value={slug}>
                  {name}
                </option>
              ))}
            </select>
          )}

          <select
            value={sortBy}
            className="select select-bordered w-full max-w-xs mb-4 text-white"
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
        </header>
        <div className="grid grid-cols-3 gap-5">
          {isLoading && (
            <span
              className="loading loading-spinner loading-lg"
              style={{ zoom: "2" }}
            ></span>
          )}
          {data &&
            data.map(({ id, images, price, rating, title }, ind) => {
              return (
                <div
                  key={id}
                  className="card w-96 bg-base-100 shadow-md shadow-white "
                >
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
              );
            })}
        </div>
      </section>
    </>
  );
}

export default App;

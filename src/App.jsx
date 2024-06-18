import { useState } from "react";
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
                </div>
              );
            })}
        </div>
      </section>
    </>
  );
}

export default App;

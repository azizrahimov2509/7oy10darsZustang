import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { useStore } from "./store";
import "./App.css";
import { useQuery, useQueryClient } from "@tanstack/react-query";

function App() {
  const queryClient = useQueryClient();
  const [select, setSelect] = useState("all");
  const { data, isLoading, error } = useQuery({
    queryKey: [select],
    queryFn: async () => {
      const url =
        select === "all"
          ? "https://dummyjson.com/products"
          : `https://dummyjson.com/products/category/${select}`;
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
        <header>
          {categories && (
            <select
              value={select}
              className="select select-bordered w-full max-w-xs mb-4"
              onChange={(e) => setSelect(e.target.value)}
            >
              <option value="all">Filter by Category</option>
              {categories.map(({ slug, name, url }) => (
                <option key={slug} value={slug}>
                  {name}
                </option>
              ))}
            </select>
          )}
        </header>
        <div className="grid grid-cols-3 gap-5">
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

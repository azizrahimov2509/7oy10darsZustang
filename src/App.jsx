import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { useStore } from "./store";
import "./App.css";
import { useQuery, useQueryClient } from "@tanstack/react-query";

function App() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const req = await fetch("https://dummyjson.com/products");
      const res = await req.json();
      return res?.products;
    },
  });

  console.log(data);
  return (
    <>
      <section>
        <div className="grid grid-cols-3">
          {data &&
            data.map(({ id, images, price, rating, title }, ind) => {
              return (
                <div
                  key={id}
                  className="card card-compact w-96 bg-base-100 shadow-xl"
                >
                  <figure>
                    <img
                      className="w-[320px] h-[320px] object-contain object-center"
                      src={images}
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
                      <div className="badge badge-outline p-2">
                        Price - {price}$
                      </div>
                      <div className="badge badge-outline p-2">
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

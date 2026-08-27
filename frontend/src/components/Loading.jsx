import React from "react";

const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="text-center">

        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />

        <p className="mt-4 text-sm font-medium text-slate-500">
          {message}
        </p>
      </div>
    </div>
  );
};

export default Loading;
import React from "react";

const Placeholder = ({ message }) => {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mb-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            </svg>
            <p className="text-lg">{message}</p>
        </div>
    );
};

export default Placeholder;
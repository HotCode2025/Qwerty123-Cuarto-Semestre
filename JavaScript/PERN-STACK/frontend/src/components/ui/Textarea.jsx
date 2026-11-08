import { forwardRef } from "react";

export const Textarea = forwardRef((props, ref) => {
    return (
        <textarea
            className="bg-zinc-800 px-4 py-2 block mb-2 w-full text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows="3"
            ref={ref}
            {...props}
        />
    );
});

export default Textarea;
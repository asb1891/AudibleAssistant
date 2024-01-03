import React, { useState } from "react";

function InputComponent({onUserInputChange}) {
  const [input, setInput] = useState("");

//   const handleChange = (e) => {
//     setInput(e.target.value);
//     onUserInputChange(e.target.value); // Updating state in App.js
//   };
  return (
    <div>
      {/* <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">Write how you want AI to respond</span>
          <span className="label-text-alt"></span>
        </div>
        <input
          type="text"
          value={input}
          onChange={handleChange}
          placeholder="Type Here"
          className="text-sm input input-bordered w-full max-w-xs"
        />
      </label> */}
    </div>
  );
}

export default InputComponent;

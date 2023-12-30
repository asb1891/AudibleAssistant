import React from 'react';

function InputComponent() {


    return (
        // <div className="flex justify-left items-left h-screen your-class">
        <div>
        <label className="form-control w-full max-w-xs">
  <div className="label">
    <span className="label-text">Write how you want AI to respond</span>
    <span className="label-text-alt"></span>
  </div>
  <input type="text" placeholder="Type Here" className="text-sm input input-bordered w-full max-w-xs" />
  {/* <div className="label">
    <span className="label-text-alt">Bottom Left label</span>
    <span className="label-text-alt">Bottom Right label</span>
  </div> */}
</label>
        </div>
    );
}

export default InputComponent;
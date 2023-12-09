import React from 'react';
import Header from './Header';
import "./index.css";

const About = () => {
  return (
    <div>
      {/* Set text color to white */}
      <Header />
      
      <div name="about" id="about" className="flex flex-col justify-center items-center w-full h-screen bg-custom-700">
        <div className="mockup-window border bg-base-300 custom-window">
          <div className="max-w-[1000px] w-full grid grid-cols-2 gap-8 mb-4">
            <div className="sm:text-center pb-8 pl-4">
              <p className="text-4xl font-bold inline border-b-2 border-white text-white">
                About
              </p>
            </div>
            {/* This div was empty in your original code */}
            <div></div>
          </div>
          <div className="max-w-[1000px] w-full grid sm:grid-cols-2 gap-8 px-4">
            <div className="sm:text-center text-4xl font-bold text-white">
              <p>
                Andrew Blumenthal
              </p>
            </div>
            <div className="text-justify text-white">
              <p>
               
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

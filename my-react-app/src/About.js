import React from 'react';
import Header from './Header';
import "./index.css";

const About = () => {
    return (
        <div name="about" id="about" className="w-full h-screen text-black">
          {/* Main content */}
          <div className="flex flex-col justify-center items-center w-full h-full">
            <div className="py-16 rounded-md bg-gray-200 flex flex-col justify-center items-center w-4/6">
              <div className="max-w-[1000px] w-full grid grid-cols-2 gap-8 mb-4">
                <div className="sm:text-right pb-8 pl-4">
                  <p className="text-4xl font-bold inline border-b-4 border-black">
                    About
                  </p>
                </div>
                {/* This div was empty in your original code */}
                <div></div>
              </div>
              <div className="max-w-[1000px] w-full grid sm:grid-cols-2 gap-8 px-4">
                <div className="sm:text-right text-4xl font-bold">
                  <p>
                    Andrew Blumenthal
                  </p>
                </div>
                <div>
                  <p>
                    A software developer with experience in building Responsive and
                    Scalable Web apps. I am well-knowledged in UI/UX principles and
                    practices. In addition to software development, I am also a
                    technical writer--simplifying topics/concepts on the web.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Header component */}
          <div id = "header">
            <Header />
          </div>
        </div>
    );
};

export default About;

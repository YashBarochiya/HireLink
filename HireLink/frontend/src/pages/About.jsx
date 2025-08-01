import React from "react";
import Base from "../base/Base"; // Import Base component
import heroImage from "../assets/images/hero_1.jpg"; // Adjust path as needed
import "../styles/About.css"; // Create and style the about page separately

const About = () => {
  return (
    <Base>
      <section
        className="relative bg-cover bg-center py-20 md:py-32"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              About HireLink
            </h1>
            <p className="text-lg md:text-xl text-gray-200">
              HireLink connects job seekers with top employers, making job searching easy and efficient.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 text-center">
                Our Mission
              </h2>
              <p className="text-gray-600 text-center text-lg">
                Our goal is to bridge the gap between talented professionals and businesses looking for the right candidates.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
                Why Choose Us?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="text-4xl text-green-500 mb-4">✅</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Easy Job Search</h3>
                  <p className="text-gray-600 text-center">
                    Find your dream job with our intuitive search and filtering system
                  </p>
                </div>
                <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="text-4xl text-green-500 mb-4">✅</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Trusted Employers</h3>
                  <p className="text-gray-600 text-center">
                    Connect with verified companies and legitimate job opportunities
                  </p>
                </div>
                <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="text-4xl text-green-500 mb-4">✅</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Efficient Hiring Process</h3>
                  <p className="text-gray-600 text-center">
                    Streamlined application process for both job seekers and employers
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Base>
  );
};

export default About;

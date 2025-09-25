import React from 'react';
const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Main Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-green-700 mb-4">
            About MkulimaHub
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connecting farmers and consumers for a sustainable future.
          </p>
        </div>
        {/* Mission Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-green-200 pb-2">
            Our Mission
          </h2>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <p className="text-gray-700 leading-relaxed">
              MkulimaHub is a digital marketplace dedicated to creating a direct and transparent connection between local farmers and urban consumers. Our mission is to empower farmers by providing them with a platform to sell their fresh, high-quality produce at fair prices, while offering consumers a convenient way to access farm-to-table products.
            </p>
          </div>
        </section>
         {/* What We Do Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-green-200 pb-2">
            What We Do
          </h2>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <p className="text-gray-700 leading-relaxed">
              We simplify the farm-to-fork supply chain. Our platform allows farmers to list their produce, manage inventory, and connect directly with customers. For buyers, we provide a seamless browsing experience to discover a variety of fresh produce, place orders, and track their delivery. We believe in sustainable agriculture and supporting local communities.
            </p>
          </div>
        </section>
        {/* Our Story Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-green-200 pb-2">
            Our Story
          </h2>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <p className="text-gray-700 leading-relaxed">
              Founded by a team passionate about technology and agriculture, MkulimaHub was born out of a desire to solve the inefficiencies in traditional food distribution. We saw an opportunity to use technology to benefit both ends of the supply chain, ensuring farmers get a better share of the profit and consumers receive fresher goods.
            </p>
          </div>
        </section>
{/* Team Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b-2 border-green-200 pb-2">
            Meet the Team
          </h2>
          <p className="text-gray-600 mb-8 text-center">
            Our team is a blend of agricultural experts and tech innovators, all working together to make MkulimaHub a success.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Team Member 1 */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow duration-300 flex flex-col items-center md:flex-row md:items-center">
              <img
                src="https://i.postimg.cc/5tCDYCHF/bill.jpg"
                alt="Billy Kemboi, Co-founder & CEO"
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover mb-4 md:mb-0 md:mr-6 flex-shrink-0"
              />
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold text-gray-800 mb-1">Billy Kemboi</h3>
                <p className="text-green-600 font-semibold mb-2">Co-founder & CEO</p>
                <p className="text-gray-700">
                  Billy is a passionate advocate for sustainable farming and has a background in agricultural economics.
                </p>
              </div>
            </div>
             {/* Team Member 2 */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow duration-300 flex flex-col items-center md:flex-row md:items-center">
              <img
                src="https://via.placeholder.com/120?text=John+Smith"
                alt="John Smith, Co-founder & CTO"
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover mb-4 md:mb-0 md:mr-6 flex-shrink-0"
              />
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold text-gray-800 mb-1">John Smith</h3>
                <p className="text-green-600 font-semibold mb-2">Co-founder & CTO</p>
                <p className="text-gray-700">
                  With years of experience in software development, John builds the seamless technology that powers MkulimaHub.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
export default About;
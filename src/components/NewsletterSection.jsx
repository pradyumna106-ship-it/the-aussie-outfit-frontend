import React, { useState } from 'react';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();

    if (email) {
      console.log('Subscribed Email:', email);

      // Newsletter subscription logic here

      setEmail('');
    }
  };

  return (
    <section className="w-full px-4 sm:px-6 md:px-8 lg:px-[18px] py-8 sm:py-10 md:py-12 lg:py-[74px]">

      <div className="w-full max-w-[1440px] mx-auto">

        <div className="w-full bg-[#968569] px-4 sm:px-8 md:px-12 lg:px-[116px] py-5 sm:py-6 md:py-8 lg:py-[24px] rounded">

          <form
            onSubmit={handleSubscribe}
            className="
              flex flex-col md:flex-row
              justify-start items-start md:items-center
              gap-4 md:gap-6 lg:gap-[52px]
            "
          >

            {/* Title */}
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-bold leading-[24px] sm:leading-[26px] md:leading-[28px] text-[#1d1d1d]">
              Stay up to date
            </h2>

            {/* Input Field */}
            <div className="w-full md:w-[36%]">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="
                  w-full
                  px-4 py-3
                  rounded-md
                  border border-[#cec3ad]
                  bg-white
                  outline-none
                  text-sm
                  text-[#635746]
                  focus:ring-2 focus:ring-[#245441]
                "
              />
            </div>

            {/* Subscribe Button */}
            <button
              type="submit"
              className="
                w-full md:w-auto
                px-5 py-3.5
                bg-[#245441]
                text-white
                rounded-md
                font-semibold
                hover:opacity-90
                transition
              "
            >
              Subscribe
            </button>

          </form>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
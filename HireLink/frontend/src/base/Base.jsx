import React from "react";
import Head from "./Head";
import Header from "./Header";
import Footer from "./Footer";

const Scripts = () => {
  return (
    <>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.5.7/jquery.fancybox.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.4.1/jquery.easing.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/waypoints/4.0.1/jquery.waypoints.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-animateNumber/0.0.14/jquery.animateNumber.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.9.0/js/bootstrap-datepicker.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.13.18/js/bootstrap-select.min.js"></script>
      <script src="/static/js/custom.js"></script>
    </>
  );
};

const Base = ({ children, extraScripts }) => {
  return (
    <div id="top">
      <Head />
      <Header className="navbar-nav" />
      <main>{children}</main>
      <Footer />
      <Scripts />
      {extraScripts && <div dangerouslySetInnerHTML={{ __html: extraScripts }} />}
    </div>
  );
};

export default Base;

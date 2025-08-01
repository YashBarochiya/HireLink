import { useEffect } from "react";

const Scripts = () => {
  useEffect(() => {
    // List of script sources
    const scriptSources = [
      "../assets/js/jquery.min.js",
      "../assets/js/bootstrap.bundle.min.js",
      "../assets/js/isotope.pkgd.min.js",
      "../assets/js/stickyfill.min.js",
      "../assets/js/jquery.fancybox.min.js",
      "../assets/js/jquery.easing.1.3.js",
      "../assets/js/jquery.waypoints.min.js",
      "../assets/js/jquery.animateNumber.min.js",
      "../assets/js/owl.carousel.min.js",
      "../assets/js/bootstrap-datepicker.js",
      "../assets/js/bootstrap-select.min.js",
      "../assets/js/custom.js",
    ];

    // Function to dynamically add scripts
    const addScript = (src) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
    };

    // Load each script
    scriptSources.forEach((src) => addScript(src));

    // Cleanup: Remove scripts when component unmounts
    return () => {
      scriptSources.forEach((src) => {
        const script = document.querySelector(`script[src="${src}"]`);
        if (script) {
          document.body.removeChild(script);
        }
      });
    };
  }, []);

  return (
    <script>
      {`window.CKEDITOR_BASEPATH = '/static/ckeditor/ckeditor/';`}
    </script>
  );
};

export default Scripts;
